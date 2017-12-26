const Service = require('egg').Service

class RoleService extends Service {

  async add(payload) {
    return this.ctx.model.Role.create(payload) 
  }
  
  async remove(payload) {
    return this.ctx.model.Role.findByIdAndRemove(payload)
  }

  async removeAll(values) {
    return this.ctx.model.Role.remove({ _id: { $in: values } })
  }

  async update(id, values) {
    return this.ctx.model.Role.findByIdAndUpdate(id, values)
  }

  async fetch(id) {
    return this.ctx.model.Role.findById(id)
  }

  async fetchAll(pageable) {
    const { currentPage, pageSize, isPaging, search } = pageable
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

    // 整理数据源
    let data = res.map((e,i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.key = i
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { count: count, data: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
  }

}

module.exports = RoleService