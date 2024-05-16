'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const {Group} = require('../models');

const groups = [
  {
    organizerId:1,
    name:'a',
    about:'This is the 1st test group.   aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    type:'Online',
    private:false,
    city:'Cincinatti',
    state:'MA'
  },
  {
    organizerId:4,
    name:'ab',
    about:'This is the 2nd test group.   aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    type:'Online',
    private:true,
    city:'Cincinatti',
    state:'MA'
  },
  {
    organizerId:9,
    name:'abc',
    about:'This is the 3rd test group.   aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    type:'Online',
    private:false,
    city:'Cincinatti',
    state:'MA'
  },
  {
    organizerId:3,
    name:'abcd',
    about:'This is the 4th test group.   aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    type:'Online',
    private:true,
    city:'Cincinatti',
    state:'MA'
  },
  {
    organizerId:11,
    name:'abcde',
    about:'This is the 5th test group.   eaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    type:'Online',
    private:false,
    city:'Cincinatti',
    state:'MA'
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
   await Group.bulkCreate(groups, { ...options,validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let names = [];
    let orgaIds = [];
    for(let group of groups){
      names.push(group.name);
      orgaIds.push(group.organizerId);
    }
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Groups', {
      name:{[Op.in]:names},
      organizerId:{[Op.in]:orgaIds}
    }, options);
  }
};
