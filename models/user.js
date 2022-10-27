'use strict';

const { hashPassword } = require("../helpers/bcrypt");
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Photo)
      this.hasMany(models.Comment)
      this.hasMany(models.SocialMedia)
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "full_name is required"
        },
        notNull: {
          msg: 'full_name is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "email is already exist"
      },
      validate: {
        isEmail: {
          msg: "email is not falid"
        },
        notEmpty: {
          args: true,
          msg: "email is required"
        },
        notNull: {
          msg: 'email is required'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "username is already exist"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "username is required"
        },
        notNull: {
          msg: 'username is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "password is required"
        },
        notNull: {
          msg: 'password is required'
        }
      }
    },
    profile_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "profile_image_url is required"
        },
        notNull: {
          msg: 'profile_image_url is required'
        },
        isUrl: {
          msg: 'profile_image_url is not valid'
        },
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "age is required"
        },
        notNull: {
          msg: 'age is required'
        },
        isInt: {
          msg: 'age must be integer'
        },
      }
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "phone_number is required"
        },
        notNull: {
          msg: 'phone_number is required'
        },
        isInt: {
          msg: 'phone_number must be integer'
        },
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user,opt) => {
        user.password = hashPassword(user.password);
      }
    }
  });
  return User;
};