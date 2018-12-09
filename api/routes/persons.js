//@ts-check
'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Person = require('../models/person');

router.get('/', (req, res, next) => {
    // This is for initial testing
    // res.status(200).json({
    //     verb: 'GET',
    //     message:'handling GET requrest to /api/products'
    // });
    Person
    .find()
    .exec()
    .then(docs => {
        const response = {
            persons: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    age: doc.age
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })

});

router.post('/', (req, res, next) => {
    // This is for initial testing
    // const person = {
    //     name: req.body.name,
    //     age: req.body.age
    // }

    const person = new Person({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age
    });

    person
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created person',
            createdPerson: {
                _id: result._id,
                name: result.name,
                age: result.age
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    // res.status(200).json({
    //     name: person.name,
    //     age: person.age
    //})

})

module.exports = router;