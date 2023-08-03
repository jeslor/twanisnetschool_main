const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    schoolName:{
        type: String,
        required: true,
    },
    studentLevel:{
        type: String,
        required: true,
    },
    profilePhoto:{
        type: String,
    },


});

UserSchema.plugin(passportLocalMongoose);
module.exports  = mongoose.model('User', UserSchema);