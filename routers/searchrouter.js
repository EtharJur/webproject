const express = require('express');
const router = express.Router();
const Salad = require('../models/salads');
const Juice = require('../models/juices');

// Search Route
router.get('/', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.render('search', { salads: [], juices: [] }); // Show empty results instead of redirect
    }

    try {
        // Searching both salads and juices using regex (case-insensitive)
        const salads = await Salad.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { ingredients: { $regex: query, $options: 'i' } }
            ]
        });

        const juices = await Juice.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { ingredients: { $regex: query, $options: 'i' } }
            ]
        });

        res.render('search', { salads, juices }); // Render search results properly
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

module.exports = router;