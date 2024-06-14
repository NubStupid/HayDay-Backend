const { Op, where } = require("sequelize")
const { DistributorItem } = require("../models")
const { RequestFarmer } = require("../models")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")

// GET Semua Request Farmer
const getAllRequest = async (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

// GET Semua Notif Request
const getAllNotification = async (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

// GET Semua Item yang ada di gudang
const getListItem = async (req, res) => {
    const {user_id} = req.user;
    let cekItem = await RequestFarmer.find();
    return res.status(200).json( cekItem );
};

// POST Buat Request ke Farmer
const makeRequestFarmer = async (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

// POST Konfirmasi Request Farmer dan Bayar
const finishRequestFarmer = async (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

// POST Konfirmasi Request Farmer dan Bayar
const finishRequestSeller = async (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

// Put
const updateItem = async (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

module.exports = {
    getListItem
}