const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();



const app = express();
const port = 5000;

const clientID = process.env.clientID;
const  clientSecret = process.env. clientSecret;
const callbackURL = process.env.callbackURL;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected to hospitalDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Schema Definition
const dataSchema = new mongoose.Schema({
    PatientFirstname: String,
    PatientSecondname: String,
    PatientLastname: String,
    dob: String,
    age: Number,
    time: String,
    height: Number,
    Weight: Number,
    ftname: String,
    ftsname: String,
    ftlname: String,
    fdob: String,
    fage: Number,
    ftime: String,
    mtname: String,
    mtsname: String,
    mtlname: String,
    mdob: String,
    mage: Number,
    mtime: String,
    gender: String,
    phone: String,
    email: String,
    password: String,
    cpassword: String
});

// Model
const Data = mongoose.model('patient', dataSchema); // collection name = 'patient'

// Routes
app.get('/', (req, res) => {
    res.send("Welcome, server is running");
});

app.post('/submit', (req, res) => {
    const formData = req.body;

    const newData = new Data({
        PatientFirstname: formData.fname,
        PatientSecondname: formData.sname,
        PatientLastname: formData.lname,
        dob: formData.dob,
        age: formData.age,
        time: formData.time,
        height: formData.height,
        Weight: formData.Weight,
        ftname: formData.ftname,
        ftsname: formData.ftsname,
        ftlname: formData.ftlname,
        fdob: formData.fdob,
        fage: formData.fage,
        ftime: formData.ftime,
        mtname: formData.mtname,
        mtsname: formData.mtsname,
        mtlname: formData.mtlname,
        mdob: formData.mdob,
        mage: formData.mage,
        mtime: formData.mtime,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        cpassword: formData.cpassword
    });

    newData.save()
        .then(() => {
            console.log('Data saved successfully');
             res.redirect('/login.html');
        })
        .catch(err => {
            console.error('Error saving data:', err);
            res.status(500).send('Error saving data');
        });
});

// login route

app.post('/login', async (req,res)=>{
    const {email,password}=req.body;
    try{const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hospitalDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Mongoose Schema
const schema = mongoose.Schema;
const userSchema = new schema({
    googleId: String,
    PatientFirstname: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Passport config
passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL:callbackURL 
},
    async (accessToken, refreshToken, profile, done) => {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                PatientFirstname: profile.displayName,
                email: profile.emails[0].value
            });
        }

        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Login with Google</a>');
});

// Redirect to Google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.send(`Hello ${req.user.PatientFirstname}, login successful!`);
    });

// Start Server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

        const user=await Data.findOne({email:email,password:password});
        if(user)
        {
            res.send(`<h2>Welcome, ${user.PatientFirstname}!</h2><p>Login SuccessFull</p>`);
        }
        else
        {
            res.send(`<h3>Inavild email or password</h3><a href="/login.html">Try Again`);
        }
    }catch(err)
    {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Server Start
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
