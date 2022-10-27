const { User } = require("../models");

function authorization(req,res,next) {
    let UserId = req.params.id || 0;
    const userData = res.locals.user;

    User.findOne({
        where: {
            id:UserId
        }
    })
    .then(result => {
        if (result == null) {
            return res.status(404).json({
                message: `user not found`
            });
        }

        if (result.id == userData.id) {
            next();
        } 
        else {
            return res.status(403).json({
                message: `access denied`
            });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}

module.exports = authorization;