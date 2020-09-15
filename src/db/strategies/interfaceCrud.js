class NotImplementedException extends Error {

    constructor() {
        super('Not Implemented Exception');
    }
}

class ICrud {

    static connect() {
        throw new NotImplementedException();
    };

    isConnected() {
        throw new NotImplementedException();
    };
    create(item) {
        throw new NotImplementedException();
    };
    read(item, skip, limit) {
        throw new NotImplementedException();
    };
    update(itemBefore, item) {
        throw new NotImplementedException();
    };
    delete(id) {
        throw new NotImplementedException();
    };
}

module.exports = ICrud;