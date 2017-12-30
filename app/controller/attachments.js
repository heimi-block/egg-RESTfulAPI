const Controller = require('egg').Controller

class AttachmentsController extends Controller {
  async index() {
    const {ctx} = this
    const res = [{
    "id": "fake-list-0",
    "owner": "付小小",
    "title": "Alipay",
    "avatar": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
    "cover": "https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png",
    "status": "active",
    "percent": 88,
    "logo": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
    "href": "https://ant.design",
    "updatedAt": "2017-12-29T04:51:11.653Z",
    "createdAt": "2017-12-29T04:51:11.653Z",
    "subDescription": "那是一种内在的东西， 他们到达不了，也无法触及的",
    "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
    "activeUser": 164274,
    "newUser": 1407,
    "star": 184,
    "like": 128,
    "message": 15,
    "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
    "members": [
        {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
            "name": "曲丽丽"
        },
        {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
            "name": "王昭君"
        },
        {
            "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
            "name": "董娜娜"
        }
    ]
}]

    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }
}

module.exports = AttachmentsController
