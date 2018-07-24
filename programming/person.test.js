const Person = require('./person');

it('test initialize an instance Person with a name, \
    object should have a name with first string uppercase', () => {
        const person1 = new Person();
        person1.name = 'tony';
        expect(person1.name).toBe('Tony');

        const person2 = new Person();
        person2.name = 'steve';
        expect(person2.name).toBe('Steve')
    }
);

it('test initailize an instance Person, \
    name and friends attribute to be undefined', () => {
        const person = new Person();
        expect(person.name).toBeUndefined();
        expect(person.friends[0]).toBeUndefined();
    }
);

it('test call addFriend function with set a name, \
    It should be called', () => {
        person1 = new Person();
        person1.name = 'Manee';
        person1.addFriend = jest.fn();

        person2 = new Person();
        person2.name = 'Preecha';

        person1.addFriend(person2);
        expect(person1.addFriend).toHaveBeenCalledWith(person2);
    }
);

it('test call addFriend function when not set a name, \
    it should throw an error', () => {
        //person1 not set a name
        person1 = new Person();

        person2 = new Person();
        person2.name = "Manood"

        expect(() => {
            person1.addFriend(person2);
        }).toThrow('You should set your name before add a friend.');

        //person4 not set a name
        person3 = new Person();
        person3.name = "Meena";

        person4 = new Person();

        expect(() => {
            person3.addFriend(person4);
        }).toThrow('You should set your name before add a friend.');
    }
);

it('test addFriend fucntion with a friend name, \
    An attribute friend should have array of added friends.', () => {
        person1 = new Person();
        person2 = new Person();
        person3 = new Person();

        person1.name = 'Manee';
        person2.name = 'Preecha';
        person3.name = 'Premchai';
        
        person1.addFriend(person2);
        expect(person1.friends).toEqual([person2]);

        person1.addFriend(person3);
        expect(person1.friends).toEqual([person2, person3])
    }
);

it('test addFriend function repeatedly, It should throw an error.', () => {
    person1 = new Person();
    person2 = new Person();
    
    person1.name = "Sarah";
    person2.name = "Rick";

    person1.addFriend(person2);
    expect(() => {
        person2.addFriend(person1);
    }).toThrow('We both already friends.');
})

it('test if A is a friend of B, B will be a friend of A too.', () => {
    A = new Person();
    B = new Person();

    A.name = 'A';
    B.name = 'B';

    A.addFriend(B);     
    // A <==> B
    expect(A.friends).toEqual([B]);
    expect(B.friends).toEqual([A]);
});

// A <==> B ,it mean Both of A and B are friend
it('test if A <==> B and B <==> C, C will be a friend of friends of A', () => {
    X = new Person();
    Y = new Person();
    Z = new Person();

    X.name = "X";
    Y.name = "Y";
    Z.name = "Z";

    X.addFriend(Y);
    Y.addFriend(Z);
    // X <==> Y <==> Z
    expect(X.friendsOfFriends).toContain('Z');
    expect(Y.friendsOfFriends).toEqual([]);
    expect(Z.friendsOfFriends).toContain('X');
});
