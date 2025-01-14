class Client {

    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        if (value.length < 3) {
            alert("name is too short");
            return;
        }
        this._name = value;
    }
}

module.exports = Client;