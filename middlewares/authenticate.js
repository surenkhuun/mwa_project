const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const PERMITTED = [
  '/auth/login'
];

const STUDENT_PERMITTED = [
  '/auth/me',
  '/api/exams/submit',
  '/api/exams/take'
]

module.exports = (req, res, next) => {
  if (PERMITTED.includes(req.url)) return next();

  if (!req.headers.authorization) return res.status(403).send('Access denied');

  const token = req.headers.authorization.replace('Bearer ', '');

  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, keys.tokenKey, function(err, user) {
    if (err) return res.status(403).send('Access denied');

    req.user = user;

    if (user.role === 'STUDENT' && !STUDENT_PERMITTED.includes(req.url)) {
      return res.status(403).send();
    }

    next();
  });
}
