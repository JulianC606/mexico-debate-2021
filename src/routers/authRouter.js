const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const router = express.Router()

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  (req, res, next) => {
    res.json({
      message: res.__('auth.signup.success'),
      user: req.user
    })
  }
)

router.post(
  '/login',
  async (req, res, next) => {
    res.type('json')
    passport.authenticate(
      'login',
      async (err, user, info) => {
        const { message: locale } = info
        try {
          if (err || !user) {
            return res.status(401).json({ ...info, message: res.__(locale) })
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error)

              const body = { _id: user._id, email: user.email }
              const token = jwt.sign({ user: body }, 'TOP_SECRET')

              return res.json({ token })
            }
          )
        } catch (error) {
          return next(error)
        }
      }
    )(req, res, next)
  }
)

module.exports = router
