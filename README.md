# egg-RESTfulAPI

基于Egg.js的 RESTful API 模板，用于快速集成开发RESTful前后端分离的服务端。

## 特性

- :zap: **框架选择**：基于 Egg.js 2.0
- :fire: **数据模型**：基于 Mongoose 存储
- :lock: **服务端验证**：基于JWT，需要Auth2.0验证代码的朋友请提issue
- :rocket: **内置功能**：文件处理，用户系统，统一错误处理及接口返回标准，全方位CRUD,分页,模糊查询的等数据操作例子
- :sparkles: **最佳实践**：接口设计视频 Ant Design Pro 或 微信小程序开发等。(内置分页及ant接口返回标准)

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
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