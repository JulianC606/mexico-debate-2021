const passport = require('passport')
const jwt = require('jsonwebtoken')

const controller = {}

controller.signup = (req, res, next) => {
  res.json({
    message: res.__('auth.signup.success'),
    user: req.user
  })
}

controller.login = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    const { message: locale } = info
    try {
      if (err || !user) {
        return res.status(401).json({ ...info, message: res.__(locale) })
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error)

        const body = { _id: user._id, email: user.email }
        const token = jwt.sign({ user: body }, process.env.API_KEY)

        return res.status(200).json({ token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
}

module.exports = controller
