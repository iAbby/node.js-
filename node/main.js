/**
 * Created by Administrator on 2017/11/4 0004.
 */

const express = require('express');
const mongoose = require('mongoose');
const swig = require('swig');
const Cookies = require('cookies');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Seller = require('./models/seller');



const mainRouter = require('./routers/buyer/mainRouter');
// const apiRouter = require('./routers/buyer/apiRouter');
const adminRouter = require('./routers/seller/adminRouter');

const server = express();

server.use('/public',express.static('./static'));
server.use('/images',express.static('./images'));
// //设置Cookies
// server.use(function(req,res,next){
//     let cookies = new Cookies(req,res);
//     req.cookies = cookies;

//     let userId = req.cookies.get('USERID');
//     // let sellerId = req.cookies.get('SELLERID');

//     if(userId){
//         User.findById(userId).then((userInfo)=>{
//             if(userInfo){//登录了
//                 req.userInfo = userInfo;
//                 next();
//             }else{//用户信息已经被串改了
//                 req.userInfo = {};
//                 next();
//             }
//         })
//     }else{//没有登录
//         req.userInfo = {};
//         next();
//     }
// })


//处理请求cookies
server.use(function(req, res, next){
    // 对请求处理cookies
    let cookies = new Cookies(req, res);
    req.cookies = cookies;
    next();
});

server.use((req, res, next)=>{
// 读取用户id的cookies
    let userId = req.cookies.get('USERID');
    if(userId){
        User.findById(userId).then((userInfo)=>{
            if(userInfo){//登录了
                req.userInfo = userInfo;
                next();
            }else{//用户信息已经被串改了
                req.userInfo = {};
                next();
            }
        })
    }else{//没有登录
        req.userInfo = {};
        next();
    }
})

server.use((req, res, next)=>{
// 读取商家cookies
    let sellerid = req.cookies.get('SELLERID');
    if(sellerid){
        Seller.findById(sellerid).then(sellerInfo=>{
            if(sellerInfo){
                req.sellerInfo = sellerInfo;
                next();
            }else{
                req.sellerInfo = {};
                next();
            }
        })

    }else{
        req.sellerInfo = {};
        next();
    }
})




server.engine('html',swig.renderFile);
server.set('views','./html');
server.set('view engine','html');
swig.setDefaults({cache:false});


//响应买家请求
server.use('/',mainRouter);
//响应卖家请求
server.use('/admin',adminRouter);

server.use(bodyParser.urlencoded());

//响应买家ajax请求
server.use('/api',require('./routers/buyer/apiRouter'));
//响应卖家ajax请求
server.use('/api/admin',require('./routers/seller/apiRouter'));



//
mongoose.connect('mongodb://localhost:27023',(error)=>{
    if(error){
        console.log('连接数据库失败');
        console.log(error);
    }
    else {
        console.log('连接数据库成功');
        server.listen(4000,'localhost',(error)=>{
            if(error){
                console.log('开启服务器失败');
                console.log(error);
            }
            else {
                console.log('开启服务器成功');
                console.log('http://localhost:4000');

            }
        })
    }
})

