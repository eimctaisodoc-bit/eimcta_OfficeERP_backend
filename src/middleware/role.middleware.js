const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
// console.log("authorizeRoles middleware called with roles:", roles);
    // console.log("authorizeRoles hit:", req.user);
    // console.log("authorizeRoles hit:", req.user.decoded.role, roles);
    if (!req.user.decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.decoded.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied from backend" });
    }

    next();
  };
};

module.exports = authorizeRoles;
