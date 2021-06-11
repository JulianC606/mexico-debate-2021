const Notification = require('../models/NotificationModel')
const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const { id } = req.params
    const notification = await Notification.findById(id)
    res.status(200).json({
      data: { notification }
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.readAll = async (req, res, next) => {
  try {
    const { all } = { ...req.query, ...req.body }
    const date = all
      ? {}
      : { date: { $lte: new Date() } }
    const notifications = await Notification.find(date).sort({ date: 'ascending' })
    res.status(200).json({
      data: { notifications }
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createOne = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)

    const { notification: attributes } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const notification = await new Notification({ ...attributes }).save()
    res.status(200).json({
      data: { notification }
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.createMany = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id)
    const { notifications: body } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const notifications = await Promise.all(
      body.map(
        async (attr) => {
          return await new Notification({ ...attr }).save()
        }
      )
    )

    res.status(200).json({
      data: { notifications }
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
    const { notification: updates } = req.body

    if (currentUser.isAdmin()) {
      let notification = await Notification.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        notification[prop] = value
      })

      notification = await notification.save()

      res.status(200).json({
        message: res.__('httpMessages.update', 'Notification'),
        data: { notification }
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

    await Notification.findByIdAndDelete(id)

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Notification')
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

    await Notification.deleteMany({})

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Notifications')
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
