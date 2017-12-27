const fs = require('fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const Service = require('egg').Service

class UploadService extends Service {

  async create(stream, payload) {
    const {ctx, service} = this
    const target = path.join(this.config.baseDir, 'app/public/uploads', `${payload._id.toString()}${payload.extname}`)
    const writeStream = fs.createWriteStream(target)
    // 文件处理，上传到云存储等等
    let res 
    try {
      await awaitWriteStream(stream.pipe(writeStream))
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream)
      throw err
    }
    return this.ctx.model.Attachment.create(payload) 
  }

  // destory======================================================================================================>  
  async destory(_id) {
    const { ctx, service } = this
    const attachment = await ctx.service.upload.find(_id)
    if (!attachment) {
      ctx.throw(404, 'attachment not found')
    }else{
      const target = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id}${attachment.extname}`)
      fs.unlinkSync(target)
    }
    return ctx.model.Attachment.findByIdAndRemove(_id)
  }

  // update======================================================================================================>  
  async updatePre(_id) {
    const { ctx, service } = this
    const attachment = await ctx.service.upload.find(_id)
    if (!attachment) {
      ctx.throw(404, 'attachment not found')
    }else{
      const target = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id}${attachment.extname}`)
      fs.unlinkSync(target)
    }
    return attachment
  }

  async update(id, values) {
    return this.ctx.model.Attachment.findByIdAndUpdate(id, values)
  }

  // show======================================================================================================>
  async show(_id) {
    const attachment = await this.ctx.service.upload.find(_id)
    if (!attachment) {
      this.ctx.throw(404, 'attachment not found')
    }
    return this.ctx.model.Attachment.findById(_id)
  }

  // index======================================================================================================>
  async index(payload) {
    let { currentPage, pageSize, isPaging, search } = payload
    let res = []
    let count = 0
    let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)
    if(isPaging) {
      if(search) {
        search = search.replace('/uploads/', '')
        res = await this.ctx.model.Attachment.find({url: { $regex: search } }).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.Attachment.find({}).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.Attachment.count({}).exec()
      }
    } else {
      if(search) {
        search = search.replace('/uploads/', '')
        res = await this.ctx.model.Attachment.find({url: { $regex: search } }).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.Attachment.find({}).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.Attachment.count({}).exec()
      }
    }
    // 整理数据源 -> Ant Design Pro
    let data = res.map((e,i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.key = i
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { count: count, data: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
  }

  // Commons======================================================================================================>
  async find(id) {
    return this.ctx.model.Attachment.findById(id)
  }
}

module.exports = UploadService