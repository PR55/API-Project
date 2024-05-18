'use strict';

/** @type {import('sequelize-cli').Migration} */

const {GroupImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const images = [
  {
    groupId:1,
    url:'img2000.url',
    isPreview:true
  },
  {
    groupId:2,
    url:'img2001.url',
    isPreview:true
  },
  {
    groupId:3,
    url:'img2002.url',
    isPreview:true
  },
  {
    groupId:4,
    url:'img2003.url',
    isPreview:true
  },
  {
    groupId:5,
    url:'img3004.url',
    isPreview:true
  }
]

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
    await GroupImage.bulkCreate(images, {...options, validate:true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let urls = [];
    let ids = [];

    for(let image of images){
      urls.push(image.url);
      ids.push(image.groupId);
    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('GroupImages',{
      groupId:{[Op.in]:ids},
      url:{[Op.in]:urls}
    },options);
  }
};
