const express = require('express')
const router = express.Router()
const controller = require('../controllers/parchiController')

//Restituisce tutti i parchi, o il parco che matcha l'ID
router.get('/', controller.getAllParchi)
router.get('/:id', controller.getParcoById)

//Aggiunge un nuovo parco
router.post('/', controller.createParco)

//Modifica un parco dato un ID
router.put('/:id', controller.updateParco)

//Cancella il parco dato l'ID
router.delete('/:id', controller.deleteParco)

module.exports = router