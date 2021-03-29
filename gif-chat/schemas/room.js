const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    max: { //최대 수용인원
        type: Number,
        require: true,
        default: 10,
        min: 2
    },
    owner: {
        type: String,
        required: true
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', roomSchema);