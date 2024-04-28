'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barns extends Model {
    static associate(models) {}
  }
  Barns.init(
    {
      barn_id:{
        type: DataTypes.STRING(20),
        primaryKey:true,
      },
      user_id:{
        type: DataTypes.STRING(20),
        allowNull:false,
      },
      post_code:{
        type: DataTypes.STRING(6),
        allowNull:false,
      },
      storage_caps:{
        type: DataTypes.INTEGER,
        allowNull:false,
      },
    },
    {
      sequelize,
      modelName: 'Barns',
      tableName:"barns",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return Barns;
};
