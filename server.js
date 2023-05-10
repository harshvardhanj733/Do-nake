//basic imports
const express = require('express');
const path = require('path');
app = express();
const port = 80;

//additional imports
const db = require('./database/db');
db();
const jwt = require('jsonwebtoken');
const JWT_Secret_Token = 'HarshIsGoingToRo$ock!';
const fetchuser = require('./middleware/fetchuser');
const getUser = require('./middleware/getUser');
const cookieParser = require('cookie-parser');

const {body, validationResult} = require('express-validator');

const donaters = require('./schemas/donater')

const bcrypt = require('bcrypt');

//server setup
app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, 'files'))
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


//server code - get
app.get('*', getUser);

app.get('/', (req, res)=>{
    res.status(200).render('homepage.ejs');
})

app.get('/login', (req, res)=>{
    res.status(200).render('login.ejs');
})

app.get('/signup', (req, res)=>{
    res.status(200).render('signup.ejs');
})

app.get('/userNGOs', fetchuser, (req, res)=>{
    res.status(200).render('userNGOs.ejs')
})

app.get('/logout', (req, res)=>{
    res.cookie('jwt', '', {expiry: 1});
    res.redirect('/login');
})


//server code - post
app.post('/signup', [
    body('name').isLength({min: 1}),
    body('email').isEmail(),
    body('password').isLength({min: 8}),
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array()});
    }

    try {
        const {name, email, password} = req.body;

        let donater = await donaters.findOne({email: email});
        if(donater){     
            return res.status(400).json({error: "Sorry, this email address is already registerd! Kindly sign-up with another email address"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        donater = new donaters({
            name: name,
            email: email,
            password: secPass
          })

        await donater.save();
        const data = {
            id: donater._id
        }
        const token = jwt.sign(data, JWT_Secret_Token);
        res.cookie('jwt', token, {httpOnly: true});
        res.status(200).redirect('/login');
        
    } catch (error) {
        res.send(error.message);
        res.status(500).send("An Error Occured!");
    }
})

app.post('/login', async (req, res)=>{
    try {
        const {email, password} = req.body;
        const loginUser = await donaters.findOne({email});
        if(!loginUser){
            return res.status(200).redirect("/signup");
        }
        const loginPassword = await bcrypt.compare(password, loginUser.password);
        if(loginPassword){
            const data = {
                id: loginUser.id
            }
            const token = jwt.sign(data, JWT_Secret_Token);
            res.cookie('jwt', token, {httpOnly: true});
            return res.status(200).redirect('/')
        }
        else{
            return res.status(400).json("Password Incorrect!");
        }

    } catch (error) {
        res.send(error.message);
        res.status(500).send("An Error Occured!");
    }
})


//server hosting
app.listen(port, ()=>{
    console.log(`Website running successfully at http://localhost:${port}`)
})