'use strict'

const express = require('express')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const app = express()
const { User } = require('./db/orm')

const SALT_ROUNDS = 10;

app.set('view engine', 'pug')
////////////////
// Middleware //
////////////////

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

/////////////
// Routes  //
/////////////

// Login
app.get('/login', (req, res) => {
	console.log('get request for /login')
	res.render('login')
})

app.post('/login', (req, res) => {
	console.log('post request coming from /login')
	const {username, password} = req.body
	if(!(username && password)) res.render('login', {err: 'Please enter both username and password'})

	User.findOneByName(username).then(model => {
		if(!model) {
			res.render('login', {err: `There was an error retreiving user ${username}`})
		}
		const hash = model.get('password')
		bcrypt.compare(password, hash, function(err, isMatch) {
			if(!isMatch) {
				res.render('login', {err: `Incorrect password`})
			}
			res.redirect('/home')
		})
	})

})

// Register
app.get('/register', (req, res) => {
	console.log('get request for register')
	res.render('register')
})

app.post('/register', (req, res) => {
	console.log('post request for /register')
	const {username, password} = req.body

	if(!(username && password)) res.render('register', {err: 'Please enter both username and password'})

	User.findOneByName(username).then(model => {
		if(model) res.render('register', {err: `That user is already registered`})
		else bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
		  if(err) console.log(err)
			User.forge({username, password: hash}).save()
			.then(model => res.redirect('/home'))
		});
	})
})

// Home
app.get('/home', (req, res) => {
	console.log('get request for /home')
	res.render('home')
})

// Show 404 page for any other get request
app.use((req, res) => {
	res.render('404')
})



app.listen(3000, console.log('server.js running on port 3000'))
