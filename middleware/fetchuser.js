const jsonwebtoken = require('jsonwebtoken');
const donaters = require('../schemas/donater');
const JWT_Secret_Token = 'HarshIsGoingToRo$ock!';

const fetchuser = (req, res, next)=>{
    const token = req.cookies.jwt;
    if(!token){
        res.redirect('/login')
    }

    try {
        jsonwebtoken.verify(token, JWT_Secret_Token, (err, decodedJWT)=>{
            if(err){
                console.error(err);
            }
            else{
                next()
            }
        })
    } catch (error) {
        res.send(401);
    }
}


module.exports = fetchuser;