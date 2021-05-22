const Notification = require('../models/NotificationModel')
const User = require('../models/UserModel')
const httpError = require('../helpers/httpErrors')
const controller = {}

controller.readOne = async (req, res, next) => {
  try {
    const { id } = req.params
    const notification = await Notification.findById(id)
    res.status(200).json({
      notification,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

controller.readAll = async (req, res, next) => {
  try {
    const notifications = await Notification.find({})
    res.status(200).json({
      notifications,
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
    const { notification: attributes } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const notification = await new Notification({ ...attributes }).save()
    res.status(200).json({
      notification,
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
    const { notifications } = req.body

    if (!currentUser.isAdmin()) {
      httpError.unauthorized(res, req)
    }

    const created = await Promise.all(
      notifications.map(
        async (attr) => {
          return await new Notification({ ...attr }).save()
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
    const { notification: updates } = req.body

    if (currentUser.isAdmin()) {
      const notification = await Notification.findById(id)

      Object.entries(updates).forEach(([prop, value]) => {
        notification[prop] = value
      })

      const updated = await notification.save()

      res.status(200).json({
        message: res.__('httpMessages.update', 'Notification'),
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

    const deleted = await Notification.findByIdAndDelete(id)

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Notification'),
      notification: deleted,
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

    const deleted = await Notification.deleteMany({})

    res.status(200).json({
      message: res.__('httpMessages.delete', 'Notifications'),
      notifications: deleted,
      token: req.query.secret_token
    })
  } catch (e) {
    console.error(e)
    httpError.serverError(res, req, e)
  }
}

module.exports = controller
