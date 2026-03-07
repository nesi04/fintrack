const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: 6
  },
  currency: { 
    type: String, 
    default: 'USD' 
  },
  avatar: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Simple password hash BEFORE save (NO pre middleware)
userSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(password, salt);
};

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
