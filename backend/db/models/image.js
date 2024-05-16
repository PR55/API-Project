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
      allowNull:false,
      validate:{
        isUrl:{
          value:true,
          msg:'Requires a valid image URL'
        }
      }
    },
    isPreview:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    groupId:{
      type:DataTypes.INTEGER,
      allowNull:true,
      validate:{
        groupCheck(value){
          if(value && (this.venueId || this.eventId)){
            throw new Error('Cannot assign group if referencing venue or event');
          }
        }
      }
    },
    venueId:{
      type:DataTypes.INTEGER,
      allowNull:true,
      validate:{
        venueCheck(value){
          if(value && (this.eventId|| this.groupId)){
            throw new Error('Cannot assign venue if referencing event or group');
          }
        }
      }
    },
    eventId:{
      type:DataTypes.INTEGER,
      allowNull:true,
      validate:{
        eventCheck(value){
          if(value && (this.venueId|| this.groupId)){
            throw new Error('Cannot assign event if referencing venue or group');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Image',
    defaultScope:{
      attributes:{
        exclude:['groupId','venueId','eventId', 'createdAt', 'updatedAt']
      }
    }
  });
  return Image;
};