"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class DistributorItem extends Model {
        static associate(models) {}
    }
    DistributorItem.init(
        {
            item_id: {
                type: DataTypes.STRING(6),
                primaryKey: true,
            },
            user_id:{
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            item_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            qty: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "DistributorItem",
            tableName: "distributor_item",
            paranoid: true,
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt",
        }
    );
    return DistributorItem;
};
