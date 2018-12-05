module.exports = async (req, res, next) => {
  req.parentRouterParams = req.params;
  next();
};
