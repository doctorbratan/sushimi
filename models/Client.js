const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({

    created: {
        type: String
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    politic_agree: {
        type: Boolean,
        required: true
    },

    access: {
        type: Boolean,
        default: true
    },

    name: {
        type: String
    },

    city: {
        ref: "cities",
        type: Schema.Types.ObjectId
    },

    street: {
        type: String
    },

    place: {
        ref: "places",
        type: Schema.Types.ObjectId
    },

    enters: {
        type: [String],
        default: []
    },

    favorites: {
        type: [String],
        default: []
    },

    salle: {
        type: Number
    },


    telegramm: {
        type: String
    }


})


module.exports = mongoose.model('clients', ClientSchema)