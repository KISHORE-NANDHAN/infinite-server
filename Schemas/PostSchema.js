const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Store the filename or path of the image
        required: true
    },
    caption: {
        type: String,
    },
    time: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Post', PostSchema);
