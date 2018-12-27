'use strict';
module.exports = () => {
  const config = exports = {};
  // 加载 errorHandler 中间件
  config.middleware = ['dealPage', 'errorHandler', 'apiWrapper'];
  config.errorHandler = {
    match: '*',
  };
};
