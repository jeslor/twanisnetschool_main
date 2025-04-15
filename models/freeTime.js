const mongoose  = require('mongoose'),
 Schema = mongoose.Schema;


 const freeTimeSchema = new Schema({
        timerRange:{
            type: String,
            required: true
        },
        startTime:{
            type: Number,
            required: true
        },
        endTime:{
            type: Number,
            required: true
        },
        dateAdded:{
            type: Date, default: Date.now
        },
        isFreeTime:{
            type: Boolean,
            default: false
        }
    }, {timestamps: true}
    );

    freeTimeSchema.index({
        day: 'text',
        startTime: 'text',
        endTime: 'text',
    });

module.exports = mongoose.model('FreeTime', freeTimeSchema);
