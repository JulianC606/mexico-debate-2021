const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    console.log(req.user)
    const currentUser = await User.findById(req.user._id)
    const { id } = req.params

    if (id.toString() === currentUser._id.toString()) {
      return res.status(200).json({
        data: { user: currentUser.response() }
      })
    }

    if (currentUser.isAdmin()) {
      const user = await User.findById(id)

      return res.status(200).json({
        data: { user: user.response() }
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
      let users = await User.find({})
      users = users.map(user => user.response())
      return res.status(200).json({
        data: { users }
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
      const user = await currentUser.save()
      return res.status(200).json({
        message: res.__('httpMessages.update', 'User'),
        data: { user: user.response() }
      })
    }

    if (currentUser.isAdmin()) {
      let user = await User.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        user[prop] = value
      })
      user = await user.save()
      return res.status(200).json({
        message: res.__('httpMessages.update', 'User'),
        user: user.response()
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

    await User.findByIdAndDelete(id)

    return res.status(200).json({
      message: res.__('httpMessages.delete', 'User')
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

    await User.deleteMany({})

    return res.status(200).json({
      message: res.__('httpMessages.delete', 'Users')
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
        diploma: buffer.toString('base64')
      }
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.justificante = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)

    if (currentUser.id !== req.params.id && !currentUser.isAdmin()) {
      return httpError.unauthorized(res, req)
    }

    const buffer = await currentUser.sendJustificante(req)

    res.json({
      data: {
        justificante: buffer.toString('base64')
      }
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
