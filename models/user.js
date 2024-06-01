const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email:{
        type: String,
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
    buildsecretes:{
        type: String,
    },
    isPremium:{
        type: Boolean,
        default: false,
    },
    payments: [{
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    }],

}, {timestamps: true});

UserSchema.plugin(passportLocalMongoose);
UserSchema.index({
    firstName: 'text',
    lastName: 'text',
    schoolName: 'text',
    studentLevel: 'text',
    email: 'text',
    username: 'text',
  });
module.exports  = mongoose.model('User', UserSchema);