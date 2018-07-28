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
  items.forEach(item => {
    totalCost = totalCost + item.price
  })
  if (totalCost <= credit) {
    return true
  } else {
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

const purchaseItems = (items, credit) => {
  let codes = []

  if (items instanceof Object) {
    items = [items]
  }

  if (checkItemsCanAfford(items, credit) && checkItemAvailable(items)) {
    items.forEach((item) => {
      codes.push(item.generateCode())
    })
    return codes
  } else {
    return new Error('Something wrong. Please check your chosen item.')
  }
}

const setItemSale = (item, salePercent) => {
  return item.update({price: item.price * salePercent / 100})
}

const setPromotion = async (item, salePercent, dateStart, dateEnd) => {
  item = await setItemSale(item, salePercent)
  item = await item.update({dateRelease: dateStart, dateEnd: dateEnd})
  return item
}

module.exports.purchaseItems = purchaseItems
module.exports.setPromotion = setPromotion
module.exports.showAllItems = showAllItems
module.exports.showAvailableItems = showAvailableItems
module.exports.showItemsUserCanAfford = showItemsUserCanAfford
