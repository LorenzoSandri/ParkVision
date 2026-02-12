const express = require('express')
const router = express.Router()
const controller = require('../controllers/parchiController')

//Restituisce tutti i parchi
router.get('/', controller.getAllParchi)

//Aggiunge un nuovo parco
router.post('/', controller.createParco)

//Modifica un parco dato un ID
router.put('/:id', controller.updateParco)

//Cancella il parco dato l'ID
router.delete('/:id', controller.deleteParco)

module.exports = router