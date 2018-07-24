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
