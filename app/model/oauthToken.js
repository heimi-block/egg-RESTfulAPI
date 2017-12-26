module.exports = app => {
  const mongoose = app.mongoose
  
  const OauthTokenSchema = new mongoose.Schema({
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    refreshToken:  { type: String },
    refreshTokenExpiresAt: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clientId: { type: String },
    createdAt: { type: Date, default: Date.now }
  })

  return mongoose.model('OauthToken', OauthTokenSchema)
}