const Service = require('egg').Service

class UserService extends Service {

  async add(payload) {
    payload.password = await this.ctx.genHash(payload.password)
    return this.ctx.model.User.create(payload)
  }

  async remove(payload) {
    return this.ctx.model.User.findByIdAndRemove(payload)
  }

  async removeAll(values) {
    return this.ctx.model.User.remove({ _id: { $in: values } })
  }

  async updatePsw(id, values) {
    const WRONG_PSW = 115
    const WRONG_USER = 116
    const WRONG_STATUS = 117
    let dbPwd = await this.ctx.model.User.findById(id).select('password').exec()
    if(!dbPwd.password){
      return WRONG_USER
    }
    let verifing = await this.ctx.compare(values.oldPassword, dbPwd.password)
    if(verifing){
      let isSame = await this.ctx.compare(values.password, dbPwd.password)
      if(isSame){
        return WRONG_STATUS
      }else{
        values.password = await this.ctx.genHash(values.password)
        return this.ctx.model.User.findByIdAndUpdate(id, values)
      }
    }else{
      return WRONG_PSW
    }
  }

  async fetch(id) {
    return this.ctx.model.User.findById(id).populate('role')
  }

  async fetchAll(pageable) {
    const { currentPage, pageSize, isPaging, search } = pageable
    let res = []
    let count = 0
    let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)
    if(isPaging) {
      if(search) {
        res = await this.ctx.model.User.find({realName: { $regex: search } }).populate('role').skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({}).populate('role').skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    } else {
      if(search) {
        res = await this.ctx.model.User.find({realName: { $regex: search } }).populate('role').sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({}).populate('role').sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    }

    // 整理数据源
    let data = res.map((e,i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.key = i
      jsonObject.password = 'what the fuck'
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { count: count, data: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
  }

}


module.exports = UserService