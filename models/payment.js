const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    transactionId: {
        type: String,
        required: true
    },
    paymentStartDate: {
        type: Date,
        required: true
    },
    paymentEndDate: {
        type: Date,
        required: true
    },
    paymentCurrency: {
        type: String,
        required: true
    },
    paymentAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Payment', paymentSchema);
