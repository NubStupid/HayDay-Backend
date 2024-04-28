/**
 * Menggabungkan semua model
 * - Daftarkan model2nya kita
 * - Jangan lupa di "NEW" sambil ngirim connection dan datatypes
 */

const db = {};
const { DataTypes } = require("sequelize");
const conn = require("../databases/connectionHayDay");
const Barns = require("./Barns");
const BarnCrops = require("./BarnCrops");
const Crops = require("./Crops");
const Farms = require("./Farms");
const FarmShops = require("./FarmShops");
const FarmShopCrops = require("./FarmShopCrops");
const Tiles = require("./Tiles");

// Init Model

db.Barns = Barns(conn, DataTypes);
db.BarnCrops = BarnCrops(conn,DataTypes);
db.Crops = Crops(conn,DataTypes);
db.Farms = Farms(conn, DataTypes);
db.FarmShops = FarmShops(conn,DataTypes);
db.FarmShopCrops = FarmShopCrops(conn,DataTypes);
db.Tiles = Tiles(conn,DataTypes)

module.exports = db;
