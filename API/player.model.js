const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Post
let Player = new Schema({
    name: {
        type: String
    }
}, {
    collection: 'players'
});

module.exports = mongoose.model('Player', Player);