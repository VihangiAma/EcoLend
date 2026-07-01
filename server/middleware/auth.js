const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  console.log('🔐 Auth Check:', {
    header: authHeader ? 'Present' : 'Missing',
    allHeaders: Object.keys(req.headers)
  });

  if (!authHeader) {
    console.error('❌ No authorization header provided');
    return res.status(403).json({ error: 'No token provided' });
  }

  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.error('❌ Invalid token format. Expected "Bearer <token>"');
    return res.status(403).json({ error: 'Invalid token format' });
  }

  const token = parts[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ Token verification failed:', err.message);
      return res.status(401).json({ error: 'Unauthorized', details: err.message });
    }
    
    console.log('✅ Token verified for user:', decoded.userId);
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
