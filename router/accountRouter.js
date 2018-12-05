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

  if (typeof resultUser !== "undefined") {
    res.status(200).send(converter.userShortArrayForAdminObjToJson(resultUser));
  }
});

module.exports = router;
