const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    //authorization is case insensitive
    const decodedToken = jwt.verify(token, 'fuckingseCREttokenitisdontmess');
    //we can create a new element in request body
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();

  } catch(error) {
    res.status(401).json({message: "Auth Failed!at tokens"});
  }
};
