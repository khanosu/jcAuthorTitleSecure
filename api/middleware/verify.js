const jwt = require('jsonwebtoken');

// exporting a function
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JC_JWT_KEY); 
        // the verify function throws an exception
        req.userData = verified; // this is a middleware appending data!
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication Failed'
        })
    }

}