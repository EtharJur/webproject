const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const connectDB = require('./config/db'); // Import database connection
const mainRouter = require('./routers/mainrouter'); // Ensure the file exists

const app = express();
const port = 3000;

// Connect to Database
connectDB();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure "views" folder exists

// Middleware to serve static files (CSS, Images, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session and Flash Messages
app.use(session({
    secret: 'rising star',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Store user object globally
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Daily messages
const dailyTexts = [
    "Start your day with a fresh salad!",
    "Green juice for a fresh start!",
    "Healthy eating, happy living.",
    "Nature’s best on your plate.",
    "Stay fit, stay fresh!",
    "A healthy outside starts from inside.",
    "Fresh flavors, daily inspiration."
];

// Middleware to provide dailyText to all templates
app.use((req, res, next) => {
    res.locals.dailyText = dailyTexts[new Date().getDay()]; // Get text based on the current day
    next();
});

// Routes
app.get('/', (req, res) => {
    res.redirect('/mainpage');
});
app.get('/mainpage', (req, res) => {
    res.render('mainpage');
});
app.get('/salads', (req, res) => {
    res.render('salads'); // Ensure you have a salads.ejs file
});
app.get('/juices', (req, res) => {
    res.render('juices'); // Ensure you have a juices.ejs file
});
app.get('/aboutus', (req, res) => {
    res.render('aboutus'); // Ensure you have an aboutus.ejs file
});
app.get('/signup', (req, res) => {
    res.render('signup'); // Ensure you have a signup.ejs file
});

app.use('/mainpage', mainRouter); // Add this line to handle /mainpage route

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});