'use strict'

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// routes
const personRoutes = require('./api/routes/persons');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://' + process.env.DB_AUTH_JC + '@cluster0-knne7.mongodb.net/AuthorTitle?retryWrites=true', {
    useNewUrlParser: true
});

mongoose.Promise = Promise;

mongoose.connection.once('open', () => {
    console.log('Connection with the db has been made');
}).on('error', (error) => {
    console.log('Connection error ', error);
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/apijc1/persons', personRoutes);
app.use('/apijc1/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'foo working lol'
//     });
// });

module.exports = app;