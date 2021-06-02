const router = require('express').Router()
const passport = require('passport')

const controller = require('../controllers/notificationController')

router.get('/:id', controller.readOne)
router.get('/', controller.readAll)
router.post('/', passport.authenticate('jwt', { session: false }), controller.createOne)
router.post('/massive', passport.authenticate('jwt', { session: false }), controller.createMany)
router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update)
router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.deleteOne)
router.delete('/', passport.authenticate('jwt', { session: false }), controller.deleteAll)

module.exports = router
