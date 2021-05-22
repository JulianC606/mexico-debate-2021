module.exports = {
  unauthorized (res, req) {
    res.status(401)
      .set('WWW-Authenticate', 'Access with an Administrator User to READ/POST/PATCH/DELETE other User information.')
      .json({
        message: res.__('error.unauthorized.notAdmin'),
        error: 'Unauthorized',
        status: 401,
        token: req.query.secret_token
      })
  },

  serverError (res, req, e) {
    res.status(500)
      .json({
        message: e.stack,
        error: 'Internal Error',
        status: 500,
        token: req.query.secret_token
      })
  }
}
