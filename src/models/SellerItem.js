"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class SellerItem extends Model {
        static associate(models) {}
    }
    SellerItem.init(
        {
            item_id: {
                type: DataTypes.STRING(20),
                primaryKey: true,
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
            modelName: "SellerItem",
            tableName: "seller_items",
            paranoid: true,
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt",
        }
    );
    return SellerItem;
};
