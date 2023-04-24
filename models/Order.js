const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    start: {
        type: String,
    },

    end: {
        type: String
    },

    accept: {
        type: Boolean,
        default: false
    },

    alert: {
        type: Boolean,
        default: true
    },

    list: [
        {
            _id: {
                type: String,
                required: true
            },

            imageSrc: {
                type: String
            },

            category: {
                _id: {
                    type: String,
                    required: true,
                },

                name: {
                    type: String,
                    required: true
                }
            },

            sub_category: {
                _id: {type: String},
                name: {type: String}
            },

            name: {
                type: String,
                required: true
            },

            kit: {
                type: Boolean,
                required: true
            },

            options:
            [
                {
                    title: {type: String},
                    name: {type: String}
                }
            ],

            cost: {
                type: Number,
                required: true
            },

            action: {
                type: Boolean,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            total: {
                type: Number,
                required: true
            },

            comment: {
                type: String
            }
        }
    ],

    total: {
        type: Number,
        required: true
    },

    salle: {
        type: Number,
        required: true
    },

    total_price: {
        type: Number,
        required: true
    },

    place: {
       _id: {
            type: String,
            required: true
       },

       name: {
            type: String,
            required: true
       }
    },

    user: {
        _id: {type: String},
        name: {type: String},
        phone: {type: String},
        city: 
        {
            _id: {type: String},
            name: {type: String},
            cost: {type: Number}
        },
        address: {type: String}
    },

    status: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    payment: {
        type: String,
        required: true
    },

    note: {
        type: String
    },

    verification_code: {
        type: String
    }

 
})


module.exports.Open = mongoose.model('orders-opens', OrderSchema)
module.exports.Closed = mongoose.model('orders-closeds', OrderSchema)