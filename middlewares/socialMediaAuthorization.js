const { SocialMedia } = require("../models");

function authorization(req,res,next) {
    let SocialMediaId = req.params.id || 0;
    const userData = res.locals.user;

    SocialMedia.findOne({
        where: {
            id:SocialMediaId
        }
    })
    .then(result => {
        if (result == null) {
            return res.status(404).json({
                message: `social media not found`
            });
        }

        if (result.UserId == userData.id) {
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