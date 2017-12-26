// need implement some follow functions
module.exports = app => {  
  class Model {
    constructor (ctx) {
      this.ctx = ctx
    }

    async getClient(clientId, clientSecret) {
      const client = {
        clientId: 'my_app',
        clientSecret: 'my_secret',
        grants: [ 'password' ]
      }
      if (clientId !== client.clientId || clientSecret !== client.clientSecret) {
        return
      }
      return client
    }

    async getUser(username, password) {
      const user = await app.model.User.findOne({mobile: username})
      if(!user){
        return 
      }
      const result = await this.ctx.compare(password, user.password)
      if(!result){
        return
      }
      return { userId: user._id }
    }

    async getAccessToken(bearerToken) {
      const token = await app.model.OauthToken.findOne({accessToken: bearerToken})
      if(!token){
        return
      }
      const { userId, clientId } = token
      const user = await app.model.User.findById(userId)
      token.user = user
      token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt)
      token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt)
      return token
    }

    async saveToken(token, client, user) {      
      const _token = Object.assign({}, token, { userId: user.userId || user.id }, { clientId: client.clientId })
      await app.model.OauthToken(_token).save()
      _token.client = client
      _token.user = user
      return _token
    }

    async revokeToken(token) {
      console.log('hehhehehe', token)
      // await app.model.OauthToken.remove({refreshToken: token.refreshToken})
    }

  }  
  return Model
}

