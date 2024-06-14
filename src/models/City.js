"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class City extends Model {
        static associate(models) {}
    }
    City.init(
        {
            city_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            city_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "City",
            tableName: "city",
            timestamps: false,
        }
    );
    return City;
};
