const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model('park', new Schema({
    nome: { type: String, required: true },
    zona: { type: String, required: true },
    info: { type: String, required: true },
    fontane: { type: Boolean, required: false },
    tavoli: { type: Boolean, required: false },
    panchine: { type: Boolean, required: false },
    areaCani: { type: Boolean, required: false },
    percorsiCiclabili: { type: Boolean, required: false },
    percorsiFitness: { type: Boolean, required: false },
    giochi: { type: Boolean, required: false },
    parcheggio: { type: Boolean, required: false },
    accessoDisabili: { type: Boolean, required: false },
    illuminazione: { type: Boolean, required: false },
    campoBasket: { type: Boolean, required: false },
    campoCalcio: { type: Boolean, required: false },
    campoPallavolo: { type: Boolean, required: false },
    servizi: { type: Boolean, required: false },
    coords: {
        type: {
            type: String,
            enum: ['MultiPolygon'],
            required: true
        },
        coordinates: {
            type: [[[[Number]]]],
            required: true
        }
    }
}))