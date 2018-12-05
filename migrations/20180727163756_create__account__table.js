
exports.up = (knex, Promise) => {
  return knex.schema.createTable("account", (table) => {
    table.increments("account_id"); // id serial primary key
    table.integer("user_id").unsigned();
    table.string("name");
    table.string("surname");
    table.datetime("created_at").notNullable();
    table.timestamp("updated_at", false);

    table.foreign("user_id").references("user_id").inTable("user_credentials");
  });
};
exports.down = (knex, Promise) => {
  return knex.schema.dropTable("account");
};
