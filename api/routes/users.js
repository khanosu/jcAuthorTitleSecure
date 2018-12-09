'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('../middleware/verify');

router.post('/signup', (req, res, next) => {

    if (process.env.JCSIGNUP === 'TRUE') {
        bcrypt.hash(req.body.password, 12, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {

                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });

                user.save()
                    .then(results => {
                        console.log(results);
                        res.status(201).json({
                            message: 'user with email ' + user.email + 'created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    })
            }
        });
    } else {
        res.status(200).json({
            message: 'Singup has been disabled'
        });
    }


})

router.get('/', verify, (req, res, err) => {
    User
        .find()
        .exec()
        .then(users => {
            const response = {
                // the left hand side "users" is a key, its not a variable
                // so the left and right users are different
                users: users.map(user => {
                    return {
                        _id: user._id,
                        email: user.email
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/login', (req, res, err) => {
    // if use find, it will return an array, then you need to check array size
    // if use findOne, it returns an object, just check object is null
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Authentication Failed'
                })
            }

            // this compare is not typicall js string compare
            // this use some constant time algorithm to prevent certain attacks like timing attacks
            bcrypt.compare(req.body.password, user.password, (err, result) => {

                if (err) {
                    return res.status(401).json({
                        message: 'Authentication Failed'
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            mail:user.email,
                            userId: user._id
                        },
                        process.env.JC_JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );

                    return res.status(200).json({
                        message: 'Authntication Sucessful',
                        token: token
                    })
                }

                return res.status(401).json({
                    message: 'Authentication Failed'
                });
            });

        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        });
})

module.exports = router;