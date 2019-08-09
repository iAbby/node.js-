
#前后端不分离项目

基于NODEJS+express+MongoDB

#启动项目
#1.先启动mongodb数据库
(1).启动mongodb服务的步骤
(2).在mongodb目录中新建一个data文件夹
(3).进入data目录，新建 db 和 log目录
(4).打开CMD，进入到mongodb 的 bin目录
(5).输入指令：mongod --dbpath 数据库路径 --port 端口号（mongod --dbpath ../data/db --port 27023）
(6).看到port 27017 ，表明mongodb服务已启动

#2.启动项目
node  main.js

先注册后去数据库刷新就可自动建表
