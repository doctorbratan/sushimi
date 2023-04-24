const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    created: {
        type: String
    },

    login: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    access: {
        type: Boolean,
        default: true
    },

    type: {
        type: String,
        default: "seller"
    },

    name: {
        type: String,
        required: true
    },

    place: {
        type: String
    },

    enters: {
        type: [String],
        default: []
    },

    visible: {
        type: Boolean,
        default: true
    }


})


module.exports = mongoose.model('users', UserSchema)