const Transmission = require('../models/TransmissionModel')
const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const { id } = req.params
    const transmission = await Transmission.findById(id)
    res.status(200).json({
      transmission,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.readAll = async (req, res, next) => {
  try {
    const transmissions = await Transmission.find({})
    res.status(200).json({
      transmissions,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createOne = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { transmission: attributes } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const transmission = await new Transmission({ ...attributes }).save()
    res.status(200).json({
      transmission,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createMany = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { transmissions } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const created = await Promise.all(
      transmissions.map(
        async (attr) => {
          return await new Transmission({ ...attr }).save()
        }
      )
    )

    res.status(200).json({
      created,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.update = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { id } = req.params
    const { transmission: updates } = req.body

    if (currentUser.isAdmin()) {
      const transmission = await Transmission.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        transmission[prop] = value
      })

      const updated = await transmission.save()

      res.status(200).json({
        message: res.__('httpMessages.update', 'Transmission'),
        user: updated,
        token: req.query.secret_token
      })
    }

    httpError.unauthorized(res, req)
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
      httpError.unauthorized(res, req)
    }

    const deleted = await Transmission.findByIdAndDelete(id)

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Transmission'),
      transmission: deleted,
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

    const deleted = await Transmission.deleteMany({})

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Transmissions'),
      transmissions: deleted,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
