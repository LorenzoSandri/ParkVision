const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: {type: String, required: true },
    operatore: { type: Boolean, required: true }
}));