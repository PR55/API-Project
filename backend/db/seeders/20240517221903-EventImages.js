'use strict';

const {EventImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const images = [
  {
    eventId:1,
    url:'https://fastly.picsum.photos/id/560/200/300.jpg?hmac=Qw6Gj4Q7nEunQocIfP9eSZ12CmRwQjYRMHvKIsnf08Y',
    isPreview:true
  },
  {
    eventId:2,
    url:'https://fastly.picsum.photos/id/486/200/300.jpg?hmac=yDvKMocLz1Sxg1XI9BgCJRlIyKqiBTdI9RZDij_z8xM',
    isPreview:true
  },
  {
    eventId:3,
    url:'https://fastly.picsum.photos/id/613/200/300.jpg?hmac=0SxLnCBuV8ozZLRM2aLsgqfaFXvvICJP-8ELG_wt0gE',
    isPreview:true
  },
  {
    eventId:4,
    url:'https://fastly.picsum.photos/id/628/200/300.jpg?hmac=q1gczEwKPuYV4RUOJycv37OCQoY0NUsJoI4qLvGBCGU',
    isPreview:true
  },
  {
    eventId:5,
    url:'https://fastly.picsum.photos/id/670/200/300.jpg?hmac=Ib58hZuwIQfcFZjEvKKi0p-j4GN1BGIkE7wLsa95Xk4',
    isPreview:true
  },
  {
    eventId:6,
    url:'https://fastly.picsum.photos/id/719/200/300.jpg?hmac=ROd_JjwPBNsmDhuN2yXu9bdtg0T4Nyl1iYA0WDXYpxM',
    isPreview:true
  },
  {
    eventId:7,
    url:'https://fastly.picsum.photos/id/386/200/300.jpg?hmac=gk-J08Ib-URM0-Sv_pgzVkWrFR5_B7R3dvHWKfy93FU',
    isPreview:true
  },
  {
    eventId:8,
    url:'https://fastly.picsum.photos/id/951/200/300.jpg?hmac=88jOMC9sFPf_Y7l4aMvDLBsqNuoprR9_Rvvbqb0oRPA',
    isPreview:true
  },
  {
    eventId:9,
    url:'https://fastly.picsum.photos/id/651/200/300.jpg?hmac=0w4DoCrs0gvMucmilCFXoqZAB9P3n94dVJ70mY8A4yQ',
    isPreview:true
  },
  {
    eventId:10,
    url:'https://fastly.picsum.photos/id/954/200/300.jpg?hmac=S-BQE-Zth1hOGOVewt5Jy5gk_r5fwSHC6iNU4oX3B9k',
    isPreview:true
  },
  {
    eventId:11,
    url:'https://fastly.picsum.photos/id/588/200/300.jpg?hmac=Bb5mvfvSw-sKhocAA4Mfdb78ysl5ktbClTt-Lc0IyWk',
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
