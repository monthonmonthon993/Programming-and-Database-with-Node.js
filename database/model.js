const Sequelize = require('sequelize')
const genereateHash = require('random-hash')

const connection = new Sequelize('database', 'root', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'database.sqlite',
  operatorsAliases: false
})

const Item = connection.define('item', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true
  },
  code: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  detail: {
    type: Sequelize.TEXT
  },
  price: {
    type: Sequelize.INTEGER
  },
  dateRelease: {
    type: Sequelize.DATE
  },
  dateEnd: {
    type: Sequelize.DATE
  }
}, {
  hooks: {
    beforeCreate: () => {

    },
    afterCreate: () => {

    }
  }
})

Item.prototype.generateCode = () => {
  return genereateHash.generateHash({length: 10})
}

module.exports.connection = connection
module.exports.Item = Item
