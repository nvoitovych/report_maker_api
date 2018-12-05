const db = require("../db/db");

module.exports = async (req, res, next) => {
  const resultUser = await db.getUserById(req.app.locals.userId)
    .catch(error => {
      switch (error.code) {
        default: {
          res.status(500).send({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "Internal server error"
          });
        }
      }
    });
  if (resultUser.isAdmin) {
    req.app.locals.isAdmin = resultUser.isAdmin;
    next();
  } else {
    res.status(403).send({code: 403, status: "FORBIDDEN", message: "Sorry, you are not allowed to do this action"});
  }
};
