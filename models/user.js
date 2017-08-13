const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('passport-jwt')


const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	email: String,
	username: String,
	password: String
})

const User = module.exports = mongoose.model('user', userSchema)

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

module.exports.findByUserName = (username, callback) => {
	let query = {
		username: username
	}
	User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			newUser.password = hash; 
			newUser.save(callback);
			console.log("Hello???")
		})
	})
}

module.exports.comparePassword = function(password, hashedPassword, callback) {
	bcrypt.compare(password, hashedPassword, (err, isMatch) => {
		if (err) { 
			callback(err, null)
		} else {
			callback(null, isMatch)
		}
	})
}