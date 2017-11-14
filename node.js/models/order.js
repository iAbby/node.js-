// 创建用户表结构
const mongoose = require('mongoose');

let orderSchemas = mongoose.Schema({
     //用户选择的款式
    name:String,
    selectSize:String,
    selectStyle: String,
    price:String,
    pic:String,
    number:Number,
    goods: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adds'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller'
    }
});

//创建用户模型
let orderModel = mongoose.model('order', orderSchemas);

//向外输出
module.exports = orderModel;