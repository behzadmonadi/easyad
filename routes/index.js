let express = require('express');
let bcrypt = require('bcryptjs');

let router = express.Router();

// Models
let User = require('../models/users');

/* GET home page. */
router.get( '/', ( req, res ) => {
	res.render('index', { title:'Easy Ads', user: req.session.user });
});

router.post( '/register', ( req, res ) => {
	let data = req.body.data;

	// Password hash
	const saltRounds = 10;
	bcrypt.hash(req.body.data.password, saltRounds).then((hash) => {
		let user = new User({
			'name': data.name,
			'surname': data.surname,
			'email': data.email,
			'phone': data.phone,
			'password': hash
		});

		user.save((err) => {
			if (err)
				res.send(err);
			else
				res.send({ 'status': 1 });
		});
	});
});

router.post('/login', (req,res) => {
	let data = req.body.data;

	User.findOne({ email: data.email },(err,user) => {
		if(!user){
			res.json({ error: 'Email or password is did not match' });
		}else{
			bcrypt.compare(data.password, user.password, (err, r) => {
				if (r) {
					req.session.user = user;
					res.json({ status: 1 });
				}else{
					res.json({ error: 'Email or password is did not match' });
				}
			});
		}
	});
});

router.get('/logout',  (req,res) => {
	req.session.reset();
	res.redirect('./');
});

module.exports = router;
