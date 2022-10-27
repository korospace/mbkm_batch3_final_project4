'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      PhotoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
      .then(() => queryInterface.addConstraint('Comments', {
        fields: ['PhotoId'],
        type: 'FOREIGN KEY',
        name: 'photo_fk',
        references: {
          table: 'Photos',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }))
      .then(() => queryInterface.addConstraint('Comments', {
        fields:  ['UserId'],
        type: 'FOREIGN KEY',
        name: 'user_fk',
        references: {
          table: 'Users',
          field: 'id',
        },
        onDelete: 'no action',
        onUpdate: 'cascade',
      }));
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};