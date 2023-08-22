const { Timestamp } = require('mongodb');

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
        required: true
    },
    term:{
        type: String,
        required: true
    },
    lessonNumber:{
        type: Number,
        required: true
    },
    topic:{
        type: String,
        required: true
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
    },

}, {timestamps: true}
);

contentSchema.index({title: 'text', subject: 'text', topic: 'text', level: 'text'});
// contentSchema.index({subject: 1, topic: 1, level: 1});

module.exports = mongoose.model('Content', contentSchema);