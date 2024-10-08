const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',  // Array of users who liked the post
    }],
    comments: [{
        pfp : { type :String },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        time: { type: Date, default: Date.now }
    }],
    time: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

module.exports = mongoose.model('Post', PostSchema);
