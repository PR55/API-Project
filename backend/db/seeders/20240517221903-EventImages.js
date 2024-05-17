'use strict';

const {EventImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const images = [
  {
    eventId:1,
    url:'img3000.url',
    isPreview:true
  },
  {
    eventId:2,
    url:'img3001.url',
    isPreview:true
  },
  {
    eventId:3,
    url:'img3002.url',
    isPreview:true
  },
  {
    eventId:4,
    url:'img3003.url',
    isPreview:true
  },
  {
    eventId:5,
    url:'img3004.url',
    isPreview:true
  },
  {
    eventId:6,
    url:'img3005.url',
    isPreview:true
  },
  {
    eventId:7,
    url:'img3006.url',
    isPreview:true
  },
  {
    eventId:8,
    url:'img3007.url',
    isPreview:true
  },
  {
    eventId:9,
    url:'img3008.url',
    isPreview:true
  },
  {
    eventId:10,
    url:'img3009.url',
    isPreview:true
  },
  {
    eventId:11,
    url:'img3010.url',
    isPreview:true
  }
];
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
   await EventImage.bulkCreate(images, {...options, validate:true});
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
      ids.push(image.eventId);
    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('EventImages',{
      eventId:{[Op.in]:ids},
      url:{[Op.in]:urls}
    },options);

  }
};
