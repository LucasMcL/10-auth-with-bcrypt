'use strict';

const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);

// Allows us to hash the users' passwords before saving them
// bookshelf.plugin(require('bookshelf-bcrypt'));

// Allows us to avoid circular dependencies by referencing object models with string
bookshelf.plugin('registry')

module.exports = { knex, bookshelf };
