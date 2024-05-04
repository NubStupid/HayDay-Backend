'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Farms extends Model {
    static associate(models) {}
  }
  Farms.init(
    {
      farm_id:{
        type:DataTypes.STRING(20),
        primaryKey:true
      },
      user_id:{
        type:DataTypes.STRING(20),
        allowNull:false
      },
      farm_name:{
        type:DataTypes.STRING(255),
        allowNull:false
      },
      barn_id:{
        type:DataTypes.STRING(20),
        allowNull:true
      },
    },
    {
      sequelize,
      modelName: 'Farms',
      tableName:"farms",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return Farms;
};
