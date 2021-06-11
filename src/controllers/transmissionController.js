const Transmission = require('../models/TransmissionModel')
const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const { id } = req.params
    const transmission = await Transmission.findById(id)
    res.status(200).json({
      data: { transmission }
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
      data: { transmissions }
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
      data: { transmission }
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createMany = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { transmissions: body } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const transmissions = await Promise.all(
      body.map(
        async (attr) => {
          return await new Transmission({ ...attr }).save()
        }
      )
    )

    res.status(200).json({
      data: { transmissions }
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
      let transmission = await Transmission.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        transmission[prop] = value
      })

      transmission = await transmission.save()

      res.status(200).json({
        message: res.__('httpMessages.update', 'Transmission'),
        data: { transmission }
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

    await Transmission.findByIdAndDelete(id)

    res.status(200).json({ message: res.__('httpMessages.delete', 'Transmission') })
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

    await Transmission.deleteMany({})

    res.status(200).json({
      message: res.__('httpMessages.deleteMany', 'Transmissions')
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
