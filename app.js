const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const connectDB = require('./config/db'); // Import database connection
require('./config/passport'); // Import passport configuration
const mainRouter = require('./routers/mainrouter'); // Ensure the file exists
const userRouter = require('./routers/userrouter'); // Import user routes

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


// Middleware to set flash messages
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Daily messages
const dailyTexts = [
    "our body is a reflection of what you feed it—nourish it with fresh, wholesome foods, and it will reward you with energy, strength, and longevity",

    "Every healthy meal is a step toward a stronger body and a sharper mind. The little choices you make today shape the future version of you.",

    "Your body is a high-performance machine—give it real, nutritious foods, and it will run with power, clarity, and unstoppable energy.",

    "What you eat isn’t just fuel; it’s self-care. Choosing nourishing foods means choosing vitality, mental clarity, and a body that supports your dreams.",

    "Every fresh fruit, leafy green, and whole grain you eat is an investment in your future. The healthier you eat today, the stronger you’ll be tomorrow.",

    "The right foods heal, energize, and protect you from illness. Eat naturally, eat wisely, and let your meals work in your favor every single day.",

    "Eating healthy isn’t about perfection—it’s about balance. Nourish your body, enjoy your food, and let mindful choices lead you to lifelong wellness."
];

// Middleware to provide dailyText to all templates
app.use((req, res, next) => {
    res.locals.dailyText = dailyTexts[new Date().getDay()]; // Get text based on the current day
    next();
});

// Routes
// Protect main page from unauthenticated users
app.get('/mainpage', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('mainpage');
});
app.get('/', (req, res) => {
    res.redirect('/mainpage');
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
app.get('/login', (req, res) => {
    res.render('login'); // Ensure you have a login.ejs file
});

app.use('/mainpage', mainRouter); // Add this line to handle /mainpage route
app.use('/auth', userRouter); // Use user routes

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});