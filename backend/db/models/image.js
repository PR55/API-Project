'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Group, {
        foreignKey:'groupId',
        hooks:true
      });
      Image.belongsTo(models.Venue, {
        foreignKey:'venueId',
        hooks:true
      });
      Image.belongsTo(models.Event, {
        foreignKey:'eventId',
        hooks:true
      });
    }
  }
  Image.init({
    imageUrl:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    isPreview:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    groupId:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    venueId:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    eventId:{
      type:DataTypes.INTEGER,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'Image',
    defaultScope:{
      attributes:{
        exclude:['groupId','venueId','eventId']
      }
    }
  });
  return Image;
};
