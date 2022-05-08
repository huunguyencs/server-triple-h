const authRole = roles => {
  return (req, res, next) => {
    if (!req.user.role) {
      res.unauthorized();
    } else {
      if (!roles.includes(req.user.role)) {
        res.unauthorized();
      } else {
        next();
      }
    }
  };
};

module.exports = authRole;
