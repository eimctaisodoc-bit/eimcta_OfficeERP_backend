const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    // console.log("authorizeRoles hit:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

module.exports = authorizeRoles;
