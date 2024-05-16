'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const {Image} = require('../models');

const images = [
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:true,
    groupId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:true,
    eventId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    groupId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    eventId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    groupId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    eventId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    groupId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    eventId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    groupId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    eventId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    groupId:1
  },
  {
    imageUrl:'https://unsplash.com/photos/person-in-red-sweater-holding-babys-hand-Zyx1bK9mqmA',
    isPreview:false,
    eventId:1
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
    await Image.bulkCreate(images, { ...options,validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let names = [];
    let groupIds = [];
    let eventIds = [];
    for(let group of images){
      names.push(group.imageUrl);
      if(group.groupId){groupIds.push(group.groupId);}
      else if(group.eventId){eventIds.push(group.eventId);}

    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Images', {
      imageUrl:{[Op.in]:names},
      groupId:{[Op.in]:groupIds}
    }, options);
    await queryInterface.bulkDelete('Images', {
      imageUrl:{[Op.in]:names},
      eventId:{[Op.in]:eventIds}
    }, options);
  }
};
