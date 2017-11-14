/**
 * Created by Administrator on 2017/11/4 0004.
 */

const express = require('express');
const User = require('../../models/user');
const Add = require('../../models/adds');
const Seller = require('../../models/seller');

const Order = require('../../models/order');

const url = require('url');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('buyer/home', {
        homeActive: 'active',
        username: req.userInfo.username
    });
})
// router.get('/product',(req,res,next)=>{
//     res.render('buyer/product', {
//         homeActive: 'active',
//         username: req.userInfo.username
//     });
// })
//响应商品页面
router.get('/product',(req,res,next)=>{

    Add.find().populate(['seller']).count().then(sum=>{
        let sort = Number(url.parse(req.url,true).query.sort);
        let query = url.parse(req.url,true).query;
        let page = Number(query.page) ||1;
        let count = Number(query.count)||12;
        //sum:这个商家的商品总数
        // page：第几页数据
        // count: 这一页需要多少条数据
        let skip = (page-1)*count;
        // Add.where({ seller: req.sellerInfo.id}).find() 
        if(sort){
            Add.find().sort({descri: sort}).populate(['seller']).skip(skip).limit(count).then(result=>{
                
                let urls = [];
                //总页数=数据库总个数/一个页面的个数
                let pages = Math.ceil(sum/count);
                for(let i =1; i<=pages;i++){
                    let obj ={};
                    obj.url = '/product?sort='+sort+'&page='+i+'&count='+count;
                    obj.index = i;
                    obj.class = page==i?'active':'';
                    urls.push(obj);
                }
                // console.log(urls);
                res.render('buyer/product', {
                    allgoods: result,
                    isShow: sum>0,
                    preClass: page>1?'':'disabled',
                    nextClass: page*count>=sum?'disabled':'',
                    preUrl: page>1?'/product?page='+(page-1)+'&count='+count:'',
                    nextUrl: page*count>=sum? '': '/product?page='+(page+1)+'&count='+count,
                    urls: urls,
                    page: page,
                    productActive: 'active',
                    username: req.userInfo.username

                });
            })
        }
        else{
            Add.find().populate(['seller']).skip(skip).limit(count).then(result=>{
                let urls = [];
                //总页数=数据库总个数/一个页面的个数
                let pages = Math.ceil(sum/count);
                for(let i =1; i<=pages;i++){
                    let obj ={};
                    obj.url = '/product?page='+i+'&count='+count;
                    obj.index = i;
                    obj.class = page==i?'active':'';
                    urls.push(obj);
                }
                // console.log(urls);
                res.render('buyer/product', {
                    allgoods: result,
                    isShow: sum>0,
                    preClass: page>1?'':'disabled',
                    nextClass: page*count>=sum?'disabled':'',
                    preUrl: page>1?'/product?page='+(page-1)+'&count='+count:'',
                    nextUrl: page*count>=sum? '': '/product?page='+(page+1)+'&count='+count,
                    urls: urls,
                    page: page,
                    productActive: 'active',
                    username: req.userInfo.username

                });
            })
        }
        
    })  
})




router.get('/user',(req,res,next)=>{
    console.log('响应个人中心')
    let userid=req.userInfo._id;
    console.log(req.userInfo);
    if(req.userInfo!=''){
    Order.where({buyer:userid}).find().populate(['seller']).count().then(sum=>{
        let query = url.parse(req.url,true).query;
        let page = Number(query.page) ||1;
        let count = Number(query.count)||12;
        // //sum:这个商家的商品总数
        // // page：第几页数据
        // // count: 这一页需要多少条数据
        let skip = (page-1)*count;
        let orderid =  req.cookies.get('ORDER');
        Order.where({buyer:userid}).find(orderid).populate(['seller']).skip(skip).limit(count).then(result=>{
            let urls = [];
            
        //     // //总页数=数据库总个数/一个页面的个数
            let pages = Math.ceil(sum/count);
            for(let i =1; i<=pages;i++){
                let obj ={};
                obj.url = '/user?&page='+i+'&count='+count;
                obj.index = i;
                obj.class = page==i?'active':'';
                urls.push(obj);
            }

            if(orderid){
                // console.log(req.userInfo._id);
                res.render('buyer/user', {
                    allgoods: result,
                    // isShow: result.length>0,
                    preClass: page>1?'':'disabled',
                    nextClass: page*count>=result.length?'disabled':'',
                    preUrl: page>1?'/user?id='+userid+'&page='+(page-1)+'&count='+count:'',
                    nextUrl: page*count>=result.length? '': '/user?id='+userid+'&page='+(page+1)+'&count='+count,
                    urls: urls,
                    page: page,
                    username: req.userInfo.username,
                    // userid:req.userInfo._id

                });
            }
            
        })
    });}
    else{(res.render('buyer/notfind'))}
})









