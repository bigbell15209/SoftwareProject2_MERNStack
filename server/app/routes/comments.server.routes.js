const users = require('../controllers/users.server.controller');
const comments = require('../controllers/comments.server.controller');
//
module.exports = function (app) {
        app.route('/api/comments')
            .get(comments.listByUserID)
            .get(comments.listByBeanID)
            .post(users.requiresLogin, comments.create);
        //
        app.route('/api/comments/:commentId')
            .get(comments.read)
            .put(users.requiresLogin, comments.hasAuthorization, comments.
                update)
            .delete(users.requiresLogin, comments.hasAuthorization, comments.
                delete);
        //
        app.param('commentId', comments.commentByUserID);
        // app.param('commentId', comments.commentByBeanID);

        // app.route('/api/searchBean')
        //     .post(comments.search);
};
