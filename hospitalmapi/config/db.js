const mongoose = require('mongoose');

mongoose.connect(
"mongodb://localhost:27017/HospitalDB"
)

const db = mongoose.connection;

db.on("connected",()=>{
    console.log("MongoDB connected successfully");      
});

db.on("disconnected", ()=>{
    console.log("MongoDB disconnected");    
    
}); 

db.on("error", (err)=>{
    console.log("MongoDB connection error: ", err);
});

module.exports = db;