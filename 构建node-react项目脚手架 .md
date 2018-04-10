## react+antd+express开发流程

### 配置整体的环境和项目框架
- 项目环境
    + node
    + webpack
    + mysql
- 搭建项目框架
    + 安装express-generator生成器。
        * ```npm install -g express-generator ```
    + 安装react脚手架。
        * ```npm install -g create-react-app ```
    + 安装nodemon,主要是不用重启express。
        * ```npm install -g nodemon```
- 修改配置文件
    + 修改bin目录下的www文件，将端口号改为3005。
        * ```var port = normalizePort(process.env.PORT || '3005');```
    +修改express工程中的package.json。
        * ```"start": "nodemon ./bin/www"```
    + 修改reactjs工程的package.json，加入新的参数。作用是做一个代理，将向3000端口的请求转为请求3005端口。这样在将来发布时也不会有问题。
        *  ```"proxy": "http://localhost:3005/",```






