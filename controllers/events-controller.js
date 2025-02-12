import {
  createEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  registerUserForEvent,
  unregisterUserFromEvent,
} from "../models/event.js";

export function create(req, res) {
  const { title, description, address, date } = req.body;
  const image = req.file;

  // Validation
  if (
    !title ||
    !title.trim() ||
    !description ||
    !description.trim() ||
    !address ||
    !address.trim() ||
    !date ||
    isNaN(Date.parse(date)) ||
    !image
  ) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const event = createEvent({
    title: title.trim(),
    description: description.trim(),
    address: address.trim(),
    date,
    image: image.filename,
    userId: req.user.id,
  });
  res.status(201).json(event);
}

export function edit(req, res) {
  const { id } = req.params;
  const { title, description, address, date } = req.body;
  const image = req.file;

  // Validation
  if (
    !title ||
    !title.trim() ||
    !description ||
    !description.trim() ||
    !address ||
    !address.trim() ||
    !date ||
    isNaN(Date.parse(date)) ||
    !image
  ) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const event = getEventById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Forbidden: You are not allowed to edit this event" });
  }

  const updatedEvent = editEvent(id, {
    title: title.trim(),
    description: description.trim(),
    address: address.trim(),
    date,
    image: image.filename,
  });

  res.status(200).json(updatedEvent);
}

export function deleteItem(req, res) {
  const { id } = req.params;

  const event = getEventById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Forbidden: You are not allowed to delete this event" });
  }

  const success = deleteEvent(id);
  if (success) {
    res.status(200).json({ message: "Event deleted successfully" });
  } else {
    res.status(500).json({ message: "Event not deleted" });
  }
}

export function getAll(req, res) {
  const events = getAllEvents();
  res.status(200).json(events);
}

export function getSingle(req, res) {
  const { id } = req.params;
  const event = getEventById(id);
  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
}

export function register(req, res) {
  const { id } = req.params;
  const event = getEventById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const success = registerUserForEvent(id, req.user.id);
  if (success) {
    res.status(201).json({ message: "Registered successfully" });
  } else {
    res.status(500).json({ message: "Registration failed" });
  }
}

export function unregister(req, res) {
  const { id } = req.params;
  const event = getEventById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const success = unregisterUserFromEvent(id, req.user.id);
  if (success) {
    res.status(200).json({ message: "Unregistered successfully" });
  } else {
    res.status(500).json({ message: "Unregistration failed" });
  }
}
