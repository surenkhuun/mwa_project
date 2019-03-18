const mongoose = require('mongoose');
const Exam = mongoose.model('exams');

module.exports = http => {
  const io = require('socket.io')(http);

  io.on('connection', socket => {
    let data;

    socket.on('disconnect', () => {
      updateExam(data);
    });

    socket.on('data', d => {
      data = d;
    });
  });
}

async function updateExam(data) {
  if (!data) return null;

  const { answers, _exam, timeSpent, timeBlur, email } = data;

  try {
    await Exam.updateOne(
      { _id: _exam, 'takers.email': email },
      {
        'takers.$.status': 'ANSWERED',
        '$inc': {
          'takers.$.timeSpent': timeSpent,
          'takers.$.timeBlur': timeBlur
        },
        'takers.$.answers': answers
      }
    );
  } catch(err) {
    console.log(err);
  }
}
