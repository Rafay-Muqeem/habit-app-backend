const mongoose = require('mongoose');
const { Schema } = mongoose;

const HabitSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    streak:{
        type: Number,
        default: 0,
        required: true
    },
    done:{
        type: Boolean,
        default: false
    },
    AddedDate:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('habit', HabitSchema);