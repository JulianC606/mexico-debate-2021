const i18n = require('i18n')
const path = require('path')

i18n.configure({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  queryParameter: 'lang',
  directory: path.join(__dirname, '../locales/'),
  objectNotation: true
})
module.exports = i18n
