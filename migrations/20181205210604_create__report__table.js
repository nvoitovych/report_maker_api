
exports.up = (knex, Promise) => {
  return knex.schema.createTable("report", (table) => {
    table.increments("report_id"); // id serial primary key
    table.integer("user_id").unsigned();
    table.string("name").unique();
    table.string("data");
    table.date("created_at");

    table.foreign("user_id").references("user_id").inTable("user_credentials");
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("connection");
};
