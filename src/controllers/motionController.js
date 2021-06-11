const Motion = require('../models/MotionModel')
const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const { id } = req.params
    const motion = await Motion.findById(id)
    res.status(200).json({
      data: {
        motion
      }
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
      data: {
        motions
      }
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
      data: {
        motion
      }
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createMany = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { motions: body } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const motions = await Promise.all(
      body.map(
        async (attr) => {
          return await new Motion({ ...attr }).save()
        }
      )
    )

    res.status(200).json({
      data: {
        motions
      }
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
      let motion = await Motion.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        motion[prop] = value
      })

      motion = await motion.save()

      res.status(200).json({
        message: res.__('httpMessages.update', 'Motion'),
        data: {
          motion
        },
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

    await Motion.findByIdAndDelete(id)

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Motion')
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

    await Motion.deleteMany({})

    res.status(200).json({
      message: res.__('httpMessages.deleteMany', 'Motions')
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
