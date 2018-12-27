# 步骤
- 在mysql中创建一个auth的数据库，导入mysql.sql
- 更改server/config/config.default.js下mysql和redis的配置
- 开启服务端
```js
    cd server
    npm install
    npm run dev
```
- 开启客户端
```js
    cd client
    npm install
    npm start
```
- 浏览器打开 ``http://127.0.0.1:4200/`` 有两个账号可以登录
```js
 a. 账号名:super  密码：123456
 b. 账号名:test 密码：123456
```
- 浏览器打开 ``http://127.0.0.1:7001/public/swagger/index.html`` 可以查看后台接口文档地址