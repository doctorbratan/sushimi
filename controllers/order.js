const Place = require('../models/Place');
const Order = require('../models/Order');

const errorHandler = require('../utils/errorHandler');
const moment = require('moment');
const request = require('request');
const soketFunction = require('../soket.function');



module.exports.catch = async (req, res) => {
    try {

        const time = moment().format('HH:mm');
        const date = moment().format("YYYY-MM-DD");

        const place = await Place.findById(req.body.place._id).select("hour_start hour_end rests")
        const rest = place.rests.find( (resting) => resting === date )
        

        if (time < place.hour_start || rest) {
            let response = {message: `Принимаем заказы с ${place.hour_start}`}
            if (rest) {
                response.message = `Извините но сегодня у нас выходной :)`
            }
            res.status(403).json(response)
        } else {

            let response = {
                order: undefined,
                message: undefined
            }


            req.body.user.phone = req.body.user.phone.toString()
            req.body.start = moment().format()

            if (req.body.user._id) {
                req.body.status = "В Ожидании"
                response.message = "Заказ успешно оформлен!"

                request({
                    url: 'https://sushimi-bot.herokuapp.com/order',
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    json: { 
                        place_id: req.body.place._id,
                        message: `Внимание - ${req.body.place.name}! Новый заказ на сумму - ${req.body.total_price} лей.`
                     }
                })

            } else {

                req.body.status = "В Подтверждении"
                response.message = "Подтвердите закакз!"
                req.body.verification_code = between().toString()

                var options = {
                    'method': 'POST',
                    'url': 'https://api.sms.to/sms/send',
                    'headers': {
                      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGg6ODA4MC9hcGkvdjEvdXNlcnMvYXBpL2tleS9nZW5lcmF0ZSIsImlhdCI6MTY1NjAwNjU5NiwibmJmIjoxNjU2MDA2NTk2LCJqdGkiOiJmcGMyUnRSaG5aSk9YRUNYIiwic3ViIjozODI1ODgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.6J01I6Ozfh4yeeWc_DPVTSJcbfHb63OtdNZEofz2VJw',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      "message": `Код активации заказа: ${req.body.verification_code}`,
                      "to": `+373${req.body.user.phone}`
                    })
                  
                  };
                  request(options, function (error, response) {
                    if (error) throw new Error(error);
                    console.log(response.body);
                  });

            }

            response.order = await new Order.Open(req.body).save()
            if (response.order.status === "В Ожидании") {
                soketFunction.EmmitUpdate()
            }

            res.status(201).json(response)
        }

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.confim = async (req, res) => {
    try {

        const order = await Order.Open.findOneAndUpdate(
            {_id: req.body._id},
            { $set: { status: "В Ожидании" } },
            {new: true}
        )

        let response
        if (!order) {
            response = {message: "Время подтверждения заказа истек!"}
        } else {
            response = {message: "Заказ успешно оформлен!"}
            request({
                url: 'https://sushimi-bot.herokuapp.com/order',
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                json: { 
                    place_id: order.place._id,
                    message: `Внимание - ${order.place.name}! Новый заказ на сумму - ${order.total_price} лей.`
                 }
            })

            soketFunction.EmmitUpdate()
        }

        res.status(201).json(response)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.order_end = async (req, res) => {
    try {

        req.body.end = moment().format()
        req.body.status = "Готов"

        const order = await new Order.Closed(req.body).save()

        if (order) {
            await Order.Open.findByIdAndDelete(req.body._id)
            soketFunction.EmmitUpdate()
            res.status(201).json(true)
        } else {
            soketFunction.EmmitUpdate();
            res.status(403).json(false)
        }

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.order_alert = async (req, res) => {
    try {

        await Order.Open.findOneAndUpdate(
            {_id: req.body._id},
            { $set: {alert: req.body.alert} }
        )

        soketFunction.EmmitUpdate()

        res.status(201).json(true)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.order_accept = async (req, res) => {
    try {

        const order = await Order.Open.findOneAndUpdate(
            {_id: req.body._id},
            {$set: {
                accept: true,
                status: "Принят"
            }},
            {new: true}
        )

        let message = "Ваш заказ принят."
        
        if (req.body.time) {
            message = `${message} Примерное время ожидания: ${req.body.time} .`
        }

        if (order) {

            var options = {
                'method': 'POST',
                'url': 'https://api.sms.to/sms/send',
                'headers': {
                  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGg6ODA4MC9hcGkvdjEvdXNlcnMvYXBpL2tleS9nZW5lcmF0ZSIsImlhdCI6MTY1NjAwNjU5NiwibmJmIjoxNjU2MDA2NTk2LCJqdGkiOiJmcGMyUnRSaG5aSk9YRUNYIiwic3ViIjozODI1ODgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.6J01I6Ozfh4yeeWc_DPVTSJcbfHb63OtdNZEofz2VJw',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "message": message,
                  "to": `+373${order.user.phone}`
                })
              
              };

              request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
              });
              
        }

    

        soketFunction.EmmitUpdate()

        res.status(201).json(true)

    } catch (e) {
        errorHandler(res ,e)
    }
}

module.exports.order_inway = async (req, res) => {
    try {

        const order = await Order.Open.findOneAndUpdate(
            {_id: req.params._id},
            {$set: {status: "В Пути"}},
            {new: true}
        )

        
        if (order) {

            var options = {
                'method': 'POST',
                'url': 'https://api.sms.to/sms/send',
                'headers': {
                  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGg6ODA4MC9hcGkvdjEvdXNlcnMvYXBpL2tleS9nZW5lcmF0ZSIsImlhdCI6MTY1NjAwNjU5NiwibmJmIjoxNjU2MDA2NTk2LCJqdGkiOiJmcGMyUnRSaG5aSk9YRUNYIiwic3ViIjozODI1ODgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.6J01I6Ozfh4yeeWc_DPVTSJcbfHb63OtdNZEofz2VJw',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "message": "Ваш заказ в пути!",
                  "to": `+373${order.user.phone}`
                })
              
              };

              request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
              });
              
        }

    

        soketFunction.EmmitUpdate()

        res.status(201).json(true)

    } catch (e) {
        errorHandler(res ,e)
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Order.Open.findByIdAndDelete(req.params._id)
        soketFunction.EmmitUpdate();
        res.status(201).json({message: "Заказ успешно отменен!"})
    } catch (e) {
        errorHandler(res,e)
    }
}

function between() {  
    return Math.floor(
      Math.random() * (9999 - 1001) + 1001
    )
  }

