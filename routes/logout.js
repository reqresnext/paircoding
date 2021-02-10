var express = require('express');
var router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');


/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    req.logout();
    res.redirect('/');
  })

module.exports = router;