// 搜索商品结果展示
router.get('/search',(req,res,next)=>{
    let keyword = url.parse(req.url,true).query.keyword;
    //根据输入的关键字查询商品数据库表格
    let reg = new RegExp(keyword);
    if(keyword!=''){
        Add.where({name:reg}).find().then(sum=>{
            let sort = Number(url.parse(req.url,true).query.sort);
            let query = url.parse(req.url,true).query;
            let page = Number(query.page) ||1;
            let count = Number(query.count)||12;
            //result.length:这个商家的商品总数
            // page：第几页数据
            // count: 这一页需要多少条数据
            let skip = (page-1)*count;
            if(sort){
                Add.where({name:reg}).find().sort({descri: sort}).populate(['seller']).skip(skip).limit(count).then(result=>{
                    let urls = [];
                    //总页数=数据库总个数/一个页面的个数
                    let pages = Math.ceil(result.length/count);
                    for(let i =1; i<=pages;i++){
                        let obj ={};
                        obj.url = '/search?keyword='+keyword+'&sort='+sort+'&page='+i+'&count='+count;
                        obj.index = i;
                        obj.class = page==i?'active':'';
                        urls.push(obj);
                    }
                    console.log(result.length);
                    res.render('buyer/search', {
                        allgoods: result,
                        isShow: result.length>0,
                        preClass: page>1?'':'disabled',
                        nextClass: page*count>=result.length?'disabled':'',
                        preUrl: page>1?'/search?keyword='+keyword+'&sort='+sort+'&page='+(page-1)+'&count='+count:'',
                        nextUrl: page*count>=result.length? '': '/search?keyword='+keyword+'&sort='+sort+'&page='+(page+1)+'&count='+count,
                        urls: urls,
                        page: page,
                        searchActive: 'active',
                        // username: req.userInfo.username,

                    });
                })
            }

            else{
                Add.where({
                    name:reg
                }).find().populate(['seller']).skip(skip).limit(count).then(result=>{
                    let urls = [];
                    //总页数=数据库总个数/一个页面的个数
                    let pages = Math.ceil(result.length/count);
                    for(let i =1; i<=pages;i++){
                        let obj ={};
                        obj.url = '/search?keyword='+keyword+'&page='+i+'&count='+count;
                        obj.index = i;
                        obj.class = page==i?'active':'';
                        urls.push(obj);
                    }
                    res.render('buyer/search', {
                        allgoods: result,
                        keyword:keyword,
                        isShow: result.length>0,
                        preClass: page>1?'':'disabled',
                        nextClass: page*count>=result.length?'disabled':'',
                        preUrl: page>1?'/search?keyword='+keyword+'&page='+(page-1)+'&count='+count:'',
                        nextUrl: page*count>=result.length? '': '/search?keyword='+keyword+'&page='+(page+1)+'&count='+count,
                        urls: urls,
                        page: page,
                        searchActive: 'active',
                        // username: req.userInfo.username,

                    });
                })
            }
        
        })
    }
    else{
        res.render('buyer/notfind');
    }
      

})


// 商品详情页面
router.get('/details',(req,res,next)=>{
     // 获得商品id
    let goodsid = url.parse(req.url,true).query.id;
     // 查询数据库，得到商品信息
    let goodid = req.cookies.set('GOODS', goodsid);
    Add.findById(goodsid).populate(['seller']).then(goodsInfo=>{
    // Add.find().populate(['seller']).then(goodsInfo=>{
        
    // 渲染商品详情页页面
        if(goodsInfo){
            res.render('buyer/details',{
                productActive: 'active',
                title:goodsInfo.name,
                descri:goodsInfo.descri,
                color_cre:goodsInfo.color_cre,
                meter_cre:goodsInfo.meter_cre,
                pic:goodsInfo.pic,
                username: req.userInfo.username,
                seller:goodsInfo.seller.sellername
            })
        }
        else{
            res.redirect('/notfind');
        }
    },(error)=>{
        console.log(error);
        res.redirect('/notfind');
    })
  
    

})



//出错页面
router.get('/notfind', (req, res, next)=>{
    res.render('buyer/notfind',{
        username: req.userInfo.username

    });
})

