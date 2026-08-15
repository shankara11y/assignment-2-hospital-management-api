const mongoose = require('mongoose');
const userSchema = {
    
    name:{
        type:  String,
        required: true,
        unique:false
    },
    city:{
        type:  String,
        required: true,
        unique:false
    },
    totalBeds:{
        type:Number,
        required:true,
        unique:true
    },
    availableBeds:{
        type:Number,

        required:true

    }

}

const Hospital = mongoose.model('Hospital', userSchema);
module.exports = Hospital;