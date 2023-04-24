const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

const request = require('request');
const moment = require('moment');



module.exports.login = async (req, res) => {

    // {$or:[{region: "NA"},{sector:"Some Sector"}]}
    const candidate = await User.findOne({login: req.body.login}).select("_id login password access type place");
    const date_message = moment().format('HH:mm DD/MM/YYYY');

    if (candidate) {
        // Пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)

        if (passwordResult) {
            // Пароли совпали
            if (candidate.type !== "admin") {
                
                if (candidate.access) {

                    const expires = { expiresIn: "12h" }
                    // В Массив Входов
                    await User.findOneAndUpdate(
                       {_id: candidate._id},
                       { $push: { enters: { $each: [`Вход выполнен: ${date_message}`], $position: 0 } } }
                    ) 

    
                    const token = jwt.sign(
                        {userID: candidate._id}, 
                        keys.jwt, 
                        expires
                        )

                   /*  request({
                        url: 'https://belkalounge-bot.herokuapp.com/admin',
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json"
                        },
                        json: {
                            message: `В систему зашел пользователь: ${candidate.name}, Время: ${date_message}. IP: ${req.body.ip}`
                        }
                    }) */
                    
                    res.status(200).json({
                        message: 'Успешно!',
                        token: `Bearer ${token}`,
                        user: candidate
                    })

                } else {

                  /*   request({
                        url: 'https://belkalounge-bot.herokuapp.com/admin',
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json"
                        },
                        json: {
                            message: `Вне смены пытался зайти пользователь: ${candidate.name}, Время: ${date_message}. IP: ${req.body.ip}`
                        }
                    }) */

                    res.status(401).json({message: 'Отказанно в доступе!'})
                }
            } else {

                const token = jwt.sign(
                        {userID: candidate._id},
                        keys.jwt , 
                        {expiresIn: 60 * 120}
                    )
                
                res.status(200).json({
                    message: 'Успешно!',
                    token: `Bearer ${token}`,
                    user: candidate
                })
            }

        } else {
            
            // В Массив Входов
            await User.findOneAndUpdate(
                {_id: candidate._id},
                { $push: { enters: { $each: [`Неверный Пароль: ${date_message}`], $position: 0 } } }
            )    

            /* request({
                url: 'https://belkalounge-bot.herokuapp.com/admin',
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                json: {
                    message: `Неверный пароль ввел пользователь: ${candidate.name}, Время: ${date_message}. IP: ${req.body.ip}`
                }
            }) */
            
            res.status(401).json({message: 'Неверный пароль!'})
        }
    }  else {

        /* request({
            url: 'https://belkalounge-bot.herokuapp.com/admin',
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            json: {
                message: `В систему пытался зайти неизвестный пользователь: ${req.body.login}, Время: ${date_message}. IP: ${req.body.ip}`
            }
        }) */

        res.status(401).json({message: 'Неверный логин!'})
    }
}



module.exports.catch = async (req, res) => {
    try { 
        
        let response = {}

        const candidate = await User.findById(req.body._id)
        const salt = bcrypt.genSaltSync(11);

        if (!candidate) {

            const user = await new User({
                created: moment().format(),
                login: req.body.login,
                password: bcrypt.hashSync(req.body.password, salt),
                access: req.body.access,
                type: req.body.type,
                name: req.body.name,
                place: req.body.place
            }).save()

            response.message = "Пользователь создан!"
            response.user = user

        } else {
            
            let user = {
                login: req.body.login,
                access: req.body.access,
                type: req.body.type,
                name: req.body.name,
                place: req.body.place
            }

            if (req.body.password && req.body.password !== "") {
                user.password = bcrypt.hashSync(req.body.password, salt)
            } 

            const updated = await User.findOneAndUpdate(
                {_id: candidate._id},
                {$set: user },
                {new: true}
            )

            response.message = "Пользователь Изменен!"
            response.user = updated
        }
       
        res.status(201).json(response)

    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.user = async (req, res) => {
    try {

        const user = {
            name: req.user.name,
            type: req.user.type,
            place: req.user.place,
            access: req.user.access
        }

        res.status(200).json(user)

    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.delete = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(201).json({message: "Пользователь удален!"})
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({visible: true}).select('-password')
        res.status(200).json(users)
    } catch (e) {
        errorHandler(res, e)
    }
}

