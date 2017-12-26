const fs = require('fs')
const path = require('path')
const Controller = require('egg').Controller
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')


class UploadController extends Controller {
  constructor (ctx){
    super(ctx)
  }

  async add() {
    const { ctx, service } = this
    // 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
    // 只支持上传一个文件。
    // 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
    const stream = await ctx.getFileStream()
    // 所有表单字段都能通过 `stream.fields` 获取到

    // 文件名称
    // const filename = path.basename(stream.filename)
    
    // 文件扩展名称
    const extname = path.extname(stream.filename).toLowerCase()

    // 组装参数
    const attachment = new this.ctx.model.Attachment
    attachment.extname = extname
    attachment.url = `/uploads/${attachment._id.toString()}${extname}`

    const target = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id.toString()}${extname}`)
    const writeStream = fs.createWriteStream(target)
    // 文件处理，上传到云存储等等

    let result 
    try {
      await awaitWriteStream(stream.pipe(writeStream))
      // 调用Service
      result = await service.upload.add(attachment)
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream)
      throw err
    }
    ctx.helper.handleSuccess( {ctx, message:'单个文件上传成功', result } )
  }

  async multiple() {
    // 要获取同时上传的多个文件，不能通过 ctx.getFileStream() 来获取
    const { ctx, service } = this

    const parts = ctx.multipart()
    const res = {}
    const files = []

    let part
    // parts() return a promise
    while ((part = await parts()) != null) {
      if (part.length) {
        // 如果是数组的话是 filed
        // console.log('field: ' + part[0])
        // console.log('value: ' + part[1])
        // console.log('valueTruncated: ' + part[2])
        // console.log('fieldnameTruncated: ' + part[3])
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return
        }
        // part 是上传的文件流
        // console.log('field: ' + part.fieldname)
        // console.log('filename: ' + part.filename)
        // console.log('extname: ' + part.extname)
        // console.log('encoding: ' + part.encoding)
        // console.log('mime: ' + part.mime)
        
        // 文件处理，上传到云存储等等
        
        // const filename = part.filename.toLowerCase()
        // 文件扩展名称
        const extname = path.extname(part.filename).toLowerCase()
        
        // 组装参数
        const attachment = new this.ctx.model.Attachment
        attachment.extname = extname
        attachment.url = `/uploads/${attachment._id.toString()}${extname}`
    
        // 调用Service
        
        this.ctx.model.Attachment.create(attachment)
        // const target = path.join(this.config.baseDir, 'app/public/uploads', filename)
        const target = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id.toString()}${extname}`)        
        const writeStream = fs.createWriteStream(target)
        
        let result
        try {
          // result = await ctx.oss.put('egg-multipart-test/' + part.filename, part)
          await awaitWriteStream(part.pipe(writeStream))
          // 调用Service
          result = await service.upload.add(attachment)
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part)
          throw err
        }
        files.push(`${attachment.url}`)
        // console.log(result)
      }
    }
    ctx.helper.handleSuccess( {ctx, message:'多个文件上传成功', result: { url: files } } )
    // console.log('and we are done parsing the form!')
  }

  async remove() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service
    const result = await service.upload.remove(id)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'删除失败，该文件不存在', result })
    }else{
      // 删除
      const target = path.join(this.config.baseDir, 'app/public/uploads', `${result._id}${result.extname}`)
      fs.unlinkSync(target)
      ctx.helper.handleSuccess( { ctx, message:'文件删除成功', result })
    }
  }

  // 删除所选文件(条件id[]=>?id=1&id=2..)
  async removeAll() {
    const { ctx, service } = this
    // 组装参数
    const values = ctx.queries.id
    // 设置响应内容和响应状态码
    for (let attachment of values) {
      // 调用 Service
      const result = await service.upload.fetch(attachment)
      if(!result){
        ctx.helper.handleError( { ctx, message:'文件删除失败，参数传入错误或文件不存在', result })
        return false
      }
      await service.upload.remove(attachment)
      const target = path.join(this.config.baseDir, 'app/public/uploads', `${result._id}${result.extname}`)
      fs.unlinkSync(target)
    }
    ctx.helper.handleSuccess( { ctx, message:'文件删除成功' })
  }

  async update() {
    const { ctx, service } = this
    // 传入要修改的文档ID
    // 组装参数
    const { id } = ctx.params
    // 校验参数
    const attachment = await service.upload.fetch(id)
    if(!attachment){
      ctx.helper.handleError( { ctx, message:'更新失败，该文件不存在', result: attachment })
    }else{
      // 删除
      const target_D = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id}${attachment.extname}`)
      fs.unlinkSync(target_D)
      // 获取用户上传的替换文件
      const stream = await ctx.getFileStream()
      // 文件扩展名称
      const extname = path.extname(stream.filename).toLowerCase()
      // 组装更新参数
      attachment.extname = extname
      attachment.url = `/uploads/${attachment._id.toString()}${extname}`

      const target_U = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id}${extname}`)      
      const writeStream = fs.createWriteStream(target_U)
      // 文件处理，上传到云存储等等
      try {
        await awaitWriteStream(stream.pipe(writeStream))
        // 调用Service
        await service.upload.add(attachment)
      } catch (err) {
        // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        await sendToWormhole(stream)
        throw err
      }
      // 调用Service 保持原图片ID不变，更新其他属性
      const result = await service.upload.update(id, attachment)
      ctx.helper.handleSuccess( { ctx, message:'文件修改成功', result })
    }
  }

  // 获取单个文件
  async fetch() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service
    const result = await service.upload.fetch(id)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'获取失败，该文件不存在', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'文件获取成功', result })    
  }

  // 获取所有角色(分页/模糊)
  async fetchAll() {
    const { ctx, service } = this
    // 组装参数
    const pageable = ctx.query
    // 调用 Service
    const result = await service.upload.fetchAll(pageable)
    // 设置响应内容和响应状态码
    if(!result){
      ctx.helper.handleError( { ctx, message:'文件列表获取失败，参数传入错误', result })
    }else
      ctx.helper.handleSuccess( { ctx, message:'文件列表获取成功', result })       
  }
}


module.exports = UploadController