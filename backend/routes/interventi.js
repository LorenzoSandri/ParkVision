const express = require('express')
const router = express.Router()
const controller = require('../controllers/interventiController')

router.get('/', controller.getAllInterventi)
router.get('/:id', controller.getInterventoById)

router.post('/', controller.createIntervento)

router.put('/:id', controller.updateIntervento)

router.delete('/:id', controller.deleteIntervento)


module.exports = router