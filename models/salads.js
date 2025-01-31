const mongoose = require('mongoose');

const saladSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String], // Array of strings
        required: true
    },
    recipe: {
        type: [String], // Array of strings
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Salad', saladSchema);