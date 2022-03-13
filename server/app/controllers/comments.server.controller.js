const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');
const Bean = require('mongoose').model('Bean');
const User = require('mongoose').model('User');

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
//
exports.create = function (req, res) {
    const comment = new Comment();
    comment.rating = req.body.rating;
    comment.content = req.body.content;
    

    console.log(req.body)
    //
    //
    User.findOne({username: req.body.username}, (err, user) => {

        if (err) { return getErrorMessage(err); }
        //
        req.id = user._id;
        console.log('user._id',req.id);

	
    }).then( function () 
    {
        comment.commenter = req.id
        console.log('req.commenter._id',req.id);

        comment.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err))

                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(comment);
            }
        });
    
    });
};

// You might need to use not only 'commenter' but also 'review' as ref also
exports.listByUserID = function (req, res) {
    Comment.find().sort('-created').populate('commenter', 'firstName lastName fullName').exec((err, comments) => {
if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        res.status(200).json(comments);
    }
});
};

exports.listByBeanID = function (req, res) {
    Comment.find().sort('-created').populate('review', 'specie roastingLevel origin coffeeName').exec((err, comments) => {
if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        res.status(200).json(comments);
    }
});
};

// You need to use not only 'commenter' but also 'review' as ref also
exports.commentByUserID = function (req, res, next, id) {
    Comment.findById(id).populate('commenter', 'firstName lastName fullName').exec((err, comment) => {if (err) return next(err);
    if (!comment) return next(new Error('Failed to load comment '
            + id));
        req.comment = comment;
        console.log('in commentByID:', req.comment)
        next();
    });
};


exports.commentByBeanID = function (req, res, next, id) {
    Comment.findById(id).populate('review', 'specie roastingLevel origin coffeeName').exec((err, comment) => {if (err) return next(err);
    if (!comment) return next(new Error('Failed to load comment '
            + id));
        req.comment = comment;
        console.log('in commentByBeanID:', req.comment)
        next();
    });
};


//
exports.read = function (req, res) {
    res.status(200).json(req.comment);
};
//
exports.update = function (req, res) {
    console.log('in update:', req.comment)
    const comment = req.comment;
    comment.rating = req.body.rating;
    comment.content = req.body.content;

    comment.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(comment);
        }
    });
};
//
exports.delete = function (req, res) {
    const comment = req.comment;
    comment.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(comment);
        }
    });
};

//The hasAuthorization() middleware uses the req.comment and req.user objects
//to verify that the current user is the creator of the current comment
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - commenter: ',req.comment.commenter)
    console.log('in hasAuthorization - user: ',req.id)


    if (req.comment.commenter[0].id !== req.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};


// exports.search = function (req, res) {
//     const comment = new Comment();

//     // You can search the comments you want with following parameters
//     comment.rating = req.body.rating;
//     comment.content = req.body.content;


//     Comment.find({}).sort('-created').populate('', '').exec((err, comments) => {
//         if (err) {
//                 return res.status(400).send({
//                     message: getErrorMessage(err)
//                 });
//             } else {
//                 res.status(200).json(comments);
//                 console.log('searched comments:' + comments);
//             }
//         });

// };