const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, requried: true},
    age: {type: String, requried: true}
})

module.exports = mongoose.model('Person', personSchema); 
// The mongoose.model will create a COLLECTION in the DB
// called Products (plural)