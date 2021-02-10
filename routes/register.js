var express = require('express');
var router = express.Router();
const passport = require('passport');
const { body, check, oneOf, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', {layout : 'index',  errorMessages: []});
});

router.post('/', 
[check('name', 'Empty Name').notEmpty(),
check('email', 'Empty Email').isEmail(),
check("password", "invalid password")
.isLength({ min: 4 })
.custom((value,{req, loc, path}) => {
    if (value !== req.body.passwordConfirm) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match");
    } else {
        return value;
    }
}),
  check('passwordConfirm', 'Password confirm is empty').notEmpty()],
(req, res, next) => {
  

  let errors = validationResult(req);
  console.log(errors.errors.len)
  if(errors.errors.length) {
    res.render('register', {
      layout : 'index',
      name: req.body.name,
      email: req.body.email,
      errorMessages: errors.errors
    })
  } else {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(err => {
      if(err) {
        res.render('register', {
          layout : 'index',
          errorMessages: err
        })
      } else {
        
        res.redirect('/login')
      }
    })
  }
});

module.exports = router;