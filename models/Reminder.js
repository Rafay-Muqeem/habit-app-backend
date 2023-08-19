const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReminderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'habit'
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
});

module.exports = mongoose.model('reminder', ReminderSchema);