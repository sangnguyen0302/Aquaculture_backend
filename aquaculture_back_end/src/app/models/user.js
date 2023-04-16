const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, maxLength: 255, unique: true },
    password: { type: String, require: true },
    name: { type: String, maxlength: 100, unique: true }
}, {
    timestamps: true
},);

module.exports = mongoose.model('User', User);