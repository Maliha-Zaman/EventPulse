const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized access" });
    }
  };
  
  module.exports = ensureAuthenticated;
  