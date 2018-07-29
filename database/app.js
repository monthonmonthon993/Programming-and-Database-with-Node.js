const Sequelize = require('sequelize')

const app = require('./model')
const Item = app.Item

const showAllItems = () => {
  return Item.findAll()
}

const showAvailableItems = () => {
  return Item.findAll(
    {
      where: {
        dateRelease: {
          [Sequelize.Op.lte]: Date.now()
        },
        dateEnd: {
          [Sequelize.Op.gt]: Date.now()
        }
      }
    }
  )
}

const showItemsUserCanAfford = (credit) => {
  return Item.findAll(
    {
      where: {
        price: {
          [Sequelize.Op.lte]: credit
        }
      }
    }
  )
}

const checkItemsCanAfford = (items, credit) => {
  let totalCost = 0

  items.forEach(item => totalCost = totalCost + item.price)

  if (totalCost <= credit) { return true }
  else {
    console.log('Your credit is not enough.')
    return false
  }
}

const checkItemAvailable = (items) => {
  items.forEach(item => {
    if (item.dateRelease > Date.now() && item.dateEnd < Date.now()) {
      console.log(item, 'is not available.')
      return false
    }
  })
  return true
}

const purchaseItems = (items, credit) => { // Buy items.
  let codes = []

  if (!items.length) { items = [items] } // set one item to array.

  if (checkItemsCanAfford(items, credit) && checkItemAvailable(items)) {
    items.forEach((item) => { codes.push(item.generateCode()) })
    return codes
  } 
  else { return new Error('Something wrong. Please check your chosen item.') }
}

module.exports.purchaseItems = purchaseItems
module.exports.showAllItems = showAllItems
module.exports.showAvailableItems = showAvailableItems
module.exports.showItemsUserCanAfford = showItemsUserCanAfford
