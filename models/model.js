const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName:{
        type: String,
        // required: true,
        // unique: true
    },
    email:{
        type: String,
        required: true,
        // unique: true
    },
    password:{
        type: String,
        required: true
    },
    Photo:{
        type:String,
    },
    followers:[{
        type: ObjectId,
        ref:'userdemo'
    }],
    following:[{
        type: ObjectId, 
        ref:'userdemo'
    }]
})


const User=mongoose.model('userdemo',userSchema);
module.exports = User;