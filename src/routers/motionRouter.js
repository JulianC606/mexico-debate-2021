const express = require('express')
const controller = require('../controllers/motionController')

const router = express.Router()

router.get('/:id', controller.readOne)
router.get('/', controller.readAll)

router.post('/', controller.createOne)
router.post('/massive', controller.createMany)

router.patch('/:id', controller.update)
router.delete('/:id', controller.deleteOne)
router.delete('/', controller.deleteAll)

module.exports = router
