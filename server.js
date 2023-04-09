//basic imports
const express = require('express');
const path = require('path');
app = express();
const port = 80;

//additional imports
const db = require('./database/db');
db();

const {body, validationResult} = require('express-validator');

const donaters = require('./schemas/donater')

const bcrypt = require('bcrypt');

//server setup
app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, 'files'))
app.use(express.urlencoded({extended: true}));


//server code - get
app.get('/', (req, res)=>{
    res.status(200).render('homepage.ejs');
})

app.get('/login', (req, res)=>{
    res.status(200).render('login.ejs');
})

app.get('/signup', (req, res)=>{
    res.status(200).render('signup.ejs');
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
        // const donater = donaters.findOne({email: req.body.email});
        // if(donater){     
        //     return res.status(400).json({error: "Sorry, this email address is already registerd! Kindly sign-up with another email address"});
        // }

        const {name, email, password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        const donater = new donaters({
            name: name,
            email: email,
            password: secPass
          })

        await donater.save();
        console.log(donater);
        
        res.status(200).render('login.ejs');
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("An Error Occured!");
    }

})



//server hosting
app.listen(port, ()=>{
    console.log(`Website running successfully at http://localhost:${port}`)
})