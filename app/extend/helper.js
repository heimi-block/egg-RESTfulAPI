const moment = require('moment')

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD hh:mm:ss')

// 处理成功响应
exports.handleSuccess = ({ ctx, message = '请求成功', result = null })=> {
  ctx.body = {
    code: 0,
    message,
    result
  }
  ctx.status = 200
}

// 处理失败相应
exports.handleError = ({ ctx, message = '请求失败', error = null })=> {
  ctx.body = {
    code: 1,
    message,
    error
  }
  ctx.status = 200
}
