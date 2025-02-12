import { getDatabase } from '../database.js';

import bcrypt from 'bcryptjs';

export async function createUser(userData) {
  const db = getDatabase();
  const { email, password } = userData;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const stmt = db.prepare(
      'INSERT INTO users (email, password) VALUES (?, ?)'
    );
    const result = stmt.run(email, hashedPassword);
    return { id: result.lastInsertRowid, email };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function verifyUserCredentials(email, password) {
  const db = getDatabase();

  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);

  if (!user) {
    return null; // User not found
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    return { id: user.id, email: user.email };
  } else {
    return null; // Invalid password
  }
}

export function findUserByEmail(email) {
  const db = getDatabase();

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    return user || null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}
