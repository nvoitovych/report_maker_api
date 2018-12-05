const db = require("../db/db");
const converter = require("../helpers/entityMapper");
const express = require("express");
const Joi = require("joi");
const retrieveParams = require("../middleware/retrieveParams");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.use("/", isAdmin);

router.get("/", async (req, res) => {
  const resultUsers = await db.getAllUsers()
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

  if (typeof resultReport !== "undefined") {
    res.status(200).send(converter.usersShortObjArrayToJsonArray(resultUsers));
  }
});

router.put("/", async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const startDateSchema = Joi.object().keys({startDate: Joi.string().alphanum().min(1).max(100).required()});
  const endDateSchema = Joi.object().keys({endDate: Joi.string().alphanum().min(1).max(100).required()});

  const startDateValidationResult = Joi.validate({startDate: startDate}, startDateSchema);
  const endDateValidationResult = Joi.validate({endDate: endDate}, endDateSchema);

  if (startDateValidationResult.error || endDateValidationResult.error) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid data sent"});
  } else {
    const resultUser = await db.updateUserLicense(req.app.locals.userId, startDate, endDate)
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

    if (typeof resultUser !== "undefined") {
      res.status(200).send(converter.userShortObjToJson(resultUser));
    }
  }
});

router.use("/:userId", retrieveParams);

router.get("/:userId", async (req, res) => {
  const resultUsers = await db.getUserById(req.app.locals.userId)
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

  if (typeof resultReport !== "undefined") {
    res.status(200).send(converter.userForAdminJsonToObj(resultUsers));
  }
});

router.post("/ban/:userId", async (req, res) => {
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

  if (typeof resultUser === "undefined") {
    return;
  }
  const result = await db.changeBanStatusUser(req.app.locals.userId)
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

  if (typeof result !== "undefined") {
    res.status(200).send(converter.userForAdminJsonToObj(result));
  }
});

module.exports = router;
