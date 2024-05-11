'use strict';

const {Member} = require('../models');

const members = [
  {
    groupId:1,
    memberId:2,
    status:'pending'
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
    await Member.bulkCreate(members, {validate:true});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let names = [];
    for(let group of members){
      names.push(group.memberId);
    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Members', {
      memberId:{[Op.in]:names},
    });
  }
};
