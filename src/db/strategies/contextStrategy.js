const ICrud = require('./interfaceCrud');

class ContextStrategy extends ICrud {
    constructor(strategy) {
        super();
        this._database = strategy;
    }
    static connect() {
        return this._database.connect();
    }
    isConnected() {
        return this._database.isConnected();
    }
    create(item) {
        return this._database.create(item);
    }
    read(item, skip, limit) {
        return this._database.read(item, skip, limit);
    }
    update(itemBefore, item, upsert = false) {
        return this._database.update(itemBefore, item, upsert);
    }
    delete(item) {
        return this._database.delete(item);
    }
}

module.exports = ContextStrategy;