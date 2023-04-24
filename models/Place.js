const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({

    display: {
        type: Boolean,
        default: true
    },

    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    map: {
        type: String
    },

    hour_start: {
        type: String,
        required: true
    },

    hour_end: {
        type: String,
        required: true
    },

    rests: {
        type: [String],
        default: []
    },

    categories: 
    [
        {
            display: {type: Boolean, required: true},
            _id: {type: Schema.Types.ObjectId, required: true},
            name: {type: String, required: true},
            sub_categories:
            [
                {
                    display: {type: Boolean, required: true},
                    _id: {type: Schema.Types.ObjectId, required: true},
                    name: {type: String, required: true},
                }
            ]
        }
    ],

    positions:
    [
        {

            imageSrc: {
                type: String,
                default: "/uploads/placeholder.png"
            },

            _id: {
                ref: "positions",
                type: Schema.Types.ObjectId
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
                required: true
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
                        ref: "positions",
                        type: Schema.Types.ObjectId
                    },
        
                    category:{
                        type: String
                    },
        
                    name: {
                        type: String
                    }
        
                }
            ],

            new_cost: {
                type: Number
            },

            salle: {
                type: String
            },

            action: {
                type: Boolean,
                default: false
            },

            display: {
                type: Boolean,
                default: true
            },

            stop: {
                type: Boolean,
                default: false
            }

        }
    ],

    cities:
    [
        {

            display: {
                type: Boolean,
                default: true
            },

            _id: {
                ref: "cities",
                type: Schema.Types.ObjectId
            },

            name: {
                type: String,
                required: true
            },

            cost: {
                type: Number,
                default: 0
            }
        }
    ]

   

})


module.exports = mongoose.model('places', PlaceSchema)