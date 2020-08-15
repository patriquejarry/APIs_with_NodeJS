const assert = require('assert');

const PasswordHelper = require('../helpers/passwordHelper');

const MOCK_PASSWORD = 'MyPassword@32323232';
const MOCK_HASH = '$2b$04$FoMTmK8tbntJw9Deg1p2Juy5XtxAktkQIPnGTpyKRXl9YbmM2SLi6';

describe('Test Suite for Password Helper', function () {

    it('Must generate a hash from password', async () => {
        const result = await PasswordHelper.hashPassword(MOCK_PASSWORD);
        assert.ok(result.length > 10);
    });

    it('Must compare the password with its hash', async () => {
        const result = await PasswordHelper.comparePassword(MOCK_PASSWORD, MOCK_HASH);
        assert.ok(result);
    });
});