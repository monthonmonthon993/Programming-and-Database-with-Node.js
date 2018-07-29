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
})

Item.prototype.generateCode = () => {
  return genereateHash.generateHash({length: 10})
}

Item.prototype.setSalePromotion = (item, salePercent, dateStart, dateEnd) => {
  const price = item.price * salePercent / 100
  item.update({ price: price, dateRelease: dateStart, dateEnd: dateEnd })
  return item
}
Item.prototype.setBuyOneGetOneFreePromotion = async (item1, item2) => {
  const freeItem2 = await Item.build({
    name: item2.name,
    detail: item2.detail,
    price: 0,
    dateRelease: item1.dateRelease,
    dateEnd: item1.dateEnd
  })
  const bundleItem = [item1, freeItem2]
  bundleItem.forEach((item) => console.log(item.name + ' ' + item.price))
  return bundleItem
}

module.exports.connection = connection
module.exports.Item = Item
