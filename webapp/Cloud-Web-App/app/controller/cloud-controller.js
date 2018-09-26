'use strict';
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');

var db = require('../../database/database');
const register = db.register;

exports.createuser = (req, res) => {	
	// Save to PostgreSQL database
	register.find({where :{user_name : req.body.user_name}}).then(log => {
		if(!log)
		{
			const salt = 10;	
			let hash_password = bcrypt.hashSync(req.body.password,salt);
			register.create({
				"user_name": req.body.user_name, 
				"password": req.body.password, 
			}).then(login => {		
					// Send created customer to client
					res.json(login);
				}).catch(err => {``
					console.log(err);
					res.status(500).json({msg: "error", details: err});
				});
		}
		if(log)
		{
			res.json("Account already exists");
		}
		// Send Login details to Client
		
	}).catch(err => {
		console.log(err);
		res.status(500).json({msg: "error", details: err});
	});
	
};

exports.login = (req, res) => {
	const salt = 10;
	var credentials = auth(req);
	// var hash_password = bcrypt.compareSync(req.body.password,salt);
	register.find({where :{user_name : credentials.name,password: credentials.pass}}).then(log => {
	
if(log){
	var date = new Date();

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	var time = (year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec);

		res.json(time);
}
if(!log)
{
	res.json("incorrect username/password");
}
	
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};
exports.checklogin = (req, res) => {
	
	var credentials = auth(req);
	console.log(credentials.name);
	console.log(credentials.pass);

		res.json("Successfull");
}
	


