const Controller = require('egg').Controller
const Oauth = require('./../extend/oauth.js')

class OauthController extends Controller{
  constructor (ctx){
    super(ctx)
  }

  async revoke() {
    console.log('revoke')
    // this.ctx.oauth.revokeToken('sbsbsbsbsbsbbs')
    Oauth.revokeToken('sbsbsbsbsbsbbs')
  }
}


module.exports = OauthController