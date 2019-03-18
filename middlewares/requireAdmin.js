module.exports = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(401).send('Access denied');
  next();
};
