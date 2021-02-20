const express = require('express');
const postRoutes = express.Router();

let Room = require('./room.model');
let Player = require('./player.model');

// Add a room
postRoutes.route('/add').get(function (req, res) {
    let r = new Room();
    let p = new Player();
    r.members.push(p);
    r.save()
        .then(() => {
            let ret = {};
            ret._id = r._id;
            ret.playerId = p._id;
            res.send(ret);
            console.log("Created Room");
        })
        .catch(() => {
            console.log("Unable to save to db");
            res.status(400).send("Unable to save to the database");
        });
});

// Join a room
postRoutes.route('/join').post(function (req, res) {
    console.log(req.body);
    Room.findById(req.body.id, function (err, r) {
        if (err) {
            res.json(err);
            console.log("Error Joining Room");
        } else {
            let p = new Player();
            r.members.push(p);
            r.save().then(() => {
                res.send(p);
                console.log("Joined Room");
                console.log(r.members);
            }).catch(() => {
                console.log("Unable to save to db");
                res.status(400).send("Unable to save to the database")
            })
        }
    })

});

// Defined get data(index or listing) route
postRoutes.route('/').get(function (req, res) {
    Post.find(function (err, posts) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(posts);
        }
    });
});

// Defined delete | remove | destroy route
postRoutes.route('/delete/:id').delete(function (req, res) {
    Post.findByIdAndRemove({ _id: req.params.id }, function (err) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = postRoutes;