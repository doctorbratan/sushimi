const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PositionSchema = new Schema({

    imageSrc: {
        type: String,
        default: "/uploads/placeholder.png"
    },

    category: 
    {
       _id: {
            ref: "categories",
            type: Schema.Types.ObjectId
       },
       name: {
           type: String
       }
    },

    sub_category: 
    {
        category_id: {
            ref: "categories",
            type: Schema.Types.ObjectId
        },

        _id: {
            type: Schema.Types.ObjectId
        },

        name: {
            type: String
        }
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    cost: {
        type: Number,
        default: 0
    },

    composition: {
        type: [String],
        default: []
    },

    kit: {
        type: Boolean,
        default: false
    },

    kits:
    [
        {
            name: 
            {
                type: String,
                required: true
            },

            required: {
                type: Boolean,
                default: true
            },

            single: {
                type: Boolean,
                default: true
            },

            options: 
            [
                {
                    name:{
                        type: String
                    },

                    cost: {
                        type: Number
                    }
                }
            ]
        }
    ],


    recomendations:
    [
        {

            _id: {
                type: Schema.Types.ObjectId
            },

            category:{
                type: String
            },

            name: {
                type: String
            }

        }
    ] 

})


module.exports = mongoose.model('positions', PositionSchema)