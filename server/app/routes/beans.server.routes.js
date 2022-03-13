const users = require('../controllers/users.server.controller');
const beans = require('../controllers/beans.server.controller');
//
module.exports = function (app) {
        app.route('/api/beans')
            .get(beans.list)
            .post(users.requiresLogin, beans.create);
        //
        app.route('/api/beans/:beanId')
            .get(beans.read)
            .put(users.requiresLogin, beans.hasAuthorization, beans.
                update)
            .delete(users.requiresLogin, beans.hasAuthorization, beans.
                delete);
        //
        app.param('beanId', beans.beanByID);

        // app.route('/api/searchBean')
        //     .post(beans.search);
};
