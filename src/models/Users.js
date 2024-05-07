"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {}
    }
    Users.init(
        {
            user_id: {
                type: DataTypes.STRING(20),
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            phone_number: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            balance: {
                type: DataTypes.INTEGER,
            },
            role: {
                type: DataTypes.STRING(20),
            },
            access_token: {
                type: DataTypes.STRING(255),
            },
            refresh_token: {
                type: DataTypes.STRING(255),
            },
        },
        {
            sequelize,
            modelName: "Users",
            tableName: "users",
            paranoid: true,
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt",
        }
    );
    return Users;
};