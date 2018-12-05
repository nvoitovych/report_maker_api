// Update with your config settings.

module.exports = {
  development: {
    client: "mysql",
    version: "5.7.2",
    connection: {
      connectionLimit: 50,
      socket: "/tmp/mysql.sock", // at home
      user: "report_maker_user",
      password: "password",
      database: "report_maker_db"
    },
    pool: {
      min: 1,
      max: 50
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  },

  production: {
    client: "mysql",
    version: "5.7.2",
    connection: {
      connectionLimit: 50,
      host: "35.204.139.217",
      user: "report_maker_user",
      password: "password",
      database: "report_maker_db"
    },
    pool: {
      min: 1,
      max: 50
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};
