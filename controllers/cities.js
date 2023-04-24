const City = require('../models/City');
const Place = require('../models/Place');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async (req, res) => {
    try {
        const cities = await City.find()
        res.status(200).json(cities)
    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.catch = async (req,res) => {
    try {

        const candidate = await City.findById(req.body._id)
        let response = {message: ""}

        if (!candidate) {

            await new City(req.body).save()
            response.message = "Поселение Создано!"

        } else {

            const updated = await City.findOneAndUpdate(
                {_id: candidate._id},
                {$set: req.body},
                {new: true}
            )

            let change_query = { 'cities.$.name': updated.name }

            await Place.updateMany(
                {'cities._id': updated._id},
                { $set: change_query }
            )

            response.message = "Поселение Измененно!"

        } 
        
        

        res.status(201).json(response)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.delete = async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params._id)
        res.status(201).json({message: "Поселение удаленно!"})
    } catch (e) {
        errorHandler(res,e)
    }
}

