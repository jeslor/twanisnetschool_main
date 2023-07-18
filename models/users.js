const mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose'),
Schema = mongoose.Schema;


const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);