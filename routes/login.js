var express = require('express');
var router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');


/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    res.render('login', { layout: 'index'});
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login'
  }), function (req, res) {
    res.redirect('/');
  });

module.exports = router;