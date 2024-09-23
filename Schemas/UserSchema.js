const mongoose = require('mongoose');
const { Schema } = mongoose;

const SignupSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    mobile: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/default-profile.png?alt=media&token=e91050e8-f98e-42d8-9265-be2660bba412', 
    },
    bio: {
        type: String,
        default: 'Add bio!', // Default bio
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User', 
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User', 
    }],
});

module.exports = mongoose.model('User', SignupSchema);
