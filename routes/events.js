import express from 'express';
import * as events from '../controllers/events-controller.js';
import { authenticate } from '../util/auth.js';
import { upload } from '../util/upload.js';

const router = express.Router();

// Create a new event
router.post('/', authenticate, upload.single('image'), events.create);

// Edit an event by id
router.put('/:id', authenticate, upload.single('image'), events.edit);

// Delete an event by id
router.delete('/:id', authenticate, events.deleteItem);

// Get all events
router.get('/', events.getAll);

// Get a single event by id
router.get('/:id', events.getSingle);

router.post('/:id/register', authenticate, events.register);

router.delete('/:id/unregister', authenticate, events.unregister);

export default router;
