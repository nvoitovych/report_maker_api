const config = require("../config");
const db = require("../db/db");
const converter = require("../helpers/entityMapper");
const express = require("express");
const Joi = require("joi");
const retrieveParams = require("../middleware/retrieveParams");
const router = express.Router();
const BlueBird = require("bluebird");
const Twitter = BlueBird.promisifyAll(require("twitter")).Twitter;

router.post("/", async (req, res) => {
  const weekday = req.body.weekday;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const weekdaySchema = Joi.object().keys({weekday: Joi.string().alphanum().min(1).max(100).required()});
  const startDateSchema = Joi.object().keys({startDate: Joi.string().alphanum().min(1).max(100).required()});
  const endDateSchema = Joi.object().keys({endDate: Joi.string().alphanum().min(1).max(30).required()});

  const weekdayValidationResult = Joi.validate({weekday: weekday}, weekdaySchema);
  const startDateValidationResult = Joi.validate({startDate: startDate}, startDateSchema);
  const endDateValidationResult = Joi.validate({endDate: endDate}, endDateSchema);

  if (startDateValidationResult.error || endDateValidationResult.error || weekdayValidationResult.error) {
    res.status(400).send({code: 400, status: "BAD_REQUEST", message: "Invalid data sent"});
    return;
  }

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

  // connect to twitter
  if (!resultUser.accessToken && !resultUser.accessSecret) {
    res.status(428).send({
      code: 428,
      status: "PRECONDITION_REQUIRED",
      message: "Log in to twitter"
    });
    return;
  }

  const connectionArray = db.getUserConnectionByWeekday(req.app.locals.userId, weekday)
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

  if (typeof connectionArray === "undefined") {
    return;
  }

  const twitterClient = new Twitter({
    consumer_key: config.apiKey,
    consumer_secret: config.apiSecret,
    access_token_key: resultUser.accessToken,
    access_token_secret: resultUser.accessSecret
  });

  let reportArray = [];
  const week = "Week - {}-{}\n\n".format(startDate, endDate);
  for (let connection in connectionArray) {
    const reportName = connection.hashTag + "__" + startDate + "-" + endDate;
    let reportData = "Twitter Campaign\n" + week;

    const tweetsResult = await twitterClient.getHomeTimelineAsync().catch(error => {
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

    if (typeof tweetsResult === "undefined") {
      return;
    }

    for (let tweet in tweetsResult) {
      const created_at = datetime.datetime(tweet.created_at.year, tweet.created_at.month, tweet.created_at.day,)
    }




router.use("/:reportId", retrieveParams);

router.delete("/:reportId", async (req, res) => {
  const resultReport = await db.deleteReportById(req.parentRouterParams.reportId)
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
    res.status(200).send({success: true});
  }
});

router.get("/:reportId", async (req, res) => {
  const resultReport = await db.getReportById(req.parentRouterParams.reportId)
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
    res.status(200).send(converter.reportJsonToObj(resultReport));
  }
});

router.get("/", async (req, res) => {
  const resultReport = await db.getReportByUserId(req.app.locals.userId)
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
    res.status(200).send(converter.reportShortJsonToObj(resultReport));
  }
});

router.get("/all", async (req, res) => {
  const resultReport = await db.getReportByUserId(req.app.locals.userId)
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

  let allReportsData = "";

  for (let report in resultReport) {
    allReportsData += report.name + "\n" + report.data + "\n\n";
  }

  if (typeof resultReport !== "undefined") {
    res.status(200).send({data: allReportsData});
  }
});

router.delete("/all", async (req, res) => {
  const resultReport = await db.deleteAllReports(req.app.locals.userId)
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
    res.status(200).send({success: true});
  }
});

module.exports = router;
