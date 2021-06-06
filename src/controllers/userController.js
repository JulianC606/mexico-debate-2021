const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { id } = req.params

    if (id.toString() === currentUser._id.toString()) {
      return res.status(200).json({
        user: currentUser,
        token: req.body.secretToken
      })
    }

    if (currentUser.isAdmin()) {
      const user = await User.findById(id)

      return res.status(200).json({
        user,
        token: req.body.secretToken
      })
    }

    return httpError.unauthorized(res, req)
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.readAll = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)

    if (currentUser.isAdmin()) {
      const users = await User.find({})
      return res.status(200).json({
        users,
        token: req.body.secretToken
      })
    }

    return httpError.unauthorized(res, req)
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
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
      return res.status(200).json({
        message: res.__('httpMessages.update', 'User'),
        user: updated,
        token: req.body.secretToken
      })
    }

    if (currentUser.isAdmin()) {
      const user = await User.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        user[prop] = value
      })
      const updated = await user.save()
      return res.status(200).json({
        message: res.__('httpMessages.update', 'User'),
        user: updated,
        token: req.body.secretToken
      })
    }

    return httpError.unauthorized(res, req)
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.deleteOne = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { id } = req.params

    if (!currentUser.isAdmin()) {
      return httpError.unauthorized(res, req)
    }

    const deleted = await User.findByIdAndDelete(id)

    return res.status(200).json({
      message: res.__('httpMessages.delete', 'User'),
      user: deleted,
      token: req.body.secretToken
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
      return httpError.unauthorized(res, req)
    }

    const deleted = await User.deleteMany({})

    return res.status(200).json({
      message: res.__('httpMessages.delete', 'Users'),
      users: deleted,
      token: req.body.secretToken
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

// Custom Routes

controller.diploma = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)

    if (currentUser.id !== req.params.id && !currentUser.isAdmin()) {
      return httpError.unauthorized(res, req)
    }

    const buffer = await currentUser.sendDiploma(req)

    res.json({
      data: {
        pdf: buffer.toString('base64')
      },
      token: req.body.secretToken
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
