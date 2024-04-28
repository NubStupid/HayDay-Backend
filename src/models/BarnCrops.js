'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BarnCrops extends Model {
    static associate(models) {}
  }
  BarnCrops.init(
    {
      barn_crop_id:{
        type:DataTypes.STRING(20),
        primaryKey:true
      },
      barn_id:{
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
      modelName: 'BarnCrops',
      tableName:"barn_crops",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return BarnCrops;
};
