const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sanitizeString, isValidEmail, isValidUsername, isValidPassword } = require('../utils/validators');

const generateTokens = (res, userId, userRole) => {
    const accessToken = jwt.sign({ id: userId, role: userRole }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

    // Send tokens in secure, HttpOnly cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return { accessToken }; // Return accessToken for client state
};

exports.register = async (req, res) => {
    // 1. Sanitize Inputs
    const username = sanitizeString(req.body.username);
    const email = sanitizeString(req.body.email).toLowerCase();
    const password = sanitizeString(req.body.password);
    
    // 2. Validate Inputs
    if (!isValidUsername(username)) {
        return res.status(400).json({ message: 'Invalid username. Must be 3-20 alphanumeric characters.' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters with one letter and one number.' });
    }
    
    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with that email or username already exists.' });
        }
        
        const user = await User.create({ username, email, password });
        
        generateTokens(res, user._id, user.role);

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, username: user.username, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Account Lockout Check
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(403).json({ 
                message: `Account is locked. Please try again after ${Math.ceil((user.lockedUntil - new Date()) / 60000)} minutes.`
            });
        }
        
        const isMatch = await user.matchPassword(password);
        
        if (isMatch) {
            // Reset failed attempts on successful login
            user.failedLoginAttempts = 0;
            user.lockedUntil = null;
            await user.save();

            const { accessToken } = generateTokens(res, user._id, user.role);

            res.status(200).json({
                message: "Login successful",
                accessToken, // Send AT for immediate use by client state
                user: { id: user._id, username: user.username, role: user.role }
            });
        } else {
            // Handle failed login attempt
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
                user.lockedUntil = new Date(Date.now() + process.env.LOCKOUT_DURATION_MINUTES * 60 * 1000);
            }
            await user.save();
            
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided.' });
    }
    
    // Check if token is blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({ token: refreshToken });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Refresh token is blacklisted. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token.' });
        }

        const { accessToken } = generateTokens(res, user._id, user.role);
        
        res.status(200).json({
            accessToken,
            user: { id: user._id, username: user.username, role: user.role }
        });
        
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
};

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
        // Add token to blacklist to revoke it
        await TokenBlacklist.create({ token: refreshToken });
    }

    // Clear cookies
    res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    
    res.status(200).json({ message: 'Logged out successfully.' });
};