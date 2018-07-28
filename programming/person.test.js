const Person = require('./person')

test('test initialize an instance Person with a name, object should have a name with first string uppercase', () => {
  const person1 = new Person()
  person1.name = 'tony'
  expect(person1.name).toBe('Tony')

  const person2 = new Person()
  person2.name = 'steve'
  expect(person2.name).toBe('Steve')
}
)

test('test initailize an instance Person, name and friends attribute to be undefined', () => {
  const person = new Person()
  expect(person.name).toBeUndefined()
  expect(person.friends[0]).toBeUndefined()
}
)

test('test call addFriend function with set a name, It should be called', () => {
  const person1 = new Person()
  person1.name = 'Manee'
  person1.addFriend = jest.fn()

  const person2 = new Person()
  person2.name = 'Preecha'

  person1.addFriend(person2)
  expect(person1.addFriend).toHaveBeenCalledWith(person2)
}
)

test('test call addFriend function when not set a name, it should throw an error', () => {
  // person1 not set a name
  const person1 = new Person()

  const person2 = new Person()
  person2.name = 'Manood'

  expect(() => { person1.addFriend(person2) }).toThrow('You should set your name before add a friend.')

  // person4 not set a name
  const person3 = new Person()
  person3.name = 'Meena'

  const person4 = new Person()

  expect(() => { person3.addFriend(person4) }).toThrow('You should set your name before add a friend.')
})

test('test addFriend fucntion with a friend name, An attribute friend should have array of added friends.', () => {
  const person1 = new Person()
  const person2 = new Person()
  const person3 = new Person()

  person1.name = 'Manee'
  person2.name = 'Preecha'
  person3.name = 'Premchai'

  person1.addFriend(person2)
  expect(person1.friends).toEqual([person2])

  person1.addFriend(person3)
  expect(person1.friends).toEqual([person2, person3])
}
)

test('test addFriend function repeatedly, It should throw an error.', () => {
  const person1 = new Person()
  const person2 = new Person()

  person1.name = 'Sarah'
  person2.name = 'Rick'

  person1.addFriend(person2)
  expect(() => {
    person2.addFriend(person1)
  }).toThrow('We both already friends.')
})

test('test if A is a friend of B, B will be a friend of A too.', () => {
  const A = new Person()
  const B = new Person()

  A.name = 'A'
  B.name = 'B'

  A.addFriend(B)
  // A <==> B
  expect(A.friends).toEqual([B])
  expect(B.friends).toEqual([A])
})

// A <==> B ,it mean Both of A and B are friend
test('test if A <==> B and B <==> C, C will be a friend of friends of A', () => {
  const X = new Person()
  const Y = new Person()
  const Z = new Person()

  X.name = 'X'
  Y.name = 'Y'
  Z.name = 'Z'

  X.addFriend(Y)
  Y.addFriend(Z)
  // X <==> Y <==> Z
  expect(X.friendsOfFriends).toContain('Z')
  expect(Y.friendsOfFriends).toEqual([])
  expect(Z.friendsOfFriends).toContain('X')
})

test('test friends of friends more complicated', () => {
  const A = new Person()
  const B = new Person()
  const C = new Person()
  A.name = 'A'
  B.name = 'B'
  C.name = 'C'

  const X = new Person()
  const Y = new Person()
  const Z = new Person()
  X.name = 'X'
  Y.name = 'Y'
  Z.name = 'Z'

  A.addFriend(B)
  A.addFriend(C) // now A, B and C are friends.

  X.addFriend(Y)
  X.addFriend(Z) // now X, Y and Z are friends.

  A.addFriend(X) // now A <==> X then B,C and Y,Z are friends of friends of X and A

  expect(A.friendsOfFriends).toHaveLength(2) // Y, Z
  expect(A.friendsOfFriends).toContain('Y') // A <==> X <==> Y
  expect(A.friendsOfFriends).toContain('Z') // A <==> X <==> Z

  expect(B.friendsOfFriends).toHaveLength(2) // C,X
  expect(B.friendsOfFriends).toContain('C') // B <==> A <==> C
  expect(B.friendsOfFriends).toContain('X') // B <==> A <==> X

  expect(C.friendsOfFriends).toHaveLength(2) // B,X
  expect(C.friendsOfFriends).toContain('B') // C <==> A <==> B
  expect(C.friendsOfFriends).toContain('X') // C <==> A <==> X

  expect(X.friendsOfFriends).toHaveLength(2) // B,C
  expect(X.friendsOfFriends).toContain('B') // X <==> A <==> B
  expect(X.friendsOfFriends).toContain('C') // X <==> A <==> C

  expect(Y.friendsOfFriends).toHaveLength(2) // A, Z
  expect(Y.friendsOfFriends).toContain('A') // Y <==> X <==> A
  expect(Y.friendsOfFriends).toContain('Z') // Y <==> X <==> Z

  expect(Z.friendsOfFriends).toHaveLength(2) // A, Y
  expect(Z.friendsOfFriends).toContain('A') // Z <==> X <==> A
  expect(Z.friendsOfFriends).toContain('Y') // Z <==> X <==> Y

  const M = new Person()
  M.name = 'M'
  M.addFriend(A)

  expect(A.friendsOfFriends).toHaveLength(2) // Y, Z

  expect(B.friendsOfFriends).toHaveLength(3) // C, X, M
  expect(B.friendsOfFriends).toContain('M') // B <==> A <==> M

  expect(C.friendsOfFriends).toHaveLength(3) // B, X, M
  expect(C.friendsOfFriends).toContain('M') // C <==> A <==> M

  expect(X.friendsOfFriends).toHaveLength(3) // B, C, M
  expect(X.friendsOfFriends).toContain('M') // X <==> A <==> M

  expect(Y.friendsOfFriends).toHaveLength(2) // A, Z
  expect(Y.friendsOfFriends).toContain('A') // Y <==> X <==> A
  expect(Y.friendsOfFriends).toContain('Z') // Y <==> X <==> Z

  expect(Z.friendsOfFriends).toHaveLength(2) // A, Y
  expect(Z.friendsOfFriends).toContain('A') // Z <==> X <==> A
  expect(Z.friendsOfFriends).toContain('Y') // Z <==> X <==> Y
})
