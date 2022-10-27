const jwt = require("jsonwebtoken");
const KEY = "03102000";

function generateToken(payload) {
    const token = jwt.sign(payload,KEY);
    return token
}

function verifyToken(token) {
    try {
        const decode = jwt.verify(token,KEY);
        return decode
    } catch (error) {
        throw {
            code: 401,
            message: "Unauthorized"
        }
    }
}

module.exports = {
    generateToken,
    verifyToken
}