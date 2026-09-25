const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', isAuthenticated, (request, response) => {
    response.status(200).json({ message: 'Welcome to Hospital API', user: request.user });
});

router.post('/register', async (request, response) => {
    try {
        const { username, email, password } = request.body;

        if (!username) {
            return response.status(400).json({ message: 'Username is required' });
        } else if (!email) {
            return response.status(400).json({ message: 'Email is required' });
        } else if (!password) {
            return response.status(400).json({ message: 'Password is required' });
        }

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return response.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return response.status(400).json({ message: 'Email already exists' });
        }

        const newUser = { username, email, password };
        const user = await User.create(newUser);
        await user.save();

        return response.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.post('/login', passport.authenticate('local', { session: false }), (request, response) => {
    return response.status(200).json({ message: 'Login successful', user: request.user });
});

module.exports = router;
