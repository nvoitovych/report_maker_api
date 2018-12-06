const config = require("../config");
const db = require("../db/db");
const converter = require("../helpers/entityMapper");
const express = require("express");
const Joi = require("joi");
const moment = require("moment");
const retrieveParams = require("../middleware/retrieveParams");
const router = express.Router();
const BlueBird = require("bluebird");
const Twitter = require("twit");

router.post("/", async (req, res) => {
  const weekday = req.body.weekday;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  // const weekdaySchema = Joi.object().keys({weekday: Joi.string().alphanum().min(1).max(100).required()});
  // const startDateSchema = Joi.object().keys({startDate: Joi.string().alphanum().min(1).max(100).required()});
  // const endDateSchema = Joi.object().keys({endDate: Joi.string().alphanum().min(1).max(30).required()});

  const weekdaySchema = Joi.object().keys({weekday: Joi.string().required()});
  const startDateSchema = Joi.object().keys({startDate: Joi.string().required()});
  const endDateSchema = Joi.object().keys({endDate: Joi.string().required()});

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

  const connectionArray = await db.getUserConnectionByWeekday(req.app.locals.userId, weekday)
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
    access_token: resultUser.accessToken,
    access_token_secret: resultUser.accessSecret
  });

  let reportArray = [];
  let isError = false;
  const week = "Week --- " + startDate + "---" + endDate + "\n\n";
  const linkToUserTwitterAccount = "https://twitter.com/" + resultUser.twitterScreenName;
  const fullLinkToTweet = linkToUserTwitterAccount + "/status/";

  for (let index in connectionArray) {
    let connection = connectionArray[index];
    const reportName = connection.hashTag + "__" + startDate + "-" + endDate;
    let reportData = "Twitter Campaign\n" + week;

    let tweetArray = [];
    let retweetArray = [];
    let fullLinkToSourceOfRetweet = connection.twitterLink;

    const sinceFormated = await moment(startDate).format("YYYY-MM-DD");
    const tweetsResult = await twitterClient.get("statuses/user_timeline", { q: "since:2011-07-11" + sinceFormated, count: 100 })
      .catch(error => {
        console.log("Error in tweetsResult: ", error);
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

    // const result = twitterClient.get("account/verify_credentials", { skip_status: true })
    //   .catch(function (err) {
    //     console.log("caught error", err.stack);
    //   })
    //   .then(function (result) {
    //     // `result` is an Object with keys "data" and "resp".
    //     // `data` and `resp` are the same objects as the ones passed
    //     // to the callback.
    //     // See https://github.com/ttezel/twit#tgetpath-params-callback
    //     // for details.
    //
    //     console.log("data", result.data);
    //   });

    if (typeof tweetsResult === "undefined") {
      return;
    }

    for (let tweet in tweetsResult) {
      let fullLinkToSourceOfRetweet = "";
      const createdAt = moment(tweet.created_at, "dd MMM DD HH:mm:ss ZZ YYYY", "en");
      const startDateFormated = moment(startDate).format("YYYY-MM-DD");
      const endDateFormated = moment(endDate).format("YYYY-MM-DD");
      if (createdAt >= startDateFormated && createdAt <= endDateFormated) {
        let isRetweet = false;

        if (typeof (tweet.quoted_status) !== "undefined") {
          isRetweet = true;
          fullLinkToSourceOfRetweet = "https://twitter.com/" + tweet.quoted_status.user.screen_name;
        } else if (typeof (tweet.retweeted_status) !== "undefined") {
          isRetweet = true;
          fullLinkToSourceOfRetweet = "https://twitter.com/" + tweet.retweeted_status.user.screen_name;
        } else {
          fullLinkToSourceOfRetweet = "";
        }

        for (let hashTag in tweet.entities["hashtags"]) {
          if (!isRetweet && hashTag.text === connection.hashTag) {
            tweetArray.push(tweet);
          }
        }

        if (connection.twitterLink === fullLinkToSourceOfRetweet) {
          retweetArray.push(tweet);
        }
      }
    }

    if (isError) {
      return;
    }

    reportData += "\n\nTweets\n";
    for (let tweet in tweetArray) {
      reportData += fullLinkToTweet + tweet.id;
    }
    reportData += "\n\nRetweets\n";
    for (let retweet in retweetArray) {
      if (typeof (retweet.retweeted_status) !== "undefined") {
        reportData += fullLinkToSourceOfRetweet + "/status/" + retweet.retweeted_status.id_str;
      } else {
        reportData += fullLinkToSourceOfRetweet + "/status/" + retweet.quoted_status.id_str;
      }
    }

    reportArray.push(converter.reportShortObjToJson({
      "userId": req.app.locals.userId,
      "data": reportData,
      "name": reportName,
      "createdAt": new Date()
    }));
  }

  if (typeof (reportArray[0]) === "undefined") {
    res.status(200).send([]);
  } else {
    const reportResult = db.createReport(reportArray, req.app.locals.userId)
      .catch(error => {
        // console.log("error: ", error);
        switch (error.errno) {
          case "ER_DUP_ENTRY": {
            console.log("Bla:");
            res.status(409).send({
              code: 409,
              status: "CONFLICT",
              message: "Report with same name already exists"
            });
            break;
          }
          default: {
            res.status(500).send({
              code: 500,
              status: "INTERNAL_SERVER_ERROR",
              message: "Internal server error"
            });
          }
        }
      });

    if (typeof (reportResult) !== "undefined") {
      res.status(200).send(reportResult);
    }
  }
});

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
