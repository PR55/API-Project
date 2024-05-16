'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const {Attendee} = require('../models')

const attendees =[
  {
    eventId:1,
    userId:3,
    status:'pending'
  },
  {
    eventId:1,
    userId:2,
    status:'attending'
  },
  {
    eventId:1,
    userId:4,
    status:'host'
  },
  {
    eventId:1,
    userId:5,
    status:'attending'
  },
  {
    eventId:1,
    userId:6,
    status:'attending'
  },
  {
    eventId:1,
    userId:7,
    status:'attending'
  },
  {
    eventId:1,
    userId:8,
    status:'pending'
  }
];

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
   await Attendee.bulkCreate(attendees, {validate:true}, options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for(let attendee of attendees){
      await queryInterface.bulkDelete('Attendees', {
        eventId:attendee.eventId,
        userId:attendee.userId
      }, options)
    }
  }
};
