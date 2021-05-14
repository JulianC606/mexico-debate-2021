const express = require('express')
const passport = require('passport')
const controller = require('../controllers/authController')

const router = express.Router()

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  controller.signup
)

router.post(
  '/login',
  controller.login
)

module.exports = router
