const mongoose = require("mongoose");

const Question = mongoose.model("questions");
const requireAdmin = require('../middlewares/requireAdmin');

module.exports = app => {
  app.post('/api/questions', requireAdmin, async (req, res) => {
    const { description } = req.body;

    try {
      await new Question({
        description
      }).save();
    } catch(err) {
      res.status(500).send("Can't create the question");
    }

    res.send();
  });

  app.patch('/api/questions', requireAdmin, async (req, res) => {
    try {
      await Question.updateOne({ _id: req.body._id }, {
        ...req.body
      });
    } catch(err) {
      res.status(500).send("Can't update the question");
    }

    res.send();
  });

  app.patch('/api/questions/remove', requireAdmin, async (req, res) => {
    const { _id } = req.body;

    try {
      await Question.deleteOne({ _id });
    } catch(err) {
      res.status(500).send("Can't delete the question")
    }

    res.send();
  });

  app.get('/api/questions', requireAdmin, async (req, res) => {
    res.send(await Question.find({}));
  });

  app.get('/api/questions/:id', requireAdmin, async (req, res) => {
    res.send(await Question.find({ _id: req.params.id }));
  });
}
