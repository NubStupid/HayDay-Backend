"use strict";
const mongoose = require("mongoose");
const reqSellerSchema = mongoose.Schema({
    _id: String,
    seller_id: String,
    distributor_id: String,
    item_id: String,
    item_name: String,
    price: Number,
    quantity: Number,
    total_price: Number,
    status: String,
    comment: String
});

const reqSeller = mongoose.model("reqSeller", reqSellerSchema, "request_seller");

module.exports =  reqSeller ;