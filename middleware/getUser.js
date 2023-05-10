const jsonwebtoken = require('jsonwebtoken');
const donaters = require('../schemas/donater');
const JWT_Secret_Token = 'HarshIsGoingToRo$ock!';

const getUser = (req, res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jsonwebtoken.verify(token, JWT_Secret_Token, async(err, decodedJWT)=>{
            if(err){
                res.locals.donater = null;
                next()
            }
            else{
                const donater = await donaters.findById(decodedJWT.id);
                res.locals.donater = donater;
                next();
            }
        })
    }
    else{
        res.locals.donater = null;
        next();
    }
}

module.exports = getUser;