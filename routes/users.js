const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const passport = require('passport')

router.post("/registration", (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	})
	User.addUser(newUser, (err) => {
		if (err) {
			res.json({'success': 'failure', 'message': 'unsuccessful'})
		} else {
			res.json({'success' : 'sucessful', 'message': 'successful'})
		}
	})
})

router.post("/authenticate", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findByUserName(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({success: false, msg: 'User not found.'})
		} else {
			User.comparePassword(password, user.password, (err, isMatch) => {
				if (err) throw err;
				if(isMatch) {
					const token = jwt.sign(user, db.secret, {
						expiresIn: 604800
					});

					res.json({
						success: true,
						token: "JWT " + token,
						user: {
							id: user._id,
							name: user.name,
							username: user.username, 
							email: user.email
						}
					});
				} else {
					return res.json({success: false, msg: 'wrong password'})
				}
			})
		}
	})
})

router.get("/profile", passport.authenticate('jwt', {session:false}), (req, res, next) => {
	res.json({user: req.user})
})

module.exports = router;