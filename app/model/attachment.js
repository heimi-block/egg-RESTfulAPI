module.exports = app => {
  const mongoose = app.mongoose

  const AttachmentSchema = new mongoose.Schema({
    extname: { type: String },
    url: { type: String },
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
  })
  
  return mongoose.model('Attachment', AttachmentSchema)

}