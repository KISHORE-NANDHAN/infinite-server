const express = require('express');
const mongoose = require('mongoose');
const Notification = require('../Schemas/NotificationSchema'); 
const User = require('../Schemas/UserSchema'); 
const Post = require('../Schemas/PostSchema'); 

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, actionUserId, type, postId } = req.body;
    console.log(req.body);
    // Check if all required fields are provided
    if (!userId || !actionUserId || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new notification
    const newNotification = new Notification({
      user: userId,         
      actionUser: actionUserId, 
      type: type,           
      post: postId || null, 
    });

    // Save the notification
    await newNotification.save();
    console.log("success");
    return res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating notification', error });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch notifications, populate actionUser and post details
    const notifications = await Notification.find({ user: userId })
      .populate({
        path: 'actionUser',
        select: 'username profilePicture',  
      })
      .populate({
        path: 'post',
        select: 'image',  
      })
      .sort({ createdAt: -1 });  // Sort by most recent first

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

router.patch('/mark-read/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find the notification and update the isRead status to true
    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    return res.status(500).json({ message: 'Error marking notification as read', error });
  }
});

router.delete('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find and delete the notification
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting notification', error });
  }
});

module.exports = router;
