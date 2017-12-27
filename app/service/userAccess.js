'use strict'

const Service = require('egg').Service

class UserAccessService extends Service {

  async login(payload) {
    const { ctx, service } = this
    const user = await service.user.findByMobile(payload.mobile)
    if(!user){
      ctx.throw(404, 'user not found')
    }
    let verifyPsw = await ctx.compare(payload.password, user.password)
    if(!verifyPsw) {
      ctx.throw(404, 'user password is error')
    }
    // 生成Token令牌
    return { token: await service.actionToken.apply(user._id) }
  }

  async logout() {
  }

  async resetPsw(values) {
    const { ctx, service } = this
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }

    let verifyPsw = await ctx.compare(values.oldPassword, user.password) 
    if (!verifyPsw) {
      ctx.throw(404, 'user password error')
    } else {
      // 重置密码
      values.password = await ctx.genHash(values.password)
      return service.user.findByIdAndUpdate(_id, values)
    }
  }

}

module.exports = UserAccessService
