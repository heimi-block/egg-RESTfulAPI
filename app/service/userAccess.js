'use strict'

const Service = require('egg').Service

class UserAccessService extends Service {

  async login(payload) {
    const { ctx, service } = this
    const user = await service.user.findByMobile(payload.mobile)

    if(!user){
      ctx.helper.handleError( {ctx, message:'登录失败，此用户不存在', result: user } )
      return 
    }

    let verifyPsw = await this.ctx.compare(payload.password, user.password)
    if(!verifyPsw) {
      ctx.helper.handleError( {ctx, message:'登录失败，密码错误', result: verifyPsw } )
      return
    }

    // 生成Token令牌
    const token = await service.actionToken.apply(user._id)
    ctx.helper.handleSuccess( {ctx, message:'登录成功', result: token } )
  }

  async logout() {
    const {ctx} = this
    ctx.helper.handleSuccess( {ctx, message:'登出成功', result: null } )
  }

  async resetPsw(values) {
    const { ctx, service } = this
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id
    const user = await service.user.findById(_id)
    if (!user) {
      ctx.helper.handleError( {ctx, message:'密码修改失败，用户不存在', result: user } )
      return
    }
    
    let verifyPsw = await ctx.compare(values.oldPassword, user.password) 
    if (!verifyPsw) {
      ctx.helper.handleError( {ctx, message:'密码修改失败，旧密码验证失败', result: user } )
      return
    } else {
      // 重置密码
      values.password = await ctx.genHash(values.password)
      const result = service.user.findByIdAndUpdate(_id, values)
      ctx.helper.handleError( {ctx, message:'密码修改成功', result } )
    }
  }

}

module.exports = UserAccessService
