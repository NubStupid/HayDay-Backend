'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Crops extends Model {
    static associate(models) {}
  }
  Crops.init(
    {
      crop_id:{
        type:DataTypes.STRING(20),
        primaryKey:true
      },
      crop_name:{
        type:DataTypes.STRING(255),
        allowNull:false
      },
      crop_species:{
        type:DataTypes.STRING(255),
        allowNull:true
      },
      harvest_result:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      harvest_time:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      image:{
        type:DataTypes.STRING(255),
        allowNull:true
      }
    },
    {
      sequelize,
      modelName: 'Crops',
      tableName:"crops",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return Crops;
};
