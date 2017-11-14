/**
 * Created by Administrator on 2017/11/6 0006.
 */

const express = require('express');
const Seller = require('../../models/seller');
const Add = require('../../models/adds');
const User = require('../../models/user');

const Order = require('../../models/order');

const url = require('url');

const router = express.Router();

//响应商家注册请求
router.get('/register',(req,res,next)=>{
    console.log('请求卖家注册页面');
    res.render('seller/register');
})
router.get('/login',(req,res,next)=>{
    console.log('请求卖家登录页面');
    res.render('seller/login');
})

router.use((req, res, next)=>{
    // 判断是否有商家id，如果没有让浏览器重定向到登录页面
    let sellerid = req.cookies.get('SELLERID');
    if(sellerid){
        next();
    }else{
        res.redirect('/admin/login');
    }
})

//商家首页
router.get('/', (req, res, next)=>{
    res.render('seller/home', {
        homeActive: 'active',
        logo: req.sellerInfo.logo,
        name: req.sellerInfo.sellername
    });
})

//商家商品列表
router.get('/goodslist', (req, res, next)=>{
    //查询这个商家一共有多少商品
     Add.where({
        seller:req.sellerInfo._id
    }).count().then(sum=>{
         // 对url参数进行解析，得到需要哪些数据
        let query = url.parse(req.url, true).query;
        // let page = query.page?query.page:1;
        let page = Number(query.page)||1;
        let count = Number(query.count)||5;
        //sum:这个商家的商品总数
        // page：第几页数据
        // count: 这一页需要多少条数据

        let skip = (page-1)*count;
       
        Add.find({
            seller:req.sellerInfo._id
        }).skip(skip).limit(count).then(result=>{
            let urls = [];
            //总页数=数据库总个数/一个页面的个数
            let pages = Math.ceil(sum / count);
            for(let i = 1; i <= pages; i++){
                let obj = {};
                obj.url = '/admin/goodslist?page='+i+'&count='+count;
                obj.index = i;
                obj.class = page == i?'active':'';
                urls.push(obj);

            }
            // console.log(result);
            res.render('seller/goodslist',{
                goodsActive: 'active',
                goodslist:result,
                isShow:sum>0,
                preClass:page>1?'':'disabled',
                nextClass:page*count>sum?'disabled':'',
                preUrl:page>1?'/admin/goodslist?page='+(page-1)+'&count='+count:'',
                nextUrl:page*count>sum?'':'/admin/goodslist?page='+(page+1)+'&count='+count,
                urls:urls,
                page:page,
                // pic: req.sellerInfo.pic
            })
        })

    })
   
})

//商家订单列表
// router.get('/orderlist', (req, res, next)=>{
//     res.render('seller/orderlist', {
//         orderActive: 'active'
//     });
// })

router.get('/orderlist', (req, res, next)=>{
    console.log('响应了orderlist')
    //查询这个商家一共有多少商品
    Order.where({seller:req.sellerInfo._id}).count().then(sum=>{
        console.log(sum);
         // 对url参数进行解析，得到需要哪些数据
        let query = url.parse(req.url, true).query;
        // let page = query.page?query.page:1;
        let page = Number(query.page)||1;
        let count = Number(query.count)||5;
        //sum:这个商家的商品总数
        // page：第几页数据
        // count: 这一页需要多少条数据

        let skip = (page-1)*count;

        Order.find({seller:req.sellerInfo._id}).populate(['user']).skip(skip).limit(count).then(result=>{
            let urls = [];
            //总页数=数据库总个数/一个页面的个数
            let pages = Math.ceil(sum / count);
            for(let i = 1; i <= pages; i++){
                let obj = {};
                obj.url = '/admin/orderlist?page='+i+'&count='+count;
                obj.index = i;
                obj.class = page == i?'active':'';
                urls.push(obj);

            }
            // console.log(result);
            res.render('seller/orderlist',{
                orderActive: 'active',
                goodslist:result,
                isShow:sum>0,
                preClass:page>1?'':'disabled',
                nextClass:page*count>sum?'disabled':'',
                preUrl:page>1?'/admin/orderlist?page='+(page-1)+'&count='+count:'',
                nextUrl:page*count>sum?'':'/admin/orderlist?page='+(page+1)+'&count='+count,
                urls:urls,
                page:page,
                // pic: req.sellerInfo.pic
            })
        })

    })


    // res.render('seller/orderlist', {
    //     orderActive: 'active'
    // });
})

//添加商品
router.get('/addgoods', (req, res, next)=>{
    res.render('seller/addgoods');   
})

//修改商品
router.get('/modifygoods', (req, res, next)=>{
     console.log('响应修改ye1')
    let goodsid = url.parse(req.url,true).query.goodsid;
     //根据商品id查询商品原数据，然后渲染修改页面
    Add.findById(goodsid).then(result=>{
        console.log( result);
        if(result){
            res.render('seller/modifygoods',result);   
        }
        else{
            res.redirect('/admin/goodslist');
        }
    })
    
})


module.exports = router;
