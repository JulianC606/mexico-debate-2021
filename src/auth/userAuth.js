const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/UserModel')

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      UserModel.create({ email, password })
        .then(user => done(null, user))
        .catch(error => {
          console.error(error)
          done(error)
        })
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email })

        if (!user) {
          return done(null, false, { error: 'userNotFound', message: 'auth.login.userNotFound', status: 401 })
        }

        const validate = await user.isValidPassword(password)

        if (!validate) {
          return done(null, false, { error: 'wrongPassword', message: 'auth.login.wrongPassword', status: 401 })
        }

        return done(null, user, { message: 'auth.login.success', status: 200 })
      } catch (error) {
        return done(error)
      }
    }
  )
)

const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.API_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        console.log(token)
        return done(null, token.user)
      } catch (error) {
        console.log(error)
        done(error)
      }
    }
  )
)
