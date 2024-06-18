/**
 * Menggabungkan semua model
 * - Daftarkan model2nya kita
 * - Jangan lupa di "NEW" sambil ngirim connection dan datatypes
 */

const db = {};
const { DataTypes } = require("sequelize");
const conn = require("../databases/connectionHayDay");
const Barns = require("./Barns");
const City = require("./City");
const Crops = require("./Crops");
const Farms = require("./Farms");
const FarmCrops = require("./FarmCrops");
const Tiles = require("./Tiles");
const Users = require("./Users");
const FnB = require("./FnB");
const DistributorItem = require("./DistributorItem");
const SellerItem = require("./SellerItem");

// Mongoose
const RequestFarmerSchema= require("./RequestFarmerSchema");
const RequestSellerSchema= require("./RequestSellerSchema");

// Init Model
db.Barns = Barns(conn, DataTypes);
db.City = City(conn, DataTypes);
db.Crops = Crops(conn, DataTypes);
db.Farms = Farms(conn, DataTypes);
db.FarmCrops = FarmCrops(conn, DataTypes);
db.Tiles = Tiles(conn, DataTypes);
db.Users = Users(conn, DataTypes);
db.FnB = FnB(conn, DataTypes);
db.SellerItem = SellerItem(conn, DataTypes);
db.DistributorItem = DistributorItem(conn, DataTypes);

db.RequestFarmer = RequestFarmerSchema;
db.RequestSeller = RequestSellerSchema;

module.exports = db;