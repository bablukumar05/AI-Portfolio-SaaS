const jwt = require("jsonwebtoken");

module.exports = (id, role = "user") => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};