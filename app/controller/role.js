const Controller = require('egg').Controller

class RoleController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.createRule = {
      name: { type: 'string'}
    }

  }

  // 创建角色
  async add() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.createRule)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const result = await service.role.add(payload)
    // 设置响应内容和响应状态码
    ctx.helper.handleSuccess( { ctx, message:'角色创建成功', result } )
  }

  // 删除角色
  async remove() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service
    const result = await service.role.remove(id)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'删除失败，该角色不存在', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'角色删除成功', result })
  }

  // 删除所选角色(条件id[]=>?id=1&id=2..)
  async removeAll() {
    const { ctx, service } = this
    // 组装参数
    const values = ctx.queries.id
    // 调用 Service
    const result = await service.role.removeAll(values)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'角色删除失败，参数传入错误', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'角色删除成功', result })
  }

  // 修改角色
  async update() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.createRule)
    // 组装参数
    const { id } = ctx.params
    const values = ctx.request.body || {}
    // 调用 Service
    const result = await service.role.update(id, values)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'修改失败，该角色不存在', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'角色修改成功', result })
  }

  // 获取单个角色
  async fetch() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service
    const result = await service.role.fetch(id)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'获取失败，该角色不存在', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'角色获取成功', result })    
  }

  // 获取所有角色(分页/模糊)
  async fetchAll() {
    const { ctx, service } = this
    // 组装参数
    const pageable = ctx.query
    // 调用 Service
    const result = await service.role.fetchAll(pageable)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'角色列表获取失败，参数传入错误', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'角色列表获取成功', result })       
  }


}


module.exports = RoleController