'use strict';

const {Event} = require('../models');


const events = [
  {
    groupId:1,
    venueId:1,
    name:'Around the grounds',
    type:'In person',
    capacity:20,
    price:14.99,
    description:'A fun day at the springs. Price is for food and gas.',
    startDate:171999999048000,
    endDate:191999999048000,
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
    await Event.bulkCreate(events, {validate:true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let names = [];
    for(let group of events){
      names.push(group.name);
    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Events', {
      name:{[Op.in]:names}
    });
  }
};
