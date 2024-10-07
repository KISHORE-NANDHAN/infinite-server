const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token,req.session.user)
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
    if (token) {
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticate;