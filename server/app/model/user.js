'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const User = app.model.define('user', {
    username: {
      type: STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: STRING,
      allowNull: false
    },
    email: {
      type: STRING
    },
    avatarUrl: STRING,
    realname: {
      type: STRING,
      defaultValue: ''
    },
    startDate: {
      type: DATE,
      allowNull: true,
      defaultValue: null
    },
    endDate: {
      type: DATE,
      allowNull: true,
      defaultValue: null
    },
    status: INTEGER
  }, {
      timestamps: true,
      underscored: false,
      paranoid: true,
      freezeTableName: true,
      tableName: 'user',
      comment: '用户表'
    });
  User.associate = function () {
    app.model.User.belongsToMany(app.model.Role, { as: 'role', through: 'role_user_mapping' });

  };

  return User;
}   