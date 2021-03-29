const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema; //Schema 중에 Types 중의 ObjectId를 가져오겠다..  머리에 넣어!
const chatSchema = new Schema({
    room: {
        type: ObjectId,
        require: true,
        ref: 'Room'
    },
    user: {
        type: String,
        required: true
    },
    chat: String, //채팅 메시지 혹은 gif 하나만을 보내게 할것임 카톡처럼
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', chatSchema);


