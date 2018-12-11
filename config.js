module.exports = {
  secret: "secret for jwt",
  apiKey: "a3zEG7iX5WnsxzzuTIVhoE8U0",
  apiSecret: "ypC7HkzQ0tRhIVWikLrsBFMajAshpdV2KD585XMWTvd8Hiy7Lf",
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
