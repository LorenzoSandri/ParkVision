const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('report', new Schema({
    parco_id: { type: Schema.Types.ObjectId, required: true },
    data: { type: Date, required: true },
    stato: {type: Boolean, required: true }, //Risolto (true) o no (false)
    info: { type: String, required: true },
    utente: { type: String, required: true }
}));