const Order = require('../models/Order');

const errorHandler = require('../utils/errorHandler');

module.exports.order_history = async (req, res) => {
    try {

        let query = {}



        if (req.body.date_start) {
            query.end = {
                $gte: req.body.date_start
            }
        }
 
        if (req.body.date_end) {

            if (!query.end) {
                query.end = {}
            }

            query.end['$lte'] = req.body.date_end
        }

        if (req.body.place) {
            query['place._id'] = req.body.place
        }

        if (req.body.type === "Доставка") {
            query.type = "Доставка"

            if (req.body.city)
            query['user.city._id'] = req.body.city
        }

        if (req.body.type === "Самовывоз") {
            query.type = "Самовывоз"
        }
       

        const orders = await Order.Closed.find(query).sort({end: -1})
        res.status(200).json(orders)



    } catch (e) {
        errorHandler(res,e)
    }
}

