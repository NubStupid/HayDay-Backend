"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class FnB extends Model {
        static associate(models) {}
    }
    FnB.init(
        {
            fnb_id: {
                type: DataTypes.STRING(6),
                primaryKey: true,
            },
            fnb_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rating: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            sold: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "FnB",
            tableName: "fnb",
            paranoid: true,
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt",
        }
    );
    return FnB;
};
