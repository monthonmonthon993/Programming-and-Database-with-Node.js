const Sequelize = require('sequelize')

const app = require('./app')
const model = require('./model')
const Item = model.Item

// Prepare Items
beforeEach(async () => {
  // Assume these items are stored in a stock.
  const item = await Item.sync()

  await item.bulkCreate([
    {
      id: 1,
      name: 'Armor',
      detail: 'Type=>weapon, Property=>Def: +1',
      price: '500',
      dateRelease: new Date('November 6, 2019'),
      dateEnd: new Date('November 26, 2019')
    },
    {
      id: 2,
      name: 'Sword',
      detail: 'Type=>weapon, Property=>Atk: +1',
      price: '500',
      dateRelease: new Date('November 6, 2019'),
      dateEnd: new Date('November 26, 2019')
    },
    {
      id: 3,
      name: 'Sword - Silver',
      detail: 'Type=>weapon, Property=>Atk: +5',
      price: '1200',
      dateRelease: new Date('July 20, 2018'),
      dateEnd: new Date('November 26, 2019')
    },
    {
      id: 4,
      name: 'Hell Stone',
      detail: 'Type=>weapon, Property=>Atk: +9, Def: +9, HP: +2000',
      price: '10000',
      dateRelease: new Date('July 20, 2018'),
      dateEnd: new Date('November 26, 2019')
    }
  ]).catch(error => console.log(error))
})

afterEach(() => { Item.destroy({ where: {}, truncate: true }) })

test('Test showAllItems function', () => {
  const itemsTest = Item.findAll()

  const items = app.showAllItems()

  expect(items).toEqual(itemsTest)
})

test('test showAvailableItems function', () => {
  const itemsTest = Item.findAll(
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

  const items = app.showAvailableItems()

  expect(items).toEqual(itemsTest)
})

test('test showItemsUserCanAfford function', () => {
  const credit = 500
  const itemsTest = Item.findAll(
    {
      where: {
        price: {
          [Sequelize.Op.lte]: credit
        }
      }
    }
  )
  const items = app.showItemsUserCanAfford(credit)

  expect(items).toEqual(itemsTest)
})

test('test purchaseItems function with one item, it should return one code', async () => {
  const item = await Item.findById(4)
  const code1 = await app.purchaseItems(item, 1000) 

  expect(code1).toEqual(Error('Something wrong. Please check your chosen item.'))// user not have enough credit.

  const code2 = await app.purchaseItems(item, 10000)

  expect(code2).not.toEqual(Error('Something wrong. Please check your chosen item.'))
  expect(code2).toHaveLength(1) // Get one code
})

test('test purchaseItems function with several item, it should return several code', async () => {
  const items = await Item.findAll(
    {
      where: {
        [Sequelize.Op.or]: [{name: 'Sword - Silver'}, {name: 'Hell Stone'}]
      }
    }
  )
  const codes1 = await app.purchaseItems(items, 2000)

  expect(codes1).toEqual(Error('Something wrong. Please check your chosen item.'))// user not have enough credit.

  const codes2 = await app.purchaseItems(items, 99999)

  expect(codes2).not.toEqual(Error('Something wrong. Please check your chosen item.'))
  expect(codes2).toHaveLength(2) // Get two codes from two items
})

test('test setSalePromotion function', async () => {
  const item = await Item.findById(4)
  expect(item.price).toBe(10000)
  expect(item.dateRelease).toEqual(new Date('July 20, 2018'))
  expect(item.dateEnd).toEqual(new Date('November 26, 2019'))

  const itemSaled = await item.setSalePromotion(item, 50, new Date('July 25, 2018'), new Date('October 10, 2018'))
  expect(itemSaled.price).toBe(5000) // sale 50%
  expect(item.dateRelease).toEqual(new Date('July 25, 2018'))
  expect(item.dateEnd).toEqual(new Date('October 10, 2018'))
})

test('test setBuyOneGetOneFreePromotion function', async () => {
  const userCredit = 10000

  const item1 = await Item.findById(4)
  const item2 = await Item.findById(1)
  const normalPackItem = [item1, item2]

  expect(normalPackItem[0].price).toBe(10000)
  expect(normalPackItem[1].price).toBe(500)

  const code = await app.purchaseItems(normalPackItem, userCredit) // Buy two item normally.

  expect(code).toEqual(Error('Something wrong. Please check your chosen item.')) // Credit it not enough.

  const proPackItem = await item1.setBuyOneGetOneFreePromotion(item1, item2) // Set Promotion:  Buy item1 get item2 free.

  expect(proPackItem.length).toBe(2)
  expect(proPackItem[0].price).toBe(10000)
  expect(proPackItem[1].price).toBe(0) // item2 is free now.

  const codeWithPro = await app.purchaseItems(proPackItem, userCredit) // Buy pack item with promotion

  expect(codeWithPro).not.toEqual(Error('Something wrong. Please check your chosen item.')) // Credit is enough because item2 is free.
  expect(codeWithPro.length).toBe(2) // Get two code item.
})
