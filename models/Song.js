const songSchema = new mongoose.Schema({
  // ... existing fields ...
  isApproved: {
    type: Boolean,
    default: false
  },
  isAdminPost: {
    type: Boolean,
    default: false
  }
}); 