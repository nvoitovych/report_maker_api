
exports.up = (knex, Promise) => {
  return knex.schema.createTable("user_credentials", (table) => {
    table.increments("user_id"); // id serial primary key
    table.string("login").unique();
    table.string("password_hash").notNullable();
    table.string("username");
    table.string("email");
    table.datetime("start_license");
    table.datetime("end_license");
    table.string("secret_token");
    table.string("access_token");
    table.bool("is_banned");
    table.bool("is_admin");
    table.string("twitter_link");
    table.string("twitter_screen_name");
    table.string("twitter_username");
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("user_credentials");
};
