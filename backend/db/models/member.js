'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Member.belongsTo(models.Group,{
        foreignKey:'groupId',
        hooks:true
      });
      Member.belongsTo(models.User, {
        foreignKey:'memberId',
        hooks:true
      })
    }
  }
  Member.init({
    groupId: {
      type:DataTypes.INTEGER,
      onDelete:"CASCADE"
    },
    memberId: {
     type:DataTypes.INTEGER,
      onDelete:"CASCADE"
    },
    status:{
      type: DataTypes.TEXT,
      allowNull:false,
      validate:{
        application(value){
          const levels=['pending', 'member', 'co-host', 'organizer'];

          if(!levels.includes(value)){
            throw new Error('Invalid membership type');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Member',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Member;
};
