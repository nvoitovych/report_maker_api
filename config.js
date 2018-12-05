module.exports = {
  secret: "secret for jwt",
  apiKey: "85tlTgCiA8zrQDTxXDwPuNdEy",
  apiSecret: "1axQ15ohlmF0USKOTm5bZLApZP2XnLujr7np0SJ0aqmQPvYUPj",
  development: {
    connectionLimit: 50,
    host: "192.168.1.247",
    user: "report_maker_user",
    password: "password",
    database: "report_maker_db"
  },
  development_pool: {
    min: 1,
    max: 50
  }
};
