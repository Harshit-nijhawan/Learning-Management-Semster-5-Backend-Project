const { hasRole } = require('../utils/roles');

const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!hasRole(req.user.role, requiredRole)) {
            return res.status(403).json({ 
                message: 'You do not have permission to perform this action' 
            });
        }

        next();
    };
};

module.exports = {
    checkRole
};
