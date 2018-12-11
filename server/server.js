const app = require("./app");
const port = 8000;

const server = app.listen(port, () => {
  console.log("Server is running...");
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
});

module.exports = server;
