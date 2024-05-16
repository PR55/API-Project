'use strict';

const {Venue} = require('../models');

const Venues = [
  {
    groupId:1,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:28.37065,
    lng:-81.51936
  },{
    groupId:1,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:26.37065,
    lng:-81.51936
  },{
    groupId:1,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:27.37065,
    lng:-81.51936
  },{
    groupId:1,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:29.37065,
    lng:-81.51936
  },
  {
    groupId:9,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:28.37065,
    lng:-81.51936
  },{
    groupId:8,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:26.37065,
    lng:-81.51936
  },{
    groupId:2,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:27.37065,
    lng:-81.51936
  },{
    groupId:2,
    address:'1486 Buena Vista Dr',
    city:'Lake Buena Vista',
    state:'FL',
    lat:29.37065,
    lng:-81.51936
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
    await Venue.bulkCreate(Venues, {validate:true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let address = [];
    let groupIds = [];
    for(let group of Venues){
      address.push(group.address);
      groupIds.push(group.groupId);
    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Venues', {
      address:{[Op.in]:address},
      groupId:{[Op.in]:groupIds}
    });
  }
};
