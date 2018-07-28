const Sequelize = require('sequelize')

const app = require('./app')
const model = require('./model')
const Item = model.Item

// Prepare Item and User
beforeEach(async () => {
  // await model.connection.sync({force: true})

  // Assume these items are stored in a stock.
  const item = await Item.sync()
  await item.bulkCreate([
    {
      id: 1,
      name: 'Armor',
      detail: 'Def: +1',
      price: '500',
      dateRelease: new Date('November 6, 2019'),
      dateEnd: new Date('November 26, 2019')
    },
    {
      id: 2,
      name: 'Sword',
      detail: 'Atk: +1',
      price: '500',
      dateRelease: new Date('November 6, 2019'),
      dateEnd: new Date('November 26, 2019')
    },
    {
      id: 3,
      name: 'Sword - Silver',
      detail: 'Atk: +5',
      price: '1200',
      dateRelease: new Date('July 20, 2018'),
      dateEnd: new Date('November 26, 2019')
    },
    {
      id: 4,
      name: 'Hell Stone',
      detail: 'Atk: +9, Def: +9, HP: +2000',
      price: '10000',
      dateRelease: new Date('July 20, 2018'),
      dateEnd: new Date('November 26, 2019')
    }
  ]).catch(error => console.log(error))
})

afterEach(() => {
  Item.destroy({
    where: {},
    truncate: true
  })
})

test('test showAllItems function', async () => {
  const itemsTest = await Item.findAll()

  const items = await app.showAllItems()

  await expect(items).toEqual(itemsTest)
})

test('test showAvailableItems function', async () => {
  const itemsTest = await Item.findAll({where: {
    dateRelease: {
      [Sequelize.Op.lte]: Date.now()
    },
    dateEnd: {
      [Sequelize.Op.gt]: Date.now()
    }
  }})

  const items = await app.showAvailableItems()

  await expect(items).toEqual(itemsTest)
})

test('test showItemsUserCanAfford function', async () => {
  const credit = 500
  const itemsTest = await Item.findAll({where: {
    price: {
      [Sequelize.Op.lte]: credit
    }
  }})
  const items = await app.showItemsUserCanAfford(credit)

  await expect(items).toEqual(itemsTest)
})

test('test purchaseItems function with one item, it should return one code', async () => {
  const item = await Item.findById(4)
  const code1 = await app.purchaseItems(item, 1000) //user not have enough credit.

  await expect(code1).toEqual(Error('Something wrong. Please check your chosen item.'))

  const code2 = await app.purchaseItems(item, 10000)

  await expect(code2).not.toBeUndefined()
  await expect(code2.length).toBe(1)
})

test('test purchaseItems function with several item, it should return several code', async () => {
  const items = await Item.findAll({
    where: {
      [Sequelize.Op.or]: [{name: 'Sword - Silver'}, {name: 'Hell Stone'}]
    }
  })
  const codes1 = await app.purchaseItems(items, 2000)

  await expect(codes1).toEqual(Error('Something wrong. Please check your chosen item.'))

  const codes2 = await app.purchaseItems(items, 99999)

  await expect(codes2).not.toBeUndefined()
  await expect(codes2.length).toBe(2)
})
