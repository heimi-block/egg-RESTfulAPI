# egg-RESTfulAPI

基于Egg.js的 RESTful API 模板，用于快速集成开发RESTful前后端分离的服务端。
(建议用于学习入门EGGJS和Mongoose,如果作为生产请自行优化和改造)

## 特性

- :zap: **框架选择**：基于 Egg.js 2.0
- :fire: **数据模型**：基于 Mongoose 存储
- :lock: **授权验证**：基于JWT
- :rocket: **内置功能**：文件处理，用户系统，统一错误处理及接口返回标准，全方位CRUD,分页,模糊查询的等数据操作Demo
- :sparkles: **最佳实践**：接口设计适配 Ant Design Pro 或 微信小程序开发等。(内置分页及ant接口返回标准)

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ cd app & mkdir public & cd public & mkdir uploads
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
