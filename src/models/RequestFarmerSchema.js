"use strict";
const mongoose = require("mongoose");
const reqFarmerSchema = mongoose.Schema({
    _id: String,
    farmer_id: String,
    distributor_id: String,
    item_id: String,
    item_name: String,
    price: Number,
    qty: Number,
    total_price: Number,
    status: String,
    comment: String
});

const reqFarmer = mongoose.model("reqFarmer", reqFarmerSchema, "request_farmer");

module.exports = reqFarmer; 