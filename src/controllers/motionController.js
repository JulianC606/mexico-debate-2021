const Motion = require('../models/MotionModel')
const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const { id } = req.params
    const motion = await Motion.findById(id)
    res.status(200).json({
      motion,
      token: req.body.secretToken
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.readAll = async (req, res, next) => {
  try {
    const motions = await Motion.find({})
    res.status(200).json({
      motions,
      token: req.body.secretToken
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createOne = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { motion: attributes } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const motion = await new Motion({ ...attributes }).save()
    res.status(200).json({
      motion,
      token: req.body.secretToken
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createMany = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { motions } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const created = await Promise.all(
      motions.map(
        async (attr) => {
          return await new Motion({ ...attr }).save()
        }
      )
    )

    res.status(200).json({
      created,
      token: req.body.secretToken
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
    const { motion: updates } = req.body

    if (currentUser.isAdmin()) {
      const motion = await Motion.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        motion[prop] = value
      })

      const updated = await motion.save()

      res.status(200).json({
        message: res.__('httpMessages.update', 'Motion'),
        user: updated,
        token: req.body.secretToken
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

    const deleted = await Motion.findByIdAndDelete(id)

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Motion'),
      motion: deleted,
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
      httpError.unauthorized(res, req)
    }

    const deleted = await Motion.deleteMany({})

    res.status(200).json({
      message: res.__('httpMessages.deleteMany', 'Motions'),
      info: deleted,
      token: req.body.secretToken
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
