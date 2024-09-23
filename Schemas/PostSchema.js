const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    ProfilePicture: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);
