const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },  // User receiving the notification
  actionUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },  // User who performed the action
  type: { 
    type: String, 
    enum: ['like', 'comment', 'follow'], 
    required: true 
  },  // Notification type
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' 
  },  // Post related to the notification
  isRead: { 
    type: Boolean, 
    default: false 
  },  // Read status
  createdAt: { 
    type: Date, 
    default: Date.now 
  },  // Timestamp
});

// Populate action user's username and profile picture
notificationSchema.virtual('actionUserDetails', {
  ref: 'User',
  localField: 'actionUser',
  foreignField: '_id',
  justOne: true,
  select: 'username profilePicture'
});

// Populate post image URL
notificationSchema.virtual('postDetails', {
  ref: 'Post',
  localField: 'post',
  foreignField: '_id',
  justOne: true,
  select: 'image'
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
