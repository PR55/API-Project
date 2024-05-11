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
    groupId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,
    status: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};
