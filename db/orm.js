'use strict'

const { bookshelf } = require('./bookshelf.js')

////////////
// Models //
////////////

const User = bookshelf.Model.extend({
	tableName: 'users'
	// bcrypt: { field: 'password' }
}, {
  findOneByName: function(username) {
    return this.forge().query({where:{ username }}).fetch()
  }
})

bookshelf.model('User', User)

module.exports = { User }
