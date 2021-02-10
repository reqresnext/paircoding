var express = require('express');
const task = require('../models/task');
var router = express.Router();

router.get('/createTask', (req, res) => {
    const newTask = new task();

    newTask.save((err, data) => {
        if(err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/task/' + data._id);
        }
    })
})

router.get('/:id', (req, res) => {
    if(req.params.id) {
        task.findById(req.params.id, (err, data) => {
            if(err) {
                console.log(err)
                res.render('error')
            } 
            if(data) {
                res.render('task', {data, roomId: data.id})
            } else {
                res.render('error')
            }
        })
    } else {
        res.render('error')
    }
})

module.exports = router;