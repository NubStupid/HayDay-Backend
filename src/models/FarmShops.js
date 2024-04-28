'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FarmShops extends Model {
    static associate(models) {}
  }
  FarmShops.init(
    {
      farm_shop_id:{
        type:DataTypes.STRING(20),
        primaryKey:true
      },
      farm_shop_name:{
        type:DataTypes.STRING(255),
        allowNull:false
      },
      farm_id:{
        type:DataTypes.STRING(20),
        allowNull:false
      },
      user_id:{
        type:DataTypes.STRING(20),
        allowNull:false
      },
    },
    {
      sequelize,
      modelName: 'FarmShops',
      tableName:"farm_shops",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return FarmShops;
};
