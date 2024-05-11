'use strict';

const {Image} = require('../models');

const images = [
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:true,
    groupId:1
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Image.bulkCreate(images, {validate:true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let names = [];
    for(let group of images){
      names.push(group.imageUrl);
    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Images', {
      imageUrl:{[Op.in]:names}
    });
  }
};
