const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const contentSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    cost:{
        type: String,
        default: 'buy',
        required: true
    },
    level:{
        type: String,
        default: 'all',
    },
    subject:{
        type: String,
    },
    videoKey:{
        type: String,
    },
    dateAdded:{
        type: Date, default: Date.now
    },
    viewedTimes:{
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model('Content', contentSchema);