import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abctesttoken'; // Use an environment variable in production

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
}

export function verifyToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}