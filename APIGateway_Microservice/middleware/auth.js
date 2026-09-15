const jwt = require('jsonwebtoken')

// Authentication: Check whether the JWT token is valid
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    // No Authorization header
    if (!authHeader) {
        return res.status(401).json({
            status: 'Failure',
            message: 'Access token required'
        })
    }

    // Expected format: Bearer <token>
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            status: 'Failure',
            message: 'Invalid authorization format'
        })
    }

    try {
        // Verify token using the same secret used by Authentication Microservice
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        // Save decoded information for the next middleware
        req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json({
            status: 'Failure',
            message: 'Invalid or expired token'
        })
    }
}


// Authorization: Check user's role
function authorize(...allowedRoles) {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                status: 'Failure',
                message: 'Unauthorized'
            })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'Failure',
                message: 'Forbidden: insufficient permissions'
            })
        }

        next()
    }
}


module.exports = {
    authenticate,
    authorize
}