const express = require("express");

const db = require("../db/db");

const router = express.Router();
const userAuth = require("../middleware/userAuth");
const connectionRouter = require("./connectionRouter");
const reportRouter = require("./reportRouter");
const accountRouter = require("./accountRouter");
// const relationshipsRouter = require("./relationshipsRouter");
// const myselfCoordinatesRouter = require("./myselfCoordinatesRouter");

router.use(userAuth);

router.get("/index/", async (req, res) => {
  if (typeof resultAccount !== "undefined") {
    res.status(200).send({data: "Some static data"});
  }
});

router.use("/connection/", connectionRouter);
router.use("/report/", reportRouter);
router.use("/account/", accountRouter);

module.exports = router;
