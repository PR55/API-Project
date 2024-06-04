'use strict';
const {
  Model
} = require('sequelize');
const group = require('./group');
module.exports = (sequelize, DataTypes) => {
  class Attendee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendee.belongsTo(models.User,{
        foreignKey:'userId',
        hooks:true
      });
      Attendee.belongsTo(models.Event, {
        foreignKey:'eventId',
        hooks:true
      })
    }
  }
  Attendee.init({
    eventId: {
      type:DataTypes.INTEGER,
      onDelete:"CASCADE"
    },
    userId: {
      type:DataTypes.INTEGER,
      onDelete:"CASCADE"
    },
    status: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Attendee',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Attendee;
};
