const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageViewsSchema = new Schema({
    page: {
        type: String,
        required: true
    },
    visitorIP:{
        type: String,
    },
    vistorLocation: {
        type: String,
    },
    visitorIpAddress: {
        type: String,
    },
    visitorCountry: {
        type: String,
    },
    visitorRegion: {
        type: String,
    },
    visitorCity: {
        type: String,
    },
    visitorDevice: {
        type: String,
    },

}, {timestamps: true});


module.exports = mongoose.model('PageViews', pageViewsSchema);