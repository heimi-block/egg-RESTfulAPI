const fs = require('fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const Service = require('egg').Service

class UploadService extends Service {

  async create(payload) {
    return this.ctx.model.Attachment.create(payload) 
  }

  // destroy======================================================================================================>  
  async destroy(_id) {
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

  async extra(_id, values) {
    const { ctx, service } = this
    const attachment = await ctx.service.upload.find(_id)
    if (!attachment) {
      ctx.throw(404, 'attachment not found')
    }
    return this.ctx.model.Attachment.findByIdAndUpdate(_id, values)
  }

  async update(_id, values) {
    return this.ctx.model.Attachment.findByIdAndUpdate(_id, values)
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
    // 支持全部all 无需传入kind
    // 图像kind = image ['.jpg', '.jpeg', '.png', '.gif']
    // 文档kind = document ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.key', '.numbers', '.pages', '.pdf', '.txt', '.psd', '.zip', '.gz', '.tgz', '.gzip' ]
    // 视频kind = video ['.mov', '.mp4', '.avi']
    // 音频kind = audio ['.mp3', '.wma', '.wav', '.ogg', '.ape', '.acc']

    const attachmentKind = { 
      image: ['.jpg', '.jpeg', '.png', '.gif'], 
      document: ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.key', '.numbers', '.pages', '.pdf', '.txt', '.psd', '.zip', '.gz', '.tgz', '.gzip' ],
      video: ['.mov', '.mp4', '.avi'],
      audio: ['.mp3', '.wma', '.wav', '.ogg', '.ape', '.acc']
    }

    let { currentPage, pageSize, isPaging, search, kind } = payload
    let res = []
    let count = 0
    let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)
    if(isPaging) {
      if(search) {
        if (kind) {
          res = await this.ctx.model.Attachment.find({filename: { $regex: search }, extname: { $in: attachmentKind[`${kind}`]} }).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        }else{
          res = await this.ctx.model.Attachment.find({filename: { $regex: search } }).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        }
        count = res.length
      } else {
        if (kind) {
          res = await this.ctx.model.Attachment.find({ extname: { $in: attachmentKind[`${kind}`]} }).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
          count = await this.ctx.model.Attachment.count({ extname: { $in: attachmentKind[`${kind}`]} }).exec()
        }else{
          res = await this.ctx.model.Attachment.find({}).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
          count = await this.ctx.model.Attachment.count({}).exec()
        }
      }
    } else {
      if(search) {
        if (kind) {
          res = await this.ctx.model.Attachment.find({filename: { $regex: search }, extname: { $in: attachmentKind[`${kind}`]} }).sort({ createdAt: -1 }).exec()
        }else{
          res = await this.ctx.model.Attachment.find({filename: { $regex: search }}).sort({ createdAt: -1 }).exec()
        }
        count = res.length
      } else {
        if (kind) {
          res = await this.ctx.model.Attachment.find({extname: { $in: attachmentKind[`${kind}`]} }).sort({ createdAt: -1 }).exec()
          count = await this.ctx.model.Attachment.count({ extname: { $in: attachmentKind[`${kind}`]} }).exec()
        }else{
          res = await this.ctx.model.Attachment.find({}).sort({ createdAt: -1 }).exec()
          count = await this.ctx.model.Attachment.count({}).exec()
        }
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

  // Commons======================================================================================================>
  async find(id) {
    return this.ctx.model.Attachment.findById(id)
  }
}

module.exports = UploadService