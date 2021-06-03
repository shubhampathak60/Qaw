const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');


const app = express();

// Passport config

require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;
// passport = require('./config/passport');

// Connect to Mongo

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log('MongoDB Connected.....'))
.catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


dotenv.config();
PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));