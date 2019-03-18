const mongoose = require('mongoose');
const { Schema } = mongoose;
const QuestionSchema = require('./Question');
const keys = require('../config/keys');

const examSchema = new Schema({
  date: { type: Date, default: Date.now},
  duration: { type: Number, default: keys.examDuration},
  questions: [QuestionSchema],
  status: { type: String, enum: ['STARTED', 'FINISHED', 'EVALUATED'], default: ['STARTED'] },
  takers: [{
    name: String,
    email: String,
    status: { type: String, enum: ['SENT', 'ANSWERED', 'PASS', 'FAIL'], default: 'SENT' },
    timeSpent: { type: Number, default: 0 },
    timeBlur: { type: Number, default: 0 },
    answers: [{
      _question: { type: Schema.Types.ObjectId, ref: "Question" },
      timeSpent: { type: Number, defualt: 0 },
      snapshots: [String]
    }]
  }]
});

mongoose.model('exams', examSchema);
