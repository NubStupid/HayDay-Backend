"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("seller_items", {
            item_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                primaryKey: true
            },
            item_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            qty: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('seller_items');
    }
};
