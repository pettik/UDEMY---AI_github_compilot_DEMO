const User = require("../models/user");
const users = require("../app");

// ...existing code...

const signup = (req, res) => {
  const { username, password } = req.body;
  const newUser = { ...User, username, password };
  users.push(newUser);
  res.status(201).send("User registered successfully");
};

const login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.status(200).send("Login successful");
  } else {
    res.status(401).send("Invalid credentials");
  }
};

module.exports = {
  signup,
  login,
};
