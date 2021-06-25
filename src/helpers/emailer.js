const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const ejs = require('ejs')
const path = require('path')

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENTID_GOOGLE,
    process.env.CLIENTSECRET_GOOGLE,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESHTOKEN
  })

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENTID_GOOGLE,
      clientSecret: process.env.CLIENTSECRET_GOOGLE,
      refreshToken: process.env.REFRESHTOKEN
    }
  })

  return transporter
}

const sendEmail = async (emailOptions) => {
  const emailTransporter = await createTransporter()
  await emailTransporter.sendMail(emailOptions)
}

const newUserHTML = (firstName, password, email) => {
  return (
    new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, '../templates/emails/newUser.ejs'),
        { data: { firstName, password, email } },
        {},
        (err, html) => {
          if (err !== null) {
            reject(err)
          } else {
            resolve(html)
          }
        }
      )
    }
    )
  )
}

exports.newUserEmail = async (firstName, password, email) => {
  try {
    const html = await newUserHTML(firstName, password, email)
    return new Promise((resolve, reject) => sendEmail({
      subject: 'Credenciales de Autenticación - México Debate',
      html,
      to: email,
      from: process.env.EMAIL
    })
      .then(res => resolve(res))
      .catch(err => reject(err))
    )
  } catch (e) {
    console.error(e)
    return e
  }
}

exports.newUserImport = (output, day) => {
  return new Promise((resolve, reject) => sendEmail({
    subject: 'Importación Masiva de Usuarios - México Debate',
    text: `Hola!\r\n\r\n Se realizo una nueva importación de usuarios: ${day}\r\n`,
    to: process.env.ADMIN_EMAIL,
    from: process.env.EMAIL,
    attachments: [
      { path: output }
    ]
  })
    .then(res => resolve(res))
    .catch(err => reject(err))
  )
}
