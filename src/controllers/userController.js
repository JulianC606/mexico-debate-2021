const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { id } = req.params

    if (id.toString() === currentUser._id.toString()) {
      res.status(200).json({
        user: currentUser,
        token: req.query.secret_token
      })
    }

    if (currentUser.isAdmin()) {
      const user = await User.findById(id)
      res.status(200).json({
        user,
        token: req.query.secret_token
      })
    }

    httpError.unauthorized(res, req)
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req)
  }
}

controller.readAll = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)

    if (currentUser.isAdmin()) {
      const users = await User.find({})
      res.status(200).json({
        users,
        token: req.query.secret_token
      })
    }

    httpError.unauthorized(res, req)
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req)
  }
}

controller.update = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { id } = req.params
    const { user: updates } = req.body

    if (id.toString() === currentUser._id.toString()) {
      Object.entries(updates).forEach(([prop, value]) => {
        currentUser[prop] = value
      })
      const updated = await currentUser.save()
      res.status(200).json({
        message: res.__('httpMessages.update', 'User'),
        user: updated,
        token: req.query.secret_token
      })
    }

    if (currentUser.isAdmin()) {
      const user = await User.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        user[prop] = value
      })
      const updated = await user.save()
      res.status(200).json({
        message: res.__('httpMessages.update', 'User'),
        user: updated,
        token: req.query.secret_token
      })
    }

    httpError.unauthorized(res, req)
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req)
  }
}

controller.deleteOne = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { id } = req.params

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const deleted = await User.findByIdAndDelete(id)

    res.status(200).json({
      message: res.__('httpMessages.delete', 'User'),
      user: deleted,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.deleteAll = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const deleted = await User.deleteMany({})

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Users'),
      user: deleted,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
