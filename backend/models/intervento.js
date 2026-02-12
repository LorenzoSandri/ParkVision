const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tipiPossibili = [
    'taglio erba',
    'potatura',
    'pulizia vialetti',
    'controllo irrigazione',
    'raccolta rifiuti',
    'riparazione giochi',
    'controllo recinzioni',
    'ripristino illuminazione',
    'verifica attrezzature sportive',
    'trattamenti fitosanitari',
    'ripristino prati',
    'installazione attrezzature',
    'eventi speciali',
    'rimozione graffiti',
    'raccolta rifiuti ingombranti',
    'pulizia fontane'
]

module.exports = mongoose.model('intervento', new Schema({
    parco_id: { type: Schema.Types.ObjectId, required: true },
    dataPrevista: { type: Date, required: true },
    tipo: {type: String, required: true, enum: tipiPossibili},
    info: { type: String, required: true },
    responsabile: { type: String, required: true },
    rinnovo: { type: Number, required: false, default: -1 } //Se è >0 allora si rinnova
}, {
    collection: 'interventi' // interventos era meglio come nome, ma come tutte le cose belle deve finire
}));