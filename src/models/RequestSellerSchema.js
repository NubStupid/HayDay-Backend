"use strict";
const mongoose = require("mongoose");
const reqSellerSchema = mongoose.Schema({
    _id: String,
    seller: String,
    distributor: String,
    item_id: String,
    item_name: String,
    price: Number,
    qty: Number,
    total_price: Number,
    status: String,
    comment: String
});

const reqSeller = mongoose.model("reqSeller", reqSellerSchema, "request_seller");

module.exports =  reqSeller ;