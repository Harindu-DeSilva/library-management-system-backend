const jwt = require('jsonwebtoken');


exports.verifyToken = async (req,res,next) => {

  try{

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {

      token = req.headers.authorization.split(' ')[1];

    } else if (req.cookies && req.cookies.Authorization) {

      token = req.cookies.Authorization;

    } else {

      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    } 
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    req.token = token;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: err.message });
  }

}