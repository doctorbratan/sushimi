const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({

    chat_id: {
        type: Number, 
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    places: [
        {
            _id: {
                type: String,
                required: true
            },

            name: {
                type: String,
                required: true
            }
        }
    ],

    alert: {
        type: Boolean,
        default: true
    },

    name: {
        type: String,
        default: ""
    }

})


module.exports = mongoose.model('telegram-users', UserInfoSchema)