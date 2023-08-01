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
    topic:{
        type: String,
    },
    videoKey:{
        type: String,
    },
    dateAdded:{
        type: Date, default: Date.now
    },
    videoSize:{
        type: Number,
        default: 0,
    } ,
    viewedTimes:{
        type: Number,
        default: 0,
        required: true
    }
});

contentSchema.index({title: 'text', subject: 'text', topic: 'text', level: 'text'});
contentSchema.index({subject: 1, topic: 1, level: 1});

module.exports = mongoose.model('Content', contentSchema);