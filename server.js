//basic imports
const express = require('express');
const path = require('path');
app = express();
const port = 80;

//additional imports


//server setup
app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, 'files'))


//server code
app.get('/', (req, res)=>{
    res.status(200).render('homepage.ejs');
})

app.get('/login', (req, res)=>{
    res.status(200).render('login.ejs');
})

app.get('/signup', (req, res)=>{
    res.status(200).render('signup.ejs');
})


//server hosting
app.listen(port, ()=>{
    console.log(`Website running successfully at http://localhost:${port}`)
})