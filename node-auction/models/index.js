const Sequelize = require('sequelize');
const User = require('../models/user');
const Good = require('../models/good');
const Auction = require('../models/auction');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; //db config
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.User = User;
db.Good = Good;
db.Auction = Auction;

User.init(sequelize);
Good.init(sequelize);
Auction.init(sequelize);

User.associate(db);
Good.associate(db);
Auction.associate(db);

module.exports = db;