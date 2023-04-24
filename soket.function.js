const Order = require('./models/Order');

let socketMap = []

module.exports.socketMap = socketMap

module.exports.EmmitUpdate = async () => {

    const orders = await Order.Open.find().sort({start: 1})

    for( let socketMapObj of socketMap) { 
        socketMapObj.emit('OrdersUpdate', orders )
    }

}
