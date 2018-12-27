'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1508040976475_5909';
  config.security = {
    // domainWhiteList: [ '*' ],
    methodnoallow: { enable: false },
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
    credentials: true,
  };
  // 中间件
  config.middleware = ['dealPage', 'errorHandler', 'apiWrapper'];
  config.errorHandler = {
    ignore: '/user/login'
  };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'auth',
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password: 'password',
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 1
    },
    agent: true
  }

  config.oss = {
    client: {
      accessKeyId: 'LTAIYsMUwuJOpVSl',
      accessKeySecret: 'nogxfJqb0772fxvOxTlQDOmPo5s5Rn',
      bucket: 'chinese-famous-brand',
      endpoint: 'oss-cn-beijing.aliyuncs.com',
      timeout: '60s',
    },
  };

  config.jwt = {
    secret: 'gdcert',
    exp: '2h'
  };

  config.httpclient = {
    enableDNSCache: true
  }

  exports.swagger = {
    enable: true,
    mountPath: '/swagger.html', // swagger-ui  address  <domain>/test-mount
    swaggerFilePath: '../swagger.json', // swagger file default path
    enableGoogleFont: false,
  };

  return config;
};
