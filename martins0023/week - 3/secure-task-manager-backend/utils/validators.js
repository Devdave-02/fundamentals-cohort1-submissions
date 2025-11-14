// --- Custom Validators (No Libraries) ---

/**
 * Sanitizes a string by trimming whitespace.
 * A real-world app would do more (e.g., escape HTML).
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim();
};

/**
 * Validates an email format using a simple regex.
 */
const isValidEmail = (email) => {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates a username.
 * Rules: 3-20 characters, alphanumeric only.
 */
const isValidUsername = (username) => {
    if (typeof username !== 'string') return false;
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return usernameRegex.test(username);
};

/**
 * Validates password strength.
 * Rules: Min 8 characters, at least one letter and one number.
 */
const isValidPassword = (password) => {
    if (typeof password !== 'string') return false;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

module.exports = {
    sanitizeString,
    isValidEmail,
    isValidUsername,
    isValidPassword
};