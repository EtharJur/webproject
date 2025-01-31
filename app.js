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


app.get('/mainpage', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('mainpage');
});


app.get('/', (req, res) => {
    res.redirect('/mainpage');
});


app.get('/salads', async (req, res) => {
    try {
        const salads = await Salad.find();
        if (!salads || salads.length === 0) {
            return res.status(404).send("No salads found.");
        }
        res.render("salads", { salads });
    } catch (error) {
        console.error("Error fetching salads:", error.message);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});


app.get('/juices', async (req, res) => {
    try {
        const juices = await Juice.find();
        if (!juices || juices.length === 0) {
            return res.status(404).send("No juices found.");
        }
        res.render("juices", { juices });
    } catch (error) {
        console.error("Error fetching juices:", error.message);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});


app.get('/aboutus', (req, res) => res.render('aboutus'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));


app.use('/mainpage', mainRouter);
app.use('/auth', userRouter);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});