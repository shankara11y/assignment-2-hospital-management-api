const express = require("express");
const User = require("../models/User");
const router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");


const requestLogger = (request, response, next) => {
    console.log("Request URL:", request.url);
    console.log("Request Method:", request.method);
    console.log("Date:", new Date().toLocaleString());

    next();
};

router.use(requestLogger);


passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });

            if (!user) {
                return done(null, false, {
                    message: "Incorrect username"
                });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return done(null, false, {
                    message: "Incorrect password"
                });
            }

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    })
);


router.use(passport.initialize());


const isAuthenticated = passport.authenticate("local", {
    session: false
});


router.get("/", (request, response) => {
    try {
        response.status(200).send("Welcome to Hospital API");
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    }
});


router.post("/register", async (request, response) => {
    try {

        const { username, email, password } = request.body;

        if (!username || !email || !password) {
            return response.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUsername = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUsername) {
            return response.status(400).json({
                message: "Username already exists"
            });
        }

        if (existingEmail) {
            return response.status(400).json({
                message: "Email already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hashPassword
        };

        const user = new User(newUser);

        await user.save();

        response.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});


router.post("/login", async (request, response) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return response.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return response.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Compare entered password with hashed password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return response.status(401).json({
                message: "Invalid username or password"
            });
        }

        return response.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;