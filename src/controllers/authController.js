const passport = require('passport')
const jwt = require('jsonwebtoken')

const controller = {}

controller.signup = async (req, res, next) => {
  for (const key in req.body) {
    if (['password', 'email', 'id'].includes(key)) {
      continue
    }
    req.user[key] = req.body[key]
  }
  const user = await req.user.save()
  console.log(req.body)
  console.log(req.user)
  res.json({
    message: res.__('auth.signup.success'),
    data: { user: user.response() }
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
        const token = jwt.sign({ user: body }, process.env.API_KEY, { expiresIn: '1h' })

        return res.status(200).json({ token, data: { user: user.response() } })
      })
    } catch (error) {
      console.error(error)
      return next(error)
    }
  })(req, res, next)
}

module.exports = controller
