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
    const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.status = 200
    ctx.body = res
  }

  async logout() {
    const { ctx, service } = this
    // 调用 Service 进行业务处理
    await service.userAccess.logout()
    // 设置响应内容和响应状态码
    ctx.status = 200
  }
  
  async resetPsw() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserResetPswTransfer)
    // 组装参数
    const values = ctx.request.body || {}
    // 调用 Service 进行业务处理
    await service.userAccess.resetPsw(values)
    // 设置响应内容和响应状态码
    ctx.status = 201
  }

}

module.exports = UserAccessController
