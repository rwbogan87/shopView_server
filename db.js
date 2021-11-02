const Sequelize = require("sequelize")
const sequelize = new Sequelize("postgres://postgres:ryanpostgres!@localhost:5432/shopView")

module.exports = sequelize;