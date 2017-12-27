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
  async create() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.createRule)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.user.create(payload)
    // 设置响应内容和响应状态码
    ctx.body = res
    ctx.status = 201
  }

  // 删除单个用户
  async destory() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    await service.user.destory(id)
    // 设置响应内容和响应状态码
    ctx.status = 204
  }
 
  // 获取单个用户
  async show() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.user.show(id)
    // 设置响应内容和响应状态码
    ctx.body = res
    ctx.status = 200
  }

  // 获取所有用户(分页/模糊)
  async index() {
    const { ctx, service } = this
    // 组装参数
    const payload = ctx.query
    // 调用 Service 进行业务处理
    const res = await service.user.index(payload)
    // 设置响应内容和响应状态码
    ctx.body = res
    ctx.status = 200
  }

  // 删除所选用户(条件id[])
  async removes() {
    const { ctx, service } = this
    // 组装参数
    // const payload = ctx.queries.id
    const payload = ctx.request.body.id
    // 调用 Service 进行业务处理
    const result = await service.user.removes(payload)
    // 设置响应内容和响应状态码
    ctx.status = 204
  }
  
}


module.exports = UserController