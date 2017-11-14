/**
 * Created by Administrator on 2017/11/4 0004.
 */
const mongoose = require('mongoose');

let userSchemas = mongoose.Schema({
    username:String,
    password:String
})
let UserModel = mongoose.model('user',userSchemas);

module.exports=UserModel;