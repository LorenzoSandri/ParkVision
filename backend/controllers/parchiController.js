const Parco = require('../models/parco')
const Segnalazione = require('../models/segnalazione')
const Intervento = require('../models/intervento')


exports.getAllParchi = async (req, res) => {
    try {
        const parchi = await Parco.find()
        res.status(200).json(parchi)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.updateParco = async (req, res) => {
    try {
        const parco = await Parco.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!parco) return res.sendStatus(404)

        res.status(200).json(parco)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.createParco = async (req, res) => {
    try {
        const t = new Parco(req.body)
        const parco = await t.save()

        res.status(201).json(parco)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.deleteParco = async (req, res) => {
    try {
        const parco = await Parco.findById(req.params.id)

        if(!parco) return res.sendStatus(404)

        //Cancello tutti le segnalazioni/interventi collegati al parco

        await Intervento.deleteMany({ parco_id: parco._id });
        await Segnalazione.deleteMany({ parco_id: parco._id });
        
        await Parco.findByIdAndDelete(parco._id);

        res.sendStatus(204)
    } catch(error){
        res.sendStatus(500)
    }
}