const express = require('express')
const router = express.Router()
const controller = require('../controllers/segnalazioniController')

router.get('/', controller.getAllSegnalazioni)

router.post('/', controller.createSegnalazione)

router.put('/:id', controller.updateSegnalazione)


module.exports = router