const Position = require('../models/Position');
const Place = require('../models/Place');

const errorHandler = require('../utils/errorHandler');

module.exports.find = async (req, res) => {
    try {

        let query = {}

        if (req.body.category) {
            query['category._id'] = req.body.category
        }

        if (req.body.sub_category) {
            query['sub_category._id'] = req.body.sub_category
        }

        if (req.body.cost) {
            query.cost = req.body.cost
        }

        const positions = await Position.find(query)
        res.status(200).json(positions)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.catch = async (req,res) => {
    try {

        const candidate = await Position.findById(req.body._id)
        let response = {message: ""}

        
        if (req.body.category) {
            req.body.category = JSON.parse(req.body.category)
        }

        if (req.body.sub_category !== "undefined") {
            req.body.sub_category = JSON.parse(req.body.sub_category)
        }

        if (req.body.composition) {
            req.body.composition = JSON.parse(req.body.composition)
        }

        if (req.body.kit) {
            req.body.kit = JSON.parse(req.body.kit)
        }

        if (req.body.kits) {
            req.body.kits = JSON.parse(req.body.kits)
        }

        if (req.body.recomendations) {
            req.body.recomendations = JSON.parse(req.body.recomendations)
        }

        console.log(req.body.imageSrc)



        if (!candidate) {

            let query = {
                category: req.body.category,
                sub_category: req.body.sub_category,
                name: req.body.name,
                description: req.body.description,
                cost: req.body.cost,
                composition: req.body.composition,
                kit: req.body.kit,
                kits: req.body.kits,
                recomendations: req.body.recomendations,
                imageSrc: req.body.imageSrc ? req.body.imageSrc  : '/uploads/placeholder.png'
            }

            await new Position(query).save()

            response.message = "Позиция Создана!"

        } else {

            let query = {
                category: req.body.category,
                sub_category: req.body.sub_category,
                name: req.body.name,
                description: req.body.description,
                cost: req.body.cost,
                composition: req.body.composition,
                kit: req.body.kit,
                kits: req.body.kits,
                recomendations: req.body.recomendations,
                imageSrc: req.body.imageSrc ? req.body.imageSrc  : '/uploads/placeholder.png'
            }

            const updated = await Position.findOneAndUpdate(
                {_id: candidate._id},
                {$set: query},
                {new: true}
            )

            let change_query = 
            {
                'positions.$.imageSrc': updated.imageSrc,
                'positions.$.name': updated.name,
                'positions.$.category': updated.category,
                'positions.$.sub_category': updated.sub_category,
                'positions.$.description': updated.description,
                'positions.$.composition': updated.composition,
                'positions.$.kit': updated.kit,
                'positions.$.kits': updated.kits,
                'positions.$.recomendations': updated.recomendations,
            }

            req.body.change_cost = JSON.parse(req.body.change_cost)
            if (req.body.change_cost) {
                change_query['positions.$.cost'] = updated.cost
            }

            await Place.updateMany(
                {'positions._id': req.body._id},
                { $set: change_query }
            )

     
            response.message = "Позиция Изменена!"

        }
        

        res.status(201).json(response)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.delete = async (req, res) => {
    try {


        await Position.findByIdAndDelete(req.params._id)
        await Position.updateMany(
            {"$pull": { "recomendations": {"_id": req.params._id} } },
        )

        await Place.updateMany(
            {"$pull": { "positions": {"_id": req.params._id} } }
        ) 
        await Place.updateMany(
            {"positions.recomendations._id": req.params._id},
            {"$pull": 
                { "positions.$.recomendations": {"_id": req.params._id} } 
            }
        ) 

        res.status(201).json({message: "Позиция удаленна!"})

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.stop = async (req, res) => {
    try {

        await Position.findOneAndUpdate(
            {_id: req.body._id},
            { $set: { stop: req.body.stop } },
            {new: true}
        )

        res.status(201).json({message: "Позиция изменена!"})

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.update = async (req, res) => {
    try {

        await Position.updateMany(
            {$set: 
                {
                    extras: []
                }
            }
        )

        res.status(201).json({message: "Позиции изменены!"})
    } catch (e) {
        errorHandler(res,e)
    }
}

// "mongoose": "^5.10.11",

