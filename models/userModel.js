const mongoose = require('mongoose');

const defaultProfileImgUrl = 'https://i.pinimg.com/564x/93/cd/78/93cd78fa2a6fe7a0f1105480ecc4f2df.jpg';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  groupName: { type: String, ref: 'Cart' },
  pname: { type: String, required: true },
  pimgUrl: { type: String, default: defaultProfileImgUrl }, 
}, { collection: 'users' });

// Pre-save hook to set default profile image URL if not provided
userSchema.pre('save', function (next) {
  if (!this.pimgUrl || this.pimgUrl.trim() === '') {
    this.pimgUrl = defaultProfileImgUrl;
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
