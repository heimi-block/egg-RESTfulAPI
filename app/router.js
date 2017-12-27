'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  // role
  // router.post('/api/role', controller.role.create)
  // router.delete('/api/role/:id', controller.role.destory)
  // router.put('/api/role/:id', controller.role.update)
  // router.get('/api/role/:id', controller.role.show)
  // router.get('/api/role', controller.role.index)
  router.delete('/api/role', controller.role.removes)
  // router.resources('role', '/api/role', controller.role)

  // userAccess
  router.post('/api/user/access/login', controller.userAccess.login)
  router.get('/api/user/access/logout', controller.userAccess.logout)
  router.put('/api/user/access/resetPsw', app.jwt, controller.userAccess.resetPsw)

  // 用户
  router.post('/api/user', controller.user.add)
  router.get('/api/user/:id', controller.user.fetch)
  router.get('/api/user', controller.user.fetchAll)
  router.put('/api/user/:id', controller.user.update)

  // upload
  router.post('/api/upload', controller.upload.add)
  router.delete('/api/upload/:id', controller.upload.remove)
  router.delete('/api/uploads', controller.upload.removeAll)
  router.post('/api/uploads', controller.upload.multiple)
  router.put('/api/upload/:id', controller.upload.update)
  router.get('/api/upload/:id', controller.upload.fetch)
  router.get('/api/upload', controller.upload.fetchAll)



  // Todo 整理Upload，role代码

}
