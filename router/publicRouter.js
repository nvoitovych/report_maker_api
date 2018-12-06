const express = require("express");
const Joi = require("joi");
const BlueBird = require("bluebird");
const bcrypt = require("bcrypt");
const jwt = BlueBird.promisifyAll(require("jsonwebtoken"));
const config = require("../config");
const db = require("../db/db");

const router = express.Router();

function addBcryptType (err) {
  // Compensate for `bcrypt` not using identifiable error types
  err.type = "bcryptError";
  throw err;
}
const CORS = require("../middleware/CORS");

router.use(CORS);
router.get("/routes", (req, res) => {
  return res.status(200).send({"routes: ": router.stack});
});

router.post("/register", async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  const loginSchema = Joi.object().keys({login: Joi.string().alphanum().min(3).max(30).required()});

  const passwordSchema = Joi.object().keys({password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).required()});

  const loginValidationResult = Joi.validate({login: login}, loginSchema);
  const passwordValidationResult = Joi.validate({password: password}, passwordSchema);

  if (loginValidationResult.error) {
    if (passwordValidationResult.error) {
      res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid login and password"});
      return;
    } else {
      res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid login"});
      return;
    }
  } else {
    if (passwordValidationResult.error) {
      res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid password"});
      return;
    }
  }

  // Calculating a hash:
  const hashedPassword = await bcrypt.hash(password, 10)
    .catch(error => {
      switch (error.code) {
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof hashedPassword === "undefined") {
    return;
  }

  const resultUser = await db.createUser(login, hashedPassword)
    .catch(error => {
      switch (error.code) {
        case "ER_DUP_ENTRY": {
          res.status(409).send({code: 409, status: "CONFLICT", message: "User already exists"});
          break;
        }
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof resultUser === "undefined") {
    return;
  }

  const resultAccount = await db.createAccount(resultUser.userId)
    .catch(error => {
      switch (error.code) {
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
        case "ER_DUP_ENTRY": {
          res.status(409).send({code: 409, status: "CONFLICT", message: "User already exists"});
          break;
        }
      }
    });

  if (typeof resultAccount === "undefined") {
    return;
  }

  const token = await jwt.signAsync({
    userId: resultUser.userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // exp in 1 week
  }, config.secret)
    .catch(error => {
      switch (error.code) {
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof token !== "undefined") {
    res.status(200).send({token: token});
  }
});

router.post("/authorize", async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  const loginSchema = Joi.object().keys({login: Joi.string().alphanum().min(3).max(30).required()});
  const passwordSchema = Joi.object().keys({password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).required()});

  const loginValidationResult = Joi.validate({login: login}, loginSchema);
  const passwordValidationResult = Joi.validate({password: password}, passwordSchema);

  if (loginValidationResult.error || passwordValidationResult.error) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid login or password"});
    return;
  }

  const user = await db.getUserByLogin(login)
    .catch((error) => {
      switch (error.code) {
        case "USER_NOT_FOUND": {
          // There is no user credentials with this login
          res.status(401).send({code: 401, status: "UNAUTHORIZED", message: "There is no User with this login"});
          break;
        }
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
        }
      }
    });

  if (typeof user === "undefined") {
    return;
  }
  // if user Credentials with that login exists
  // Validating a hash:
  // Load hash from your password DB.
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    .catch(addBcryptType)
    .catch(error => {
      switch (error.code) {
        default: {
          res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
          break;
        }
      }
    });

  if (typeof isPasswordValid === "undefined") {
    return;
  }

  if (isPasswordValid) {
    const token = await jwt.signAsync({
      userId: user.userId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // exp in 1 week
    }, config.secret)
      .catch(error => {
        switch (error.code) {
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
            break;
          }
        }
      });
    if (typeof token !== "undefined") {
      res.status(200).send({token: token});
    }
  } else {
    res.status(401).send({code: 401, status: "UNAUTHORIZED", message: "Wrong password"});
  }
});

module.exports = router;
