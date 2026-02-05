const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true },
    ruolo: { type: String, required: true , enum: ['operatore', 'utente'], default: 'utente'}
}));