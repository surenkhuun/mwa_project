const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  name: String,
  role: { type: String, enum: ['ADMIN', 'STAFF', 'STUDENT'], default: 'STUDENT' },
  password: String,
  active: { type: Boolean, default: true }
});

mongoose.model('users', userSchema);
