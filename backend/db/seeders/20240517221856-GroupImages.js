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
    url:'https://fastly.picsum.photos/id/768/200/300.jpg?hmac=lFX2oZVTUayugh_YZQ5q6uoXJFYaOJz3d2_GLaIW2aU',
    isPreview:true
  },
  {
    groupId:2,
    url:'https://fastly.picsum.photos/id/1024/200/300.jpg?hmac=Zf-5s5sbTMmFYhm-_rzZXktzs5i_ES8dVOzXPCS6zxU',
    isPreview:true
  },
  {
    groupId:3,
    url:'https://fastly.picsum.photos/id/459/200/300.jpg?hmac=4Cn5sZqOdpuzOwSTs65XA75xvN-quC4t9rfYYyoTCEI',
    isPreview:true
  },
  {
    groupId:4,
    url:'https://fastly.picsum.photos/id/409/200/300.jpg?hmac=DMEn4qNc0DsvxlQ4NSDPOesRyq8VhhGEi6IXy2DblLk',
    isPreview:true
  },
  {
    groupId:5,
    url:'https://fastly.picsum.photos/id/1005/200/300.jpg?hmac=ZygrmRTuNYz9HivXcWqFGXDRVJxIHzaS-8MA0I3NKBw',
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
