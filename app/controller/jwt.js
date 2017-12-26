'use strict'

const Controller = require('egg').Controller

class JwtController extends Controller {
  async index() {
    const {ctx} = this
    // ctx.body = 'Hello World'
    ctx.body = ctx.state
  }

  async login() {
    const {ctx} = this
 
    const token = ctx.app.jwt.sign({ 
      foo: 'bar',
      data: {
        _id: '999999'
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, ctx.app.config.jwt.secret)

    ctx.body = `Hello admin ${token}`
  }

  async success() {
    const {ctx} = this
    // ctx.body = ctx.state.user
    ctx.body = 'Hello OK'
  }
}

module.exports = JwtController
