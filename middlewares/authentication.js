const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

function authentication(req,res,next) {
    try {
        const token = req.get("token");
        const decodedToken = verifyToken(token);

        User.findOne({
            where:{
                id:decodedToken.id,
                // email:decodedToken.email,
            }
        })
            .then(result => {
                if (!result) {
                    return res.status(401).json({message: `Unauthorized`});
                }

                res.locals.user = result;
                next();
            })
            .catch(err => {
                return res.status(500).json(err);
            })

    } catch (error) {
        return res.status(error.code).json({message:error.message});
    }
}

module.exports = authentication;