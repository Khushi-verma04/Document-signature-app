const auditMiddleware = (req, res, next) => {
  req.ipAddress = req.ip;
  next();
};

module.exports = auditMiddleware;