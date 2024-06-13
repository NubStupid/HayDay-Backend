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
const FarmCrops = require("./FarmCrops");
const Tiles = require("./Tiles");
const Users = require("./Users");
const FnB = require("./FnB");
const SellerItem = require("./SellerItem");

// Init Model
db.Barns = Barns(conn, DataTypes);
db.BarnCrops = BarnCrops(conn, DataTypes);
db.Crops = Crops(conn, DataTypes);
db.Farms = Farms(conn, DataTypes);
db.FarmCrops = FarmCrops(conn, DataTypes);
db.Tiles = Tiles(conn, DataTypes);
db.Users = Users(conn, DataTypes);
db.FnB = FnB(conn, DataTypes);
db.SellerItem = SellerItem(conn, DataTypes);

module.exports = db;
