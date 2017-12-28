module.exports = app => {
  const mongoose = app.mongoose

  const AttachmentSchema = new mongoose.Schema({
    extname: { type: String },
    url: { type: String },
    filename: { type: String },
    extra: {  type: String  },
    createdAt: { type: Date, default: Date.now }
  })
  
  return mongoose.model('Attachment', AttachmentSchema)

}