'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User.belongsToMany(models.Group,{
      //   through:models.Member,
      //   foreignKey:'memberId',
      //   otherKey:'groupId',
      //   onDelete:'CASCADE',
      //   hooks:true
      // });
      // User.belongsToMany(models.Event,{
      //   through:'Attendees',
      //   foreignKey:'userId',
      //   otherKey:'eventId',
      //   onDelete:'CASCADE',
      //   hooks:true
      // });
      // User.hasMany(models.Group,{
      //   foreignKey:'organizerId',
      //   hooks:true
      // });
    }
  };

  User.init(
    {
      firstName:{
        type: DataTypes.TEXT,
        allowNull:false,
        validate:{
          len:[3,50],
          notEmpty:{
            args:true,
            msg:"First Name is required"
          }
        }
      },
      lastName:{
        type: DataTypes.TEXT,
        allowNull:false,
        validate:{
          len:[3,50],
          notEmpty:{
            args:true,
            msg:"Last Name is required"
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail:{
            args:true,
            msg:"Invalid Email"
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
