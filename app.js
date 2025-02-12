import express from 'express';
import cors from 'cors';

import usersRoutes from './routes/users.js';
import eventsRoutes from './routes/events.js';
import { initializeDatabase } from './database.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Users routes
app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
  // Initialize database
  try {
    initializeDatabase();
    console.log('Database initialized');
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
});
