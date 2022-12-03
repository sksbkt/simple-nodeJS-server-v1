const allowedOrigins = require('../config/allowedOrigins');

function credentials(req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.headers('access control allow credentials', true);
    }
    next();
}
module.exports = credentials;