router.get('/store',(req,res,next)=>{
    console.log('响应所有店铺');
    Seller.find().count().then(sum=>{
        let sort = Number(url.parse(req.url,true).query.sort);
        let query = url.parse(req.url,true).query;
        let page = Number(query.page) ||1;
        let count = Number(query.count)||4;
        //sum:这个商家的商品总数
        // page：第几页数据
        // count: 这一页需要多少条数据
        let skip = (page-1)*count;
        // Add.where({ seller: req.sellerInfo.id}).find() 

        Seller.find().skip(skip).limit(count).then(result=>{
            let urls = [];
            //总页数=数据库总个数/一个页面的个数
            let pages = Math.ceil(sum/count);
            for(let i =1; i<=pages;i++){
                let obj ={};
                obj.url = '/store?page='+i+'&count='+count;
                obj.index = i;
                obj.class = page==i?'active':'';
                urls.push(obj);
            }
            // console.log(urls);
            res.render('buyer/store', {
                allgoods: result,
                isShow: sum>0,
                preClass: page>1?'':'disabled',
                nextClass: page*count>=sum?'disabled':'',
                preUrl: page>1?'/store?page='+(page-1)+'&count='+count:'',
                nextUrl: page*count>=sum? '': '/store?page='+(page+1)+'&count='+count,
                urls: urls,
                page: page,
                aboutActive: 'active',
                username: req.userInfo.username

            });
        })
       
    })  
})




// 商品详情页面
// router.get('/about',(req,res,next)=>{
//     console.log('响应了卖家商品')
//      // 获得商品id
//     let aboutid = url.parse(req.url,true).query.id;
//      // 查询数据库，得到商品信息
//     let about = req.cookies.set('ABOUT', aboutid);
//     // Seller.findById(aboutid).populate(['adds']).then(aboutInfo=>{
   


//         Add.find().populate(['seller']).then(aboutInfo=>{
//             console.log(aboutInfo);
//         // 渲染商品详情页页面
//             if(aboutInfo){
//                 res.render('buyer/about',{
//                     // productActive: 'active',
//                     username: req.userInfo.username,
//                     // seller:goodsInfo.seller.sellername,
//                     allgoods:aboutInfo,
//                 })
//             }
//         //     else{
//         //         res.redirect('/notfind');
//         //     }
//         // },(error)=>{
//         //     console.log(error);
//         //     res.redirect('/notfind');
//         })
  
    

// })



router.get('/about',(req,res,next)=>{
    console.log('响应了卖家商品')
     // 获得商品id
    let aboutid = url.parse(req.url,true).query.id;
     // 查询数据库，得到商品信息
    let about = req.cookies.set('ABOUT', aboutid);

    
    Add.where({seller:aboutid}).find().populate(['seller']).count().then(sum=>{
        let sort = Number(url.parse(req.url,true).query.sort);
        let query = url.parse(req.url,true).query;
        let page = Number(query.page) ||1;
        let count = Number(query.count)||12;
        let skip = (page-1)*count;
        if(sort){
            Add.where({seller:aboutid}).find().sort({descri: sort}).populate(['seller']).skip(skip).limit(count).then(aboutInfo=>{
                    
                let urls = [];
                //总页数=数据库总个数/一个页面的个数
                let pages = Math.ceil(sum/count);
                for(let i =1; i<=pages;i++){
                    let obj ={};
                    obj.url = '/about?id='+aboutid+'&sort='+sort+'&page='+i+'&count='+count;
                    obj.index = i;
                    obj.class = page==i?'active':'';
                    urls.push(obj);
                }
                res.render('buyer/about', {
                    allgoods: aboutInfo,
                    preClass: page>1?'':'disabled',
                    nextClass: page*count>=sum?'disabled':'',
                    preUrl: page>1?'/about?id='+aboutid+'&page='+(page-1)+'&count='+count:'',
                    nextUrl: page*count>=sum? '': '/about?id='+aboutid+'&page='+(page+1)+'&count='+count,
                    urls: urls,
                    page: page,
                    id:aboutid,
                    productActive: 'active',
                    username: req.userInfo.username

                });
            })
            
        }  

        else{
            Add.where({seller:aboutid}).find().populate(['seller']).skip(skip).limit(count).then(aboutInfo=>{
                let urls = [];
                //总页数=数据库总个数/一个页面的个数
                let pages = Math.ceil(sum/count);
                for(let i =1; i<=pages;i++){
                    let obj ={};
                    obj.url = '/about?id='+aboutid+'&page='+i+'&count='+count;
                    obj.index = i;
                    obj.class = page==i?'active':'';
                    urls.push(obj);
                }
                res.render('buyer/about', {
                    allgoods: aboutInfo,
                    preClass: page>1?'':'disabled',
                    nextClass: page*count>=sum?'disabled':'',
                    preUrl: page>1?'/about?id='+aboutid+'&page='+(page-1)+'&count='+count:'',
                    nextUrl: page*count>=sum? '': '/about?id='+aboutid+'&page='+(page+1)+'&count='+count,
                    urls: urls,
                    page: page,
                    id:aboutid,
                    productActive: 'active',
                    username: req.userInfo.username

                });
            });
        } 
    })
        

})












//用户注册
router.get('/register',(req,res,next)=>{
    res.render('buyer/register', {
        regActive: 'active'
    });
})
//用户登录
router.get('/login',(req,res,next)=>{
    res.render('buyer/login', {
        loginActive: 'active'
    });
})

module.exports = router;