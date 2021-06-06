const express = require('express')
const controller = require('../controllers/userController')

const router = express.Router()

router.get('/:id', controller.readOne)
router.get('/', controller.readAll)

// For create a new one use /auth/signin

router.patch('/:id', controller.update)
router.delete('/:id', controller.deleteOne)
router.delete('/', controller.deleteAll)

// Custom Routes

router.get('/:id/diploma', controller.diploma)

module.exports = router
