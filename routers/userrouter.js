const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/signup');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/signup');
        }

        const newUser = new User({
            name,
            email,
            password: new User().hashPassword(password), // Hash password
            avatar: 'profile.png'
        });

        await newUser.save();
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/signup');
    }
});

// Login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/mainpage', // Redirect to main page upon successful login
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully!');
        res.redirect('/login'); // Redirect to login page after logout
    });
});

module.exports = router;