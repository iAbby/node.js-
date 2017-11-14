/**
 * Created by Administrator on 2017/11/4 0004.
 */
const express = require('express');
const User = require('../../models/user');
const Seller = require('../../models/seller');
const Add = require('../../models/adds');
const Order = require('../../models/order');
const url = require('url');

const router = express.Router();

//用户注册
router.post('/register',(req,res,next)=>{
    console.log('响应注册页面');
    let Data = {
        message: '',
        code: 0
    };
    let query = req.body;
    console.log(query);

    if(query.username == '' || query.password == '' || query.comfirmPassword==''){
        console.log('用户名、密码、确认密码不能为空');
        Data.message = '用户名、密码、确认密码都不能为空';
        Data.code = 1;
        res.json(Data);
    }
    // 密码和确认密码是否相等
    else if(query.password!= query.comfirmPassword){
        console.log('两次密码不一致');
        Data.message = '两次密码不一致';
        Data.code = 2;
        res.json(Data);
    }
    else {
        User.findOne({ username:query.username }).then((result)=>{
            if(result){
                console.log('该用户已存在');
                Data.message = '该用户已存在';
                Data.code = 4;
                res.json(Data);
            }
            else {
                let user = new User({
                    username:query.username,
                    password:query.password
                });
                user.save().then((userInfo)=>{
                    if(userInfo){
                        console.log('注册成功');
                        Data.message = '注册成功';
                        Data.code = 0;
                        res.json(Data);
                    }
                    else{
                        console.log('注册失败，数据库错误');
                        eData.message = '注册失败，数据库错误';
                        Data.code = 5;
                        res.json(Data);
                    }
                })
            }
        })
    }
})

//用户登录
router.post('/login',(req,res,next)=>{
    let Data = {
        message:'登陆成功',
        code:0
    }
    let query = req.body;
    if(query.username==''||query.password==''){
        console.log('用户名、密码不能留空');
        Data.message = '用户名、密码不能留空';
        Data.code = 1;
        res.json(Data);
    }
    else {
        User.findOne({
            username:query.username
        }).then((userInfo)=>{
            if (userInfo){
                if (userInfo.password == query.password){
                    req.cookies.set('USERID', userInfo._id);
                    res.json(Data);
                }
                else {
                    console.log('密码错误');
                    Data.message = '密码错误';
                    Data.code = 2;
                    res.json(Data);
                }
            }
            else {
                console.log('该用户不存在');
                Data.message = '该用户不存在';
                Data.code = 3;
                res.json(Data);
            }
        })
    }
})
//退出登录
router.get('/logout', (req, res, next)=>{
    //请求用户id cookie

    req.cookies.set('USERID', null);
    res.json({
        message: '退出成功',
        code: 0
    })
    // console.log('退出成功')
})

//购买商品
router.get('/details_buy',(req,res,next)=>{
    console.log('响应/details_buy页面')
    let Data = {
        message: '购买成功',
        code: 0
    };
    let query = req.body;
    let userid =  req.cookies.get('USERID');
    let goodsid = req.cookies.get('GOODS');

    Add.findById(goodsid).populate(['seller']).then((result)=>{
            if(userid){
                let order = new Order({
                    name: req.query.name,
                    selectSize:req.query.selectSize,
                    selectStyle: req.query.selectStyle,
                    price:req.query.price,
                    seller:result.seller._id,
                    goods:goodsid,
                    buyer:userid,
                    pic:req.query.pic
                    // number:req.query.number
                });
                
                order.save().then((orderInfo)=>{
                    if(orderInfo){
                        //商家注册成功
                        console.log('购买成功');
                        // console.log(orderInfo);
                        let orderid =  req.cookies.set('ORDER', orderInfo.goods);
                        res.json(Data);
                    }
                    else {
                        console.log('购买失败');
                        Data.code = 4;
                        Data.message = '购买失败，数据库错误';
                        res.json(Data);
                    }
                })
            }

            else {
                Data.code = 5;
                Data.message = '请先登录';
                res.json(Data);
                
            }

        // })
    })



})




module.exports = router;
// )