'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tiles extends Model {
    static associate(models) {}
  }
  Tiles.init(
    {
      tile_id:{
        type:DataTypes.STRING(20),
        primaryKey:true
      },
    farm_id:{
        type:DataTypes.STRING(20),
        allowNull:false,
    },
    user_id:{
        type:DataTypes.STRING(20),
        allowNull:false,
    },
    crop_id:{
        type:DataTypes.STRING(20),
        allowNull:false,
    },
    permission:{
        type:DataTypes.STRING(255),
        allowNull:false,
    },
    due_date:{
        type:DataTypes.DATE(),
        allowNull:false
    }
    },
    {
      sequelize,
      modelName: 'Tiles',
      tableName:"tiles",
      paranoid:true,
      timestamps:true,
      createdAt:"createdAt",
      updatedAt:"updatedAt",
      deletedAt:"deletedAt"
    }
  );
  return Tiles;
};
