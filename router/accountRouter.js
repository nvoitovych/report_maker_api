const db = require("../db/db");
const converter = require("../helpers/entityMapper");
const express = require("express");
const Joi = require("joi");
const router = express.Router();

router.get("/", async (req, res) => {
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

  // ndCsuA0S00CmUbFMptoNMTw0n
  // Ew3QmRv2ZNRLc3vrm6pjSMahGV7LFV53wktCj9XU9Hnvjp7eIQ

  console.log("resultUser: ", resultUser);
  console.log("resultUser: ", converter.userAccountJsonToObj(resultUser));

  if (typeof resultUser !== "undefined") {
    res.status(200).send(converter.userAccountJsonToObj(resultUser));
  }
});

router.put("/", async (req, res) => {
  const accessToken = req.body.accessToken;
  const accessSecret = req.body.accessSecret;
  const twitterLink = req.body.twitterLink;
  const twitterUsername = req.body.twitterUsername;
  const twitterScreenName = req.body.twitterScreenName;

  const resultUser = await db.updateUser(req.app.locals.userId, accessToken, accessSecret, twitterLink, twitterUsername, twitterScreenName)
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
});

module.exports = router;
