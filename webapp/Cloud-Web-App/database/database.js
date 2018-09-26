var pg  = require('pg');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:Hardik-2010@localhost/CloudApp',
{
    uri: 'postgres://postgres:Hardik-2010@localhost/CloudApp',
    options: {
        native: true,
        ssl: true
    }
});

module.exports = sequelize;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.register = require('../app/model/register')(sequelize,Sequelize);


module.exports =db;