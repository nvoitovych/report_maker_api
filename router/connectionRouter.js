const db = require("../db/db");
const converter = require("../helpers/entityMapper");
const express = require("express");
const Joi = require("joi");
const retrieveParams = require("../middleware/retrieveParams");
const router = express.Router();

router.get("/", async (req, res) => {
  const resultConnection = await db.getUserConnectionByUserId(req.app.locals.userId)
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

  if (typeof resultConnection !== "undefined") {
    res.status(200).send(converter.resultConnection);
  }
});

router.post("/", async (req, res) => {
  const hashTag = req.body.hashTag;
  const linkToTwitter = req.body.linkToTwitter;
  const weekday = req.body.weekday;
  const reportType = req.body.reportType;

  const hashTagSchema = Joi.object().keys({hashTag: Joi.string().alphanum().min(1).max(100).required()});
  const linkToTwitterSchema = Joi.object().keys({linkToTwitter: Joi.string().alphanum().min(1).max(100).required()});
  const weekdaySchema = Joi.object().keys({weekday: Joi.string().alphanum().min(1).max(30).required()});
  const reportTypeSchema = Joi.object().keys({reportType: Joi.string().alphanum().min(1).max(30).required()});

  const hashTagValidationResult = Joi.validate({hashTag: hashTag}, hashTagSchema);
  const linkToTwitterValidationResult = Joi.validate({linkToTwitter: linkToTwitter}, linkToTwitterSchema);
  const weekdayValidationResult = Joi.validate({weekday: weekday}, weekdaySchema);
  const reportTypeValidationResult = Joi.validate({reportType: reportType}, reportTypeSchema);

  if (hashTagValidationResult.error || linkToTwitterValidationResult.error ||
    weekdayValidationResult.error || reportTypeValidationResult.error) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid data sent"});
  } else {
    const connection = {
      "userId": req.app.locals.userId,
      "hashTag": hashTag,
      "linkToTwitter": linkToTwitter,
      "reportType": reportType,
      "weekday": weekday
    };
    const resultConnection = await db.createConnection(connection)
      .catch(error => {
        switch (error.code) {
          default: {
            res.status(500).send({code: 500, status: "INTERNAL_SERVER_ERROR", message: "Internal server error"});
            break;
          }
        }
      });

    if (typeof resultConnection !== "undefined") {
      res.status(200).send({connectionId: resultConnection.connectionId});
    }
  }
});

router.use("/:connectionId", retrieveParams);

router.delete("/:connectionId", async (req, res) => {
  const resultConnection = await db.deleteConnectionById(req.parentRouterParams.connectionId)
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

  if (typeof resultConnection !== "undefined") {
    res.status(200).send({success: true});
  }
});

router.put("/:connectionId", async (req, res) => {
  const hashTag = req.body.hashTag;
  const linkToTwitter = req.body.linkToTwitter;
  const weekday = req.body.weekday;
  const reportType = req.body.reportType;

  const hashTagSchema = Joi.object().keys({hashTag: Joi.string().alphanum().min(1).max(100).required()});
  const linkToTwitterSchema = Joi.object().keys({linkToTwitter: Joi.string().alphanum().min(1).max(100).required()});
  const weekdaySchema = Joi.object().keys({weekday: Joi.string().alphanum().min(1).max(30).required()});
  const reportTypeSchema = Joi.object().keys({reportType: Joi.string().alphanum().min(1).max(30).required()});

  const hashTagValidationResult = Joi.validate({hashTag: hashTag}, hashTagSchema);
  const linkToTwitterValidationResult = Joi.validate({linkToTwitter: linkToTwitter}, linkToTwitterSchema);
  const weekdayValidationResult = Joi.validate({weekday: weekday}, weekdaySchema);
  const reportTypeValidationResult = Joi.validate({reportType: reportType}, reportTypeSchema);

  if (hashTagValidationResult.error || linkToTwitterValidationResult.error ||
    weekdayValidationResult.error || reportTypeValidationResult.error) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid data sent"});
  } else {
    const connection = {
      "userId": req.app.locals.userId,
      "hashTag": hashTag,
      "linkToTwitter": linkToTwitter,
      "reportType": reportType,
      "weekday": weekday
    };
    const resultConnection = await db.updateConnectionById(connection, req.parentRouterParams.connectionId)
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

    if (typeof resultConnection !== "undefined") {
      res.status(200).send({success: true});
    }
  }
});

module.exports = router;
