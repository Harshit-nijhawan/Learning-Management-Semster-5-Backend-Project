const ROLES = {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student'
};

const ROLE_HIERARCHY = {
    [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.STUDENT],
    [ROLES.INSTRUCTOR]: [ROLES.INSTRUCTOR, ROLES.STUDENT],
    [ROLES.STUDENT]: [ROLES.STUDENT]
};

const hasRole = (userRole, requiredRole) => {
    if (!userRole || !requiredRole) return false;
    return ROLE_HIERARCHY[userRole]?.includes(requiredRole) || false;
};

module.exports = {
    ROLES,
    ROLE_HIERARCHY,
    hasRole
};
