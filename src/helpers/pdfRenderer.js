const path = require('path')
const ejs = require('ejs')
const puppeteer = require('puppeteer')

class PDFRenderer {
  constructor (user, action = null) {
    this.user = user
    this.action = action
    const { path, opts } = this.templateReducer()
    this.template = path
    this.templateOpts = opts
  }

  templateReducer () {
    switch (this.action) {
      case 'diploma':
        return {
          path: path.join(__dirname, '../templates/diploma.ejs'),
          opts: {
            format: 'Letter',
            landscape: true,
            printBackground: true,
            margin: {
              left: '0px',
              top: '0px',
              right: '0px',
              bottom: '0px'
            }
          }
        }
    }
  }

  rendererHTML (req) {
    return (
      new Promise(
        (resolve, reject) => {
          console.log(req)
          ejs.renderFile(
            this.template,
            { data: { user: this.user, base: `${req.protocol}://${req.get('host')}` } },
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

  async renderPDF (req) {
    const html = await this.rendererHTML(req)
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setContent(html)
    await page.evaluateHandle('document.fonts.ready')
    const buffer = await page.pdf(this.templateOpts)
    await browser.close()

    return buffer
  }

  async renderHTML (req) {
    return await this.rendererHTML(req)
  }
}

module.exports = PDFRenderer
