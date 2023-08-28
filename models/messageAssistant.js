const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageAssistantSchema = new Schema({
    guestMessage: {
        type: String,
        required: true
    },  
    guestName:{
        type: String,
        required: true
    },
    guestPhone:{
        type: String,
        required: true

    },
    isRead: {
        type: Boolean,
    }
}, { timestamps: true });

messageAssistantSchema.index({
    guestMessage: 'text',
    guestName: 'text',
    guestPhone: 'text',
  });

module.exports = mongoose.model('MessageAssistant', messageAssistantSchema);
