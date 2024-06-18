'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sellerItems = [];
    const distributorItems = [];

    for (let i = 1; i <= 50; i++) {
      sellerItems.push({
        item_id: `ITM${i.toString().padStart(3, '0')}`,
        item_name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 1000, max: 100000 }),
        qty: faker.number.int({ min: 1, max: 100 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      });

      distributorItems.push({
        item_id: `ITM${i.toString().padStart(4, '0')}`,
        user_id: `USER${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 15)}${i.toString().padStart(4, '0')}`,
        item_name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 1000, max: 100000 }),
        qty: faker.number.int({ min: 1, max: 100 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      });
    }

    await queryInterface.bulkInsert('seller_items', sellerItems, {});
    await queryInterface.bulkInsert('distributor_item', distributorItems, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('seller_items', null, {});
    await queryInterface.bulkDelete('distributor_item', null, {});
  }
};
