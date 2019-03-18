const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");

const keys = require('../config/keys');
const Mailer = require('../services/Mailer');
const registrationTemplate = require('../services/emailTemplates/registrationTemplate');
const requireAdmin = require('../middlewares/requireAdmin');

const User = mongoose.model("users");

module.exports = app => {
  app.get('/auth/me', (req, res) => {
    res.send({
      ...req.user,
      password: null,
      _id: null
    });
  });

  app.get('/auth/users', async (req, res) => {
    res.send(await User.find({}, {password: 0, _id: 0}));
  })

  app.post('/auth/login', async (req, res) => {
    if (req.user) res.status(401).send('Already logged in');

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).send('No user found.');

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return res.status(401).send();

    jwt.sign(user._doc, keys.tokenKey, { expiresIn: '1h' }, (err, token) => {
      if(err) return res.status(500).send('Token signing failed');
      res.send({ token });
    });
  });

  app.post('/auth/register', requireAdmin, async (req, res) => {
    const { name, email, role = 'staff' } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(403).send('User already exists');

    const password = Math.random().toString();
    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = await new User({
      name,
      email,
      role,
      password: hashedPassword
    }).save();

    new Mailer({
      subject: 'Complete your registration',
      recipient: email
    }, registrationTemplate({
      name,
      password
    })).send()

    res.send(newUser);
  });

  app.patch('/auth/update-password', async (req, res) => {
    const { newPassword, currentPassword } = req.body;

    const user = await User.findOne({ email: req.user.email });
    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);

    if (!passwordIsValid) return res.status(401).send('Password is wrong');

    user.password = bcrypt.hashSync(newPassword, 8);
    user.save();

    res.send();
  });

  app.patch('/auth/update', requireAdmin, async (req, res) => {
    try {
      await User.updateOne({ email: req.body.email }, {
        ...req.body
      });
    } catch(err) {
      res.status(403).send("No such user");
    }

    res.send();
  });

  app.patch('/auth/remove', requireAdmin, async (req, res) => {
    try {
      await User.remove({ email: req.body.email });
      res.send();
    } catch(err) {
      res.status(403).send("No such user")
    }
  })
};
