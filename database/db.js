const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/DoNake?directConnection=true";

const database = ()=>{
    const connectionParams={
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.connect(url, connectionParams)
        console.log("Database Connected Successfully!")
    } catch (error) {
        console.log(error)
        console.log("Database Connection Failed!")
    }
}

module.exports = database;