const mongoose = require('mongoose');

const JuiceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true },
    image: { 
        type: String, 
        required: true },
    description: { 
        type: String, 
        required: true },
    ingredients: { 
        type: [String], 
        required: true },
    recipe: { 
        type: [String], 
        required: true }
});

module.exports = mongoose.model('Juice', JuiceSchema);