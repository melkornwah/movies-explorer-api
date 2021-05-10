const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.json({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    return res.json({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};