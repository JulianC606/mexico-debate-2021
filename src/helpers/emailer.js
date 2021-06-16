const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

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

exports.newUserEmail = (user) => {
  return new Promise((resolve, reject) => sendEmail({
    subject: 'Credenciales de Autenticación - México Debate',
    text: `Hola ${user.firstName}!\n\nTe saludamos desde la organización de Mexico Debate. Te mandamos el presente para brindarte la información del login en nuestra plataforma:\n\nUsuario: ${user.email}\nContraseña: ${user.password}\n\nTe deseamos un feliz día.\n\nAtentamente,\n\nMexico Debate`,
    to: user.email,
    from: process.env.EMAIL
  })
    .then(res => resolve(res))
    .catch(err => reject(err))
  )
}
