'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const {Member} = require('../models');

const members = [
  {
    groupId:1,
    memberId:2,
    status:'pending'
  },
  {
    groupId:1,
    memberId:3,
    status:'member'
  },
  {
    groupId:1,
    memberId:4,
    status:'co-host'
  },
  {
    groupId:1,
    memberId:5,
    status:'member'
  },
  {
    groupId:1,
    memberId:6,
    status:'pending'
  },
  {
    groupId:1,
    memberId:7,
    status:'member'
  }
  ,
  {
    groupId:2,
    memberId:1,
    status:'member'
  },
  {
    groupId:3,
    memberId:1,
    status:'co-host'
  },
  {
    groupId:4,
    memberId:1,
    status:'member'
  },
  {
    groupId:5,
    memberId:1,
    status:'pending'
  },
  {
    groupId:1,
    memberId:12,
    status:'member'
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
    await Member.bulkCreate(members, { ...options,validate: true });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for(let group of members){
      await queryInterface.bulkDelete('Members', {
        memberId:group.memberId,
        groupId:group.groupId
      }, options);
    }

  }
};
