
// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
    try {
      const notificationId = req.params.notificationId;
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      notification.status = 'read';
      await notification.save();
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
