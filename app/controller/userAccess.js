'use strict'

const Controller = require('egg').Controller

class UserAccessController extends Controller {

  constructor(ctx) {
    super(ctx)

    this.UserLoginTransfer = {
      mobile: { type: 'string', required: true, allowEmpty: false },
      password: { type: 'string', required: true, allowEmpty: false }
    }

    this.UserResetPswTransfer = {
      password: { type: 'password', required: true, allowEmpty: false, min: 6 },
      oldPassword: { type: 'password', required: true, allowEmpty: false, min: 6 }
    }

  }

  async login() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserLoginTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    return await service.userAccess.login(payload)
  }

  async logout() {
    const { ctx, service } = this
    return await service.userAccess.logout()
  }
  
  async resetPsw() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserResetPswTransfer)
    // 组装参数
    const values = ctx.request.body || {}
    // 调用 Service 进行业务处理
    return await service.userAccess.resetPsw(values)
  }

}

module.exports = UserAccessController
