var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const config = require('../config')
const transporter = nodemailer.createTransport(config.mailer)

/* GET home page. */

router
    .get('/', function(req, res, next) {
    res.render('contacts', {layout : 'index'});
    })
    .post('/', 
        body('email', 'Invalid email').isEmail(),
        body('name', 'Empty name').notEmpty(),
        body('message', 'Empty message').notEmpty(),
        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.render('contacts', {
                    layout : 'index',
                    name: req.body.name,
                    email: req.body.email,
                    message: req.body.message,
                    errorMessages: errors.array()
                })
            } else {
                let mailOptions = {
                    from: 'Code4Share <noreply!@code.com',
                    to: '288cdadb04-781dd1@inbox.mailtrap.io',
                    subject: 'You got a new message from visitor',
                    text: req.body.message

                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if(err) {
                        return console.log(error)
                    }
                    res.render('thank', {layout : 'index'})
                });

            }
    })

module.exports = router;
