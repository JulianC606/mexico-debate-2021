const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const PDFRenderer = require('../helpers/pdfRenderer')
const emailer = require('../helpers/emailer')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  status: {
    type: Number,
    default: 0,
    required: true
  },
  institution: String,
  tabbyCatURL: String,
  coachName: String,
  role: {
    type: Number,
    default: 0,
    required: true
  },
  curp: String
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  await emailer.newUserEmail(user)

  const hash = await bcrypt.hash(user.password, 10)

  user.password = hash
  next()
})

UserSchema.methods.isValidPassword = async function (password) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)

  return compare
}

UserSchema.methods.sendDiploma = async function (req) {
  const pdfRenderer = new PDFRenderer(this, 'diploma')
  const pdf = await pdfRenderer.renderPDF(req)
  return pdf
}

UserSchema.methods.sendJustificante = async function (req) {
  const pdfRenderer = new PDFRenderer(this, 'justificante')
  const pdf = await pdfRenderer.renderPDF(req)
  return pdf
}

UserSchema.methods.sendHTMLDiploma = async function (req) {
  const pdfRenderer = new PDFRenderer(this, req, 'diploma')
  const pdf = await pdfRenderer.renderHTML(req)
  return pdf
}

UserSchema.virtual('fullname').get(function () {
  return `${this.firstName} ${this.lastName}`
})

UserSchema.methods.isAdmin = function () {
  return this.role === 1
}

UserSchema.methods.response = function () {
  const { _id: id, email, firstName, lastName, status, institution, tabbyCatURL, coachName, role } = this
  const fullname = this.fullname
  return {
    id, email, firstName, lastName, fullname, status, institution, tabbyCatURL, coachName, role
  }
}

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel
