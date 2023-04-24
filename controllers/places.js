const Place = require('../models/Place');

const errorHandler = require('../utils/errorHandler');

module.exports.start = async (req, res) => {
    try {  
        const places = await Place.find({display: true}).select("_id name address phone map")
        res.status(200).json(places)
    } catch (e) {
        errorHandler(res,e)
    }
}


module.exports.menu = async (req, res) => {
    try {

        const menu = await Place.findById(req.body._id).select("-_id categories positions")

        menu.categories = menu.categories.filter( (item) => item.display  )
        menu.categories = menu.categories.map( (category) => {
            category.sub_categories = category.sub_categories.filter( (item) => item.display )
            return category
        })
        menu.positions = menu.positions.filter( (item) => item.display )

        res.status(200).json(menu)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.sendCities = async (req, res) => {

    const place = await Place.findById(req.body._id).select("-_id cities")

    place.cities = place.cities.filter( (city) => city.display )
    res.status(200).json(place.cities)

}

module.exports.find = async (req, res) => {
    try {
        const places = await Place.find().select(req.body.select)
        res.status(200).json(places)
    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.findOne = async (req, res) => {
    try {
        const place = await Place.findOne(req.body.query).select(req.body.select)
        res.status(200).json(place)
    } catch (e) {
        errorHandler(res,e)
    }
}



module.exports.catch = async (req,res) => {
    try {

        const candidate = await Place.findById(req.body._id)
        let response = {message: ""}

        if (!candidate) {

            await new Place(req.body).save()

            response.message = "Точка Создана!"

        } else {

            await Place.findOneAndUpdate(
                {_id: candidate._id},
                {$set: req.body},
                {new: true}
            )

            response.message = "Точка Изменена!"

        } 
        
        

        res.status(201).json(response)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Place.findByIdAndDelete(req.params._id)
        res.status(201).json({message: "Точка удаленна!"})
    } catch (e) {
        errorHandler(res,e)
    }
}

