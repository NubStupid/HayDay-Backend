'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FarmShopCrops extends Model {
    static associate(models) {}
  }
  FarmShopCrops.init(
    {
      farm_shop_crop_id:{
        type:DataTypes.STRING(20),
        primaryKey:true
      },
      farm_shop_id:{
        type:DataTypes.STRING(20),
        allowNull:false
      },
      crop_id:{
        type:DataTypes.STRING(20),
        allowNull:false
      },
      qty:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      qty:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
    },
    {
      sequelize,
      modelName: 'FarmShopCrops',
      tableName:"farm_shop_crops",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return FarmShopCrops;
};
