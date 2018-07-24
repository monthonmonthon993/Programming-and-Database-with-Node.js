module.exports = class Person {
    constructor() {
        this.friends = [];
    }

    get friendsOfFriends() {
        return [];
    }

    set name(name) {
        this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    get name() {
        return this._name;
    }

}
