const Telegram = require('../models/Telegram');

const errorHandler = require('../utils/errorHandler');

module.exports.get = async (req, res) => {
    try {
        const telegrams = await Telegram.find()
        res.status(200).json(telegrams)
    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.catch = async (req,res) => {
    try {

        await Telegram.findOneAndUpdate(
            {_id: req.body._id},
            {$set: req.body}
        )

        res.status(201).json({message: "Телеграм изменен!"})

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Telegram.findByIdAndDelete(req.params._id)
        res.status(201).json({message: "Телеграм удаленн!"})
    } catch (e) {
        errorHandler(res,e)
    }
}

