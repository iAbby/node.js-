const mongoose = require('mongoose');

let sellerSchemas = mongoose.Schema({

    sellername: String,
    description: String,
    password: String,
    logo:String

})
let SellerModel = mongoose.model('seller',sellerSchemas);

module.exports=SellerModel;