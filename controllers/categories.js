const Category = require('../models/Category');
const Position = require('../models/Position');
const Place = require('../models/Place');

const errorHandler = require('../utils/errorHandler');

module.exports.get = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.catch = async (req,res) => {
    try {

        const candidate = await Category.findById(req.body._id)
        let response = {message: ""}

        if (!candidate) {

            await new Category(req.body).save()

            response.message = "Категория Создана!"

        } else {

            const updated = await Category.findOneAndUpdate(
                {_id: candidate._id},
                {$set: req.body},
                {new: true}
            )

            if (updated.name !== candidate.name) {

                await Position.updateMany(
                    {'category._id': candidate._id},
                    { $set: { 'category.name': updated.name } },
                    {new: true}
                )

                await Place.updateMany(
                    {'categories._id': candidate._id},
                    { $set: {'categories.$.name': updated.name } }
                )

                await Place.updateMany(
                    {'positions.category._id': candidate._id},
                    {
                        $set: { 'positions.$.category.name': updated.name }
                    }
                )

            }

            for (let sub_category of req.body.sub_categories) {

                if (sub_category.changed) {

                    await Position.updateMany(
                        {'sub_category._id': sub_category._id},
                        { $set:
                             {'sub_category.name': sub_category.name}
                        }
                    )

                    await Place.updateMany(
                        {'positions.sub_category._id': sub_category._id},
                        {
                            $set: { 'positions.$.sub_category.name': sub_category.name }
                        }
                    )

                    const places = await Place.find({'categories._id': candidate._id}).select('categories.$')
                    if (places.length > 0) {

                       for (let place of places) {

                            const sub_categories_array = place.categories[0].sub_categories
                            const sub_category_candidate = sub_categories_array.find( (i) => `${i._id}` === `${sub_category._id}` )
                            if (sub_category_candidate) {
                                sub_category_candidate.name = sub_category.name
                            }

                            await Place.updateMany(
                                {'categories._id': candidate._id},
                                { $set: { 'categories.$.sub_categories': sub_categories_array } }
                            )

                       }

                    }

                }

            }


            response.message = "Категория Изменена!"

        } 
        
        

        res.status(201).json(response)

    } catch (e) {
        errorHandler(res,e)
    }
}

module.exports.delete = async (req, res) => {
    try {
        
        await Category.findByIdAndDelete(req.params._id)
        await Place.updateMany(
            {"$pull": { "categories": {"_id": req.params._id} } }
        )

        res.status(201).json({message: "Категория удаленна!"})
    } catch (e) {
        errorHandler(res,e)
    }
}

