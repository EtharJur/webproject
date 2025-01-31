const mongoose = require('mongoose')

const saladSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    recipe: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})