const Controller = require('egg').Controller

class UserController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.createRule = {
      mobile: {type: 'string', required: true, allowEmpty: false, format: /^[0-9]{11}$/},
      password: {type: 'password', required: true, allowEmpty: false, min: 6},
      realName: {type: 'string', required: true, allowEmpty: false, format: /^[\u2E80-\u9FFF]{2,6}$/}
    }

    this.createPswRule = {
      password: {type: 'password', required: true, allowEmpty: false, min: 6},
      oldPassword: {type: 'password', required: true, allowEmpty: false, min: 6},      
    }

  }

  // 创建用户
  async add() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.createRule)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    let role_not_exits = await service.role.fetch(payload.role)
    if(!role_not_exits) {
      ctx.helper.handleError( {ctx, message:'所分配角色不存在', result: role_not_exits } )
      return
    }
    const result = await service.user.add(payload)
    // 设置响应内容和响应状态码
    ctx.helper.handleSuccess( {ctx, message:'角色创建成功', result } )
  }

  // 删除角色
  async remove() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service
    const result = await service.user.remove(id)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'删除失败，该用户不存在', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'用户删除成功', result })
  }  

  // 删除所选用户(条件id[]=>?id=1&id=2..)
  async removeAll() {
    const { ctx, service } = this
    // 组装参数
    const values = ctx.queries.id
    // 调用 Service
    const result = await service.user.removeAll(values)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'用户删除失败，参数传入错误', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'用户删除成功', result })
  }

  // 修改密码
  async update() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.createPswRule)
    // 组装参数
    const { id } = ctx.params
    const values = ctx.request.body || {}
    // 调用 Service
    const result = await service.user.updatePsw(id, values)
    // 设置响应内容和响应状态码
    if(result === 116){
      ctx.helper.handleError( { ctx, message:'密码修改失败，用户不存在', result })
    }else if(result === 115){
      ctx.helper.handleError( { ctx, message:'密码修改失败，旧密码验证失败', result })      
    }else if(result === 117){
      ctx.helper.handleError( { ctx, message:'密码修改失败，新旧密码相同', result })            
    }else{
      result.password = 'what the fuck'
      ctx.helper.handleSuccess( { ctx, message:'密码修改成功', result })
    }
  }
  
  // 获取单个角色
  async fetch() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service
    const result = await service.user.fetch(id)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'获取失败，该用户不存在', result })
    }else{
      result.password = 'what the fuck'
      ctx.helper.handleSuccess( { ctx, message:'获取用户成功', result }) 
    }
  }

  // 获取所有角色(分页/模糊)
  async fetchAll() {
    const { ctx, service } = this
    // 组装参数
    const pageable = ctx.query
    // 调用 Service
    const result = await service.user.fetchAll(pageable)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'用户列表获取失败，参数传入错误', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'用户列表获取成功', result })       
  }


}


module.exports = UserController