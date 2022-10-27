'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User);
    }
  }
  SocialMedia.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "name is required"
        },
        notNull: {
          msg: 'name is required'
        }
      }
    },
    social_media_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "social_media_url is required"
        },
        notNull: {
          msg: 'social_media_url is required'
        },
        isUrl: {
          msg: 'social_media_url is not valid'
        },
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'SocialMedia',
  });
  return SocialMedia;
};