const mongoose = require('mongoose');
const { Schema } = mongoose;
const random = require('mongoose-simple-random');

const questionSchema = new Schema({
  description: String,
  active: { type: Boolean, default: true }
});

questionSchema.plugin(random);

mongoose.model('questions', questionSchema);

module.exports = questionSchema;
