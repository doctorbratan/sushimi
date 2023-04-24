const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const User = require('../models/User');
const Client = require('../models/Client');
const errorHandler = require('../utils/errorHandler');

const request = require('request');
const moment = require('moment');

module.exports.find = async (req, res) => {
  try {

    let query = {}

    if (req.body.phone) {
        query.phone = req.body.phone
    }

    if (req.body.city) {
        query.city = req.body.city
    }

    const clients = await Client.find(query)
    res.status(200).json(clients)

  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.catch = async (req, res) => {
    try {

        const candidate = await Client.findById(req.body._id)

        if (candidate) {

            const client = await Client.findOneAndUpdate(
                {_id: req.body._id},
                { $set: req.body },
                {new: true}
            )

            res.status(201).json({message: "Пользователь успешно изменен!", client: client})

        } else {
            res.status(409).json({message: "Пользоватьль не найден!"})
        }

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params._id)
        res.status(201).json({message: "Пользователь удален!"})
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.NumberCheck = async (req, res) => {
  try {

    const candidate = await Client.findOne({phone: req.params.phone})
    if (candidate) {
        res.status(409).json({message: "Номер занят!"})
    } else {
        res.status(202).json({message: "Номер свободен!"})
    }

  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.ClientCheck = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.register = async (req, res) => {

    try {

        const candidate = await Client.findOne({phone: req.params.phone})

        if (candidate) {
            res.status(409).json({message: "Номер занят!"})
        } else {

            const user = {
                created: moment().format(),
                phone: req.body.phone,
                password: between().toString(),
                politic_agree: req.body.politic_agree
            }

            await new Client(user).save()

            var options = {
                'method': 'POST',
                'url': 'https://api.sms.to/sms/send',
                'headers': {
                  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGg6ODA4MC9hcGkvdjEvdXNlcnMvYXBpL2tleS9nZW5lcmF0ZSIsImlhdCI6MTY1NjAwNjU5NiwibmJmIjoxNjU2MDA2NTk2LCJqdGkiOiJmcGMyUnRSaG5aSk9YRUNYIiwic3ViIjozODI1ODgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.6J01I6Ozfh4yeeWc_DPVTSJcbfHb63OtdNZEofz2VJw',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "message": `Пароль для входа в аккаунт: ${user.password}. Вы можете изменить его в личном кабинете.`,
                  "to": `+373${user.phone}`
                })
              
              };

              request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
              });
    
            res.status(201).json({message: "Пользователь успешно зарегистрирован!"})
        }
    

    } catch (e) {
        errorHandler(res,e)
    }

}

module.exports.change_password = async (req, res) => {
    try {

        const candidate = await Client.findOne({_id: req.user._id}).select("_id password")

        if (candidate) {

            if (req.body.old_password === candidate.password) {

                await Client.findOneAndUpdate(
                    {_id: req.user._id},
                    {$set: {password: req.body.new_password}}
                )

                res.status(201).json({message: 'Пароль успешно изменен!'})  

            } else {
                res.status(409).json({message: 'Неверный старый пароль!'})  
            }

        } else {
            res.status(409).json({message: 'Ошибка пользователя, перезагрузите страницу'})
        }


    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.user_settings = async (req, res) => {
    try {

        const candidate = await Client.findOneAndUpdate(
            {_id: req.user._id},
            {$set: req.body}
        )

        if (candidate) {
            const user = await Client.findById(req.user._id).select("_id phone name city street place access salle favorites")
            res.status(201).json({
                message: "Изменения сохраненны!",
                user: user
            })
        } else {
            res.status(409).json({message: 'Ошибка пользователя, перезагрузите страницу'})
        }


    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.favorite = async (req, res) => {
    try {

        let user = await Client.findById(req.user._id).select("favorites")

        if (user) {

            const canidate = user.favorites.find( (item) => item === req.params._id )

            if (canidate) {
                user.favorites.splice( user.favorites.indexOf(canidate), 1 )
            } else {
                user.favorites.push(req.params._id)
            }

            await Client.findOneAndUpdate(
                {_id: req.user._id},
                {$set: {favorites: user.favorites}}
            )

            res.status(201).json({
                favorites: user.favorites
            })
        } else {
            res.status(409).json({message: 'Ошибка пользователя, перезагрузите страницу'})
        }


    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.login = async (req, res) => {
    try {


        const candidate = await Client.findOne({phone: req.body.phone}).select("_id password phone name city street place access salle favorites");
        const date_message = moment().format('HH:mm DD/MM/YYYY');

        if (candidate) {
            // Пользователь существует
            // const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)

            if (req.body.password === candidate.password) {

                if (!candidate.access) {
                    res.status(401).json({message: 'Отказано в доступе!'})
                } else {

                    // Пароли совпали

                    await Client.findOneAndUpdate(
                        {_id: candidate._id},
                        { $push: { enters: { $each: [`Вход выполнен: ${date_message}`], $position: 0 } } }
                    )
                
                    const token = jwt.sign(
                            {userID: candidate._id},
                            keys.jwt , 
                            {expiresIn: '14d'}
                    )
                    
                    res.status(200).json({
                        message: 'Успешно!',
                        token: `Bearer ${token}`,
                        user: candidate
                    })
                    
                }
            

            } else {
                res.status(401).json({message: 'Неверный номер или пароль!'})
            }
    

        }  else {
             res.status(401).json({message: 'Неверный номер или пароль!'})
        }

     

    } catch (e) {
        errorHandler(res, e)
    }
}

function between() {  
    return Math.floor(
      Math.random() * (99999 - 10001) + 10001
    )
  }



