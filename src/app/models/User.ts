// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    select: false, // Prevents password from being sent in queries by default
  },
  role: {
    type: String,
    enum: ["Manager", "Staff"],
    default: "Staff",
    required: true
  }

}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);