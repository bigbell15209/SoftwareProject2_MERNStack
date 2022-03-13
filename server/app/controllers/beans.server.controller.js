const mongoose = require('mongoose');
const Bean = mongoose.model('Bean');
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
    const bean = new Bean();
    bean.specie = req.body.specie;
    bean.origin = req.body.origin;
    bean.roastingLevel = req.body.roastingLevel;
    bean.price = req.body.price;
    bean.description = req.body.description;
    bean.street = req.body.street;
    bean.city = req.body.city;
    bean.province = req.body.province;
    bean.country = req.body.country;
    bean.postal = req.body.postal;

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
        bean.seller = req.id
        console.log('req.seller._id',req.id);

        bean.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err))

                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(bean);
            }
        });
    
    });
};
//
exports.list = function (req, res) {
    Bean.find().sort('-created').populate('seller', 'firstName lastName fullName').exec((err, beans) => {
if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        res.status(200).json(beans);
    }
});
};
//
exports.beanByID = function (req, res, next, id) {
    Bean.findById(id).populate('seller', 'firstName lastName fullName').exec((err, bean) => {if (err) return next(err);
    if (!bean) return next(new Error('Failed to load bean '
            + id));
        req.bean = bean;
        console.log('in beanByID:', req.bean)
        next();
    });
};
//
exports.read = function (req, res) {
    res.status(200).json(req.bean);
};
//
exports.update = function (req, res) {
    console.log('in update:', req.bean)
    const bean = req.bean;
    // You can only edit price and description
    bean.price = req.body.price;
    bean.description = req.body.description;

    bean.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(bean);
        }
    });
};
//
exports.delete = function (req, res) {
    const bean = req.bean;
    bean.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(bean);
        }
    });
};
//The hasAuthorization() middleware uses the req.article and req.user objects
//to verify that the current user is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - seller: ',req.bean.seller)
    console.log('in hasAuthorization - user: ',req.id)


    if (req.bean.seller[0].id !== req.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};


exports.search = function (req, res) {
    const bean = new Bean();

    // You can search the beans you want with following parameters
    bean.specie = req.body.specie;
    bean.origin = req.body.origin;
    bean.roastingLevel = req.body.roastingLevel;

    console.log("User Search req.body: " + JSON.stringify(req.body.specie));
    console.log("User Search req.body: " + JSON.stringify(req.body.origin));
    console.log("User Search req.body: " + JSON.stringify(req.body.roastingLevel));

    Bean.find({specie: req.body.specie, origin: req.body.origin, roastingLevel: req.body.roastingLevel }).sort('-created').populate('seller', 'firstName lastName fullName').exec((err, beans) => {
        if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(beans);
                console.log('searched user:' + beans);
            }
        });

};