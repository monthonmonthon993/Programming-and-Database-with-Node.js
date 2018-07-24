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

    addFriend(friendObj) {
        if (friendObj.friends.includes(this) &&
            this.friends.includes(friendObj)) {
                throw new Error('We both already friends.');
        }
        if (this.name && friendObj.name) {
            this.friends.push(friendObj);
            friendObj.friends.push(this);
        } else {
            throw new Error('You should set your name before add a friend.');
        }
    }
}
