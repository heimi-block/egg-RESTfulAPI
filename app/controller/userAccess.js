'use strict'
const fs = require('fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const download = require('image-downloader')
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

    this.UserUpdateTransfer = {
      mobile: { type: 'string', required: true, allowEmpty: false },
      realName: {type: 'string', required: true, allowEmpty: false, format: /^[\u2E80-\u9FFF]{2,6}$/}
    }
  }

  // 用户登入
  async login() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserLoginTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 用户登出
  async logout() {
    const { ctx, service } = this
    // 调用 Service 进行业务处理
    await service.userAccess.logout()
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }
  
  // 修改密码
  async resetPsw() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserResetPswTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    await service.userAccess.resetPsw(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }

  // 获取用户信息
  async current() {
    const { ctx, service } = this
    const res = await service.userAccess.current()
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 修改基础信息
  async resetSelf() {
    const {ctx, service} = this
    // 校验参数
    ctx.validate(this.UserUpdateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用Service 进行业务处理
    await service.userAccess.resetSelf(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }

  // 修改头像
  async resetAvatar() {
    const { ctx, service } = this
    const stream = await ctx.getFileStream()
    const filename = path.basename(stream.filename)
    const extname = path.extname(stream.filename).toLowerCase()
    const attachment = new this.ctx.model.Attachment
    attachment.extname = extname
    attachment.filename = filename
    attachment.url = `/uploads/avatar/${attachment._id.toString()}${extname}`
    const target = path.join(this.config.baseDir, 'app/public/uploads/avatar', `${attachment._id.toString()}${attachment.extname}`)
    const writeStream = fs.createWriteStream(target)
    try {
      await awaitWriteStream(stream.pipe(writeStream))
      // 调用 Service 进行业务处理
      await service.userAccess.resetAvatar(attachment)
    } catch (err) {
      await sendToWormhole(stream)
      throw err
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }
}

module.exports = UserAccessController
