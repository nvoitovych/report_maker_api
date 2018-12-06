module.exports = {
  secret: "secret for jwt",
  apiKey: "mEdZHKsDkEV2yBZQVpYWx4mV0",
  apiSecret: "S6AuJGZSkEFMH8OIq1Prj3KijLp8rsEuLaxGWQMzUuZYxBq9L6",
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
