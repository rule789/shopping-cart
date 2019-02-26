var express = require('express');
var {body, check, validationResult} = require('express-validator/check');
var {mongoose} = require('../model/connect.js');
var {User} = require('../model/userModel.js');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send();
});


// register
router.get('/register', function(req, res, next){
  res.render('register', {
    title: 'Register',
  });
});


router.post('/register', function(req, res, next){
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // console.log(newUser.name);
  // newUser.speak();
  newUser.createUser()
    .then((user) => {
      console.log('user');
    })
    .catch((e) => {
      console.log(e);
    });

  req.flash('success', 'register success');
  res.redirect('/');
});


// login
router.get('/login', function(req, res, next){
  res.render('login', {title: 'Login'});
});

module.exports = router;
