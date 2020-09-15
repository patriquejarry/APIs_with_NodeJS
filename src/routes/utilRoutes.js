const { join } = require('path');

const BaseRoutes = require('./baseRoutes');

class UtilRoutes extends BaseRoutes {

    coverage() {
        return {
            path: '/coverage/{param*}',
            method: 'GET',
            config: {
                auth: false
            },
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    };

}

module.exports = UtilRoutes;