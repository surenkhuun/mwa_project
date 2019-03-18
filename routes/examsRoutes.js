const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const requireAdmin = require('../middlewares/requireAdmin');
const Mailer = require('../services/Mailer');
const examTemplate = require('../services/emailTemplates/examTemplate');
const gradeTemplate = require('../services/emailTemplates/gradeTemplate');
const keys = require('../config/keys');

const Exam = mongoose.model('exams');
const Question = mongoose.model('questions');

module.exports = app => {
  app.post('/api/exams', (req, res) => {
    const { takers } = req.body;

    const filter = { active: true };

    Question.findRandom(filter, {}, {limit: 3}, async (err, questions) => {
      if (err) res.status(500).send("Random questions error");

      try {
        const exam = await new Exam({
          questions,
          takers
        }).save();

        //end exam
        setTimeout(async () => {
          const e = await Exam.findOne({ _id: exam.id });
          e.status = 'FINISHED';
          await e.save();
        }, exam.duration + 10 * 1000);

        takers.forEach(async ({ email, name }) => {
          const data = {
            email,
            name,
            role: 'STUDENT',
            _exam: exam.id
          }

          jwt.sign(data, keys.tokenKey, { expiresIn: exam.duration + 10 * 1000 }, (err, token) => {
            if(err) return res.status(500).send('Token signing failed');

            console.log(email);

            //client needs to set x-access-token!!!
            new Mailer({
              subject: "You have been invited to take an exam",
              recipient: email
            }, examTemplate(token, exam.id)).send();
          });

        });

        res.send(exam);
      } catch(err) {
        res.status(500).send("Can't create the exam");
      }
    });
  });

  app.patch('/api/exams/submit', async (req, res) => {
    const { answers, _exam, timeSpent, timeBlur } = req.body;
    const { email } = req.user;

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

      res.send();
    } catch(err) {
      res.status(402).send('Answer subission error');
    }
  });

  app.patch('/api/exams/evaluate', async (req, res) => {
    const exam = req.body;
    exam.status = 'EVALUATED';
    exam.takers.forEach(taker => {
      new Mailer({
        subject: "Your exam grade is available",
        recipient: taker.email
      }, gradeTemplate(taker.status)).send();
    })

    try {
      await Exam.updateOne(
        { _id: exam._id },
        { ...exam }
      );

      res.send();
    } catch(err) {
      res.status(402).send('Answer subission error');
    }
  })

  app.get('/api/exams', async (req, res) => {
    res.send(await Exam.find({}, { date: 1, status: 1 } ).sort({date: -1}));
  });

  app.get('/api/exams/take', async (req, res) => {
    try {
      const exam = await Exam.findOne(
        {
          _id: req.user._exam,
          'takers.email': req.user.email,
          'takers.$.status': { '$ne': 'ANSWERED' }
        },
        { questions: 1, duration: 1, 'takers.$': 1 }
      );
      res.send(exam)
    } catch(err) {
      res.status(401).send('Not able to take the exam');
    }
    // res.send(await Exam.findOne({ _id: req.user._exam }, { questions: 1 }));
  })

  app.get('/api/exams/:id', requireAdmin, async (req, res) => {
    res.send(await Exam.findOne({ _id: req.params.id }));
  });

}
