/**
 * Created by Administrator on 2017/11/6 0006.
 */

const express = require('express');
const Seller = require('../../models/seller');
const Adds = require('../../models/adds');
const url = require('url');
const multiparty = require('multiparty');
const router = express.Router();
//商家注册
router.post('/register',(req,res,next)=>{
    console.log('响应请求成功');
    let query = req.body;
    let Data = {
        code:0,
        message:'注册成功'
    }
    //商家注册
    if(query.sellername==''|| query.password==''|| query.comfirmPassword==''){
        console.log('店铺名称、密码不能留空');
        Data.code = 1;
        Data.message = '店铺名称、密码不能留空';
        res.json(Data);

    }
    else if(query.password!=query.comfirmPassword){
        console.log('密码不一致');
        Data.code = 2;
        Data.message = '密码不一致';
        res.json(Data);
    }
    else {
        Seller.findOne({
            sellername:query.sellername
        }).then((sellerInfo)=>{
            if(sellerInfo){
                console.log('该用户已存在');
                Data.code = 3;
                Data.message = '该用户已存在';
                res.json(Data);
            }
            else {
                seller = new Seller({
                    sellername: query.sellername,
                    description: query.description,
                    password: query.password,
                    logo:query.logo
                });console.log(query.logo);
                seller.save().then((newSeller)=>{
                    if(newSeller){
                        //商家注册成功
                        console.log(query);
                        console.log('注册成功');
                        res.json(Data);
                    }
                    else {
                        console.log('保存失败');
                        Data.code = 4;
                        Data.message = '注册失败，数据库错误';
                        res.json(Data);
                    }
                })
            }
        })
    }


})

//商家登录
router.post('/login',(req,res,next)=>{
    let query = req.body;
    let Data = {
        code:0,
        message:'登录成功'
    }
    //商家注册
    if(query.sellername==''|| query.password==''){
        console.log('店铺名称、密码不能留空');
        Data.code = 1;
        Data.message = '店铺名称、密码不能留空';
        res.json(Data);

    }

    else {
        Seller.findOne({
            sellername:query.sellername
        }).then((sellerInfo)=>{
            if(sellerInfo){
                if(sellerInfo.password==query.password){
                    req.cookies.set('SELLERID', sellerInfo._id);
                    console.log(query);
                    console.log(Data.message);
                    res.json(Data);
                }
                else {
                    console.log('密码错误');
                    Data.code = 2;
                    Data.message = '密码错误';
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
    req.cookies.set('SELLERID', null);
    res.json({
        message: '退出成功',
        code: 0
    })
    console.log('退出成功')
})



// 添加商品
router.post('/addgoods',(req,res,next)=>{
    let query = req.body;
    console.log('响应添加成功')
    let Data = {
        code:0,
        message:'添加成功'
    }
    if(query.name!=''||query.descri!=''){
        // alert('商品名称、价格不能为空！')
        let adds = new Adds({
            color_cre: query.color_cre,
            descri:query.descri,
            name:query.name,
            pic:query.pic,
            meter_cre: query.meter_cre,
            seller: req.sellerInfo._id
        });
        adds.save().then((newAdds)=>{
            if(newAdds){
                //商家注册成功
                console.log(query);
                console.log('添加成功');
                res.json(Data);
            }
            else {
                console.log('添加失败');
                Data.code = 4;
                Data.message = '添加失败，数据库错误';
                res.json(Data);
            }
        })
    }

    else {
        Data.code = 5;
        Data.message = '请填写商品名称';
        res.json(Data);
        
    }

})

// 修改商品
router.post('/modifygoods',(req,res,next)=>{
    console.log('响应修改ye2');
    let query = req.body;
    //查询商品，执行更新
    console.log(query);

    console.log(query.goodsid);
    Adds.findByIdAndUpdate(query.goodsid,{
        color_cre:query.color_cre,
        descri:query.descri,
        name:query.name,
        pic:query.pic,
        meter_cre:query.meter_cre
    }).then(result=>{
        // console.log(query);
        res.json({
            code:0,
            message:'更新成功'
        });
    })
})

//删除商品
router.get('/deletegoods', (req, res, next)=>{
    //删除商品
    // 获得商品id
    let goodsid = url.parse(req.url, true).query.goodsid;
    Adds.findByIdAndRemove(goodsid).then(result=>{
        //响应浏览器
        res.json({
            code: 0,
            message: '删除成功'
        })
    })

})

//接收浏览器传输过来的商家图片
router.post('/upload-logo',(req,res,next)=>{
    //接收浏览器传输过来的图片
    //1.创建接收表单数据的对象
    let form = new multiparty.Form();

    //2.设置文件缓存路径//保存图片
    form.uploadDir = './images/logo';

    //3.解析request中表单数据
    form.parse(req,(error,fields,files)=>{
        console.log(error);
        console.log(fields);
        console.log(files);
        if(!error){
            res.json({
                code:0, 
                message:'上传成功',
                data:{
                    // 将保存好的图片路径返回给浏览器
                    url: '/'+files.test[0].path
                }
            })
        }
        else{
            res.json({
                code:1,
                message:'上传失败'
            })
        }

    })



})


//接收浏览器传输过来的商品图片
router.post('/upload-pic',(req,res,next)=>{
    //接收浏览器传输过来的图片
    //1.创建接收表单数据的对象
    let form = new multiparty.Form();

    //2.设置文件缓存路径//保存图片
    form.uploadDir = './images/pic';

    //3.解析request中表单数据
    form.parse(req,(error,fields,files)=>{
        if(!error){
            res.json({
                code:0, 
                message:'上传成功',
                data:{
                    // 将保存好的图片路径返回给浏览器
                    url: '/'+files.test[0].path
                }
            })
        }
        else{
            res.json({
                code:1,
                message:'上传失败'
            })
        }

    })



})





module.exports = router;
