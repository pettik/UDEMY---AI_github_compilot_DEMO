import { createUser, findUserByEmail, verifyUserCredentials } from '../models/user.js';
import { generateToken } from '../util/auth.js';

export async function signup(req, res) {
  const { email, password } = req.body;
  
  // Check if email and password are not empty or just whitespace
  if (!email || !email.trim() || !password || !password.trim()) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Check password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // Check if email already exists
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already taken' });
  }
  
  try {
    const newUser = await createUser({ email, password });
    const token = generateToken(newUser);
    res.status(201).json({ message: 'User created successfully', user: newUser, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

export async function login(req, res) {
  const { email, password } = req.body;
  
  if (!email || !email.trim() || !password || !password.trim()) {
    return res.status(400).json({ error: 'Email and password are required and cannot be empty' });
  }
  
  try {
    const user = await verifyUserCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email }, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};
