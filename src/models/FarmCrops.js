'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FarmCrops extends Model {
    static associate(models) {}
  }
  FarmCrops.init(
    {
      farm_crop_id:{
        type:DataTypes.STRING(20),
        primaryKey:true
      },
      farm_id:{
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
    },
    {
      sequelize,
      modelName: 'FarmCrops',
      tableName:"farm_crops",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return FarmCrops;
};
