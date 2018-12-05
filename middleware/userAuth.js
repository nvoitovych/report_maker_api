const BlueBird = require("bluebird");
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const config = require("../config");

// use for authorization in all functions under this URL
module.exports = async (req, res, next) => {
  const authorizationHeaderExists = req.headers["authorization"];

  if (!authorizationHeaderExists) {
    res.status(400).send({
      code: 400,
      status: "BAD_REQUEST",
      message: "Authorization header wasn't found or Auth Header is empty"
    });
    return;
  }

  const token = req.headers["authorization"].split(" ")[1]; // get token

  if (!token) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Token wasn't sent"});
  } else {
    const decode = await jwt
      .verifyAsync(token, config.secret)
      .catch(error => {
        switch (error.name) {
          case "TokenExpiredError": {
            res.status(401).send({code: 401, status: "UNAUTHORIZED", message: error.message});
            break;
          }
          case "JsonWebTokenError": {
            res.status(401).send({code: 401, status: "UNAUTHORIZED", message: error.message});
            break;
          }
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          }
        }
      });

    if (typeof decode !== "undefined") {
      if (typeof decode.userId !== "undefined") {
        req.app.locals.userId = decode.userId;
        next();
      } else {
        res.status(400).send({code: 400, status: "BAD_REQUEST", message: "userId wasn't found in token"});
      }
    }
  }
};
