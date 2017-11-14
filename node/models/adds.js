/**
 * Created by Administrator on 2017/11/6 0006.
 */


const mongoose = require('mongoose');

let addsSchemas = mongoose.Schema({
    color_cre:Array,
    // descri:String,
    descri:Number,
    name:String,
    meter_cre:Array,
    pic:String,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller'
    }

})
let AddsModel = mongoose.model('adds',addsSchemas);

module.exports=AddsModel;