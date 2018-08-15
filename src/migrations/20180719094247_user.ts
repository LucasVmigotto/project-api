import * as Knex from "knex";
import { cipher } from '../utils/crypto'

exports.up = async function (knex: Knex): Promise<any> {
  const exists = await knex.schema.hasTable('user')
  if (exists) return false
  await knex.schema.createTable('user', (table) => {
    table.increments('id')
      .primary()
    table.string('username', 35)
      .notNullable()
      .unique()
    table.string('password')
      .notNullable()
    table.string('name', 50)
      .notNullable(),
    table.datetime('birthday')
    table.timestamp('create_at')
      .notNullable()
      .defaultTo(knex.fn.now())
    table.timestamp('update_at')
  })
  return await knex('user').insert({
    username: process.env.ROOT_USERNAME || 'root',
    password: cipher(process.env.ROOT_USERNAME || 'root',
      process.env.ROOT_PASSWORD || 'rootroot'),
    name: process.env.ROOT_NAME || 'Root',
    birthday: '1997-11-18'
  })
};

exports.down = function (knex: Knex): Promise<any> {
  return knex.schema.dropTable('user')
};
