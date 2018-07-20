import * as Knex from "knex";

exports.up = async function (knex: Knex): Promise<any> {
  const exists = await knex.schema.hasTable('user')
  if (exists) return false
  return await knex.schema.createTable('user', (table) => {
    table.increments('id')
      .primary()
    table.string('name', 50)
      .notNullable(),
    table.datetime('birthday')
    table.timestamp('create_at')
      .notNullable()
      .defaultTo(knex.fn.now())
    table.timestamp('update_at')
  })
};

exports.down = function (knex: Knex): Promise<any> {
  return knex.schema.dropTable('user')
};
