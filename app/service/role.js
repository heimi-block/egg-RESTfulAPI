const Service = require('egg').Service

class RoleService extends Service {
  // create======================================================================================================>
  async create(payload) {
    return this.ctx.model.Role.create(payload) 
  }

  // destroy======================================================================================================>  
  async destroy(_id) {
    const { ctx, service } = this
    const role = await ctx.service.role.find(_id)
    if (!role) {
      ctx.throw(404, 'role not found')
    }
    return ctx.model.Role.findByIdAndRemove(_id)
  }

  // update======================================================================================================>
  async update(_id, payload) {
    const { ctx, service } = this
    const role = await ctx.service.role.find(_id)
    if (!role) {
      ctx.throw(404, 'role not found')
    }
    return ctx.model.Role.findByIdAndUpdate(_id, payload)
  }

  // show======================================================================================================>
  async show(_id) {
    const role = await this.ctx.service.role.find(_id)
    if (!role) {
      this.ctx.throw(404, 'role not found')
    }
    return this.ctx.model.Role.findById(_id)
  }

  // index======================================================================================================>
  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload
    let res = []
    let count = 0
    let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)
    if(isPaging) {
      if(search) {
        res = await this.ctx.model.Role.find({name: { $regex: search } }).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.Role.find({}).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.Role.count({}).exec()
      }
    } else {
      if(search) {
        res = await this.ctx.model.Role.find({name: { $regex: search } }).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.Role.find({}).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.Role.count({}).exec()
      }
    }
    // 整理数据源 -> Ant Design Pro
    let data = res.map((e,i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.key = i
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { count: count, list: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
  }

  // removes======================================================================================================>
  async removes(values) {
    return this.ctx.model.Role.remove({ _id: { $in: values } })
  }

  // Commons======================================================================================================>
  async find(id) {
    return this.ctx.model.Role.findById(id)
  }

}

module.exports = RoleService