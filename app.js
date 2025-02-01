const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const connectDB = require('./config/db');
require('./config/passport');
const mainRouter = require('./routers/mainrouter');
const userRouter = require('./routers/userrouter');
const Salad = require('./models/salads');
const Juice = require('./models/juices');
const searchRouter = require('./routers/searchrouter');
const app = express();
const port = 3333;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'rising star',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.messages = req.flash();
    next();
});

const dailyTexts = [
    "Your body is a reflection of what you feed it—nourish it with fresh, wholesome foods, and it will reward you with energy, strength, and longevity.",
    "Every healthy meal is a step toward a stronger body and a sharper mind. The little choices you make today shape the future version of you.",
    "Your body is a high-performance machine—give it real, nutritious foods, and it will run with power, clarity, and unstoppable energy.",
    "What you eat isn’t just fuel; it’s self-care. Choosing nourishing foods means choosing vitality, mental clarity, and a body that supports your dreams.",
    "Every fresh fruit, leafy green, and whole grain you eat is an investment in your future. The healthier you eat today, the stronger you’ll be tomorrow.",
    "The right foods heal, energize, and protect you from illness. Eat naturally, eat wisely, and let your meals work in your favor every single day.",
    "Eating healthy isn’t about perfection—it’s about balance. Nourish your body, enjoy your food, and let mindful choices lead you to lifelong wellness."
];

app.use((req, res, next) => {
    res.locals.dailyText = dailyTexts[new Date().getDay()];
    next();
});

// Authentication middleware
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please log in to view that resource');
    res.redirect('/login');
}

// Routes
app.get('/', (req, res) => {
    res.redirect('/mainpage');
});

app.get('/mainpage', ensureAuthenticated, (req, res) => {
    res.render('mainpage');
});

app.get('/salads', ensureAuthenticated, async (req, res) => {
    let perPage = 1; // Number of salads per page
    let page = req.query.page || 1; // Get the page number from query params, default is 1

    try {
        const totalSalads = await Salad.countDocuments();
        const salads = await Salad.find()
            .skip((perPage * page) - perPage)
            .limit(perPage);

        res.render("salads", {
            salads,
            current: page,
            pages: Math.ceil(totalSalads / perPage)
        });

    } catch (error) {
        console.error("Error fetching salads:", error.message);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.get('/juices', ensureAuthenticated, async (req, res) => {
    let perPage = 1; // Number of juices per page
    let page = req.query.page || 1;

    try {
        const totalJuices = await Juice.countDocuments();
        const juices = await Juice.find()
            .skip((perPage * page) - perPage)
            .limit(perPage);

        res.render("juices", {
            juices,
            current: page,
            pages: Math.ceil(totalJuices / perPage)
        });

    } catch (error) {
        console.error("Error fetching juices:", error.message);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.get('/aboutus', ensureAuthenticated, (req, res) => res.render('aboutus'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));

app.use('/mainpage', mainRouter);
app.use('/auth', userRouter);
app.use('/search', ensureAuthenticated, searchRouter); // Use the search route

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});