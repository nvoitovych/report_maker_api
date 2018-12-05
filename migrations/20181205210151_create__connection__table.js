
exports.up = (knex, Promise) => {
  return knex.schema.createTable("connection", (table) => {
    table.increments("connection_id"); // id serial primary key
    table.integer("user_id").unsigned();
    table.string("hash_tag").unique();
    table.string("link_to_twitter");
    table.string("report_type");
    table.string("weekday");

    table.foreign("user_id").references("user_id").inTable("user_credentials");
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("connection");
};
