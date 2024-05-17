'use strict';

/** @type {import('sequelize-cli').Migration} */
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const users = [
  {
    firstName:'Demo',
    lastName:'Man',
    email: 'demo@user.io',
    username: 'Demo-lition',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    firstName:'John',
    lastName:'Divantri',
    email: 'user1@user.io',
    username: 'FakeUser1',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.io',
    username: 'FakeUser2',
    hashedPassword: bcrypt.hashSync('password3')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaa',
    username: 'FakeUser2aa',
    hashedPassword: bcrypt.hashSync('password3aa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaa',
    username: 'FakeUser2aaa',
    hashedPassword: bcrypt.hashSync('password3aaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaa',
    username: 'FakeUser2aaaa',
    hashedPassword: bcrypt.hashSync('password3aaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaa',
    username: 'FakeUser2aaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaaa',
    username: 'FakeUser2aaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaaaa',
    username: 'FakeUser2aaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaaaaa',
    username: 'FakeUser2aaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaa')
  },
  {
    firstName:'Jane',
    lastName:'Doe',
    email: 'user2@user.ioaaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaaa')
  },
  {
    firstName:'Janeaa',
    lastName:'Doeaaaa',
    email: 'user2@user.ioaaaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaaaa')
  },
  {
    firstName:'Janeaa',
    lastName:'Doeaaa',
    email: 'user2@user.ioaaaaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaaaaa')
  },
  {
    firstName:'Janea',
    lastName:'Doeaa',
    email: 'user2@user.ioaaaaaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaaaaaa')
  },
  {
    firstName:'Jne',
    lastName:'Dae',
    email: 'user2@user.ioaaaaaaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaaaaaaa')
  },
  {
    firstName:'Jae',
    lastName:'Dao',
    email: 'user2@user.ioaaaaaaaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaaaaaaaa')
  },
  {
    firstName:'Jan',
    lastName:'Doea',
    email: 'user2@user.ioaaaaaaaaaaaaaaaaaa',
    username: 'FakeUser2aaaaaaaaaaaaaaaaaa',
    hashedPassword: bcrypt.hashSync('password3aaaaaaaaaaaaaaaaaa')
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate(users, { ...options,validate: true });
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    let names = [];
    for(let user of users){
      names.push(user.email);
    }
    return queryInterface.bulkDelete('Users', {
      email: { [Op.in]: names}
    }, options);
  }
};
