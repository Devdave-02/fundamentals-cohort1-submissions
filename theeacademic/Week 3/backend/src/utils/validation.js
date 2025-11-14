// Simple custom validators and sanitizers to avoid injection attacks.
// No external validation libraries used per requirements.

function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  // Remove control chars and common injection characters
  return input.replace(/[\0\b\t\n\r\x1a]/g, '').trim();
}

function isValidUsername(u) {
  if (typeof u !== 'string') return false;
  const s = sanitizeString(u);
  // alphanumeric, 3-30 chars
  return /^[a-zA-Z0-9_\-]{3,30}$/.test(s);
}

function isValidEmail(e) {
  if (typeof e !== 'string') return false;
  const s = sanitizeString(e);
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s) && s.length <= 254;
}

function isValidPassword(p) {
  if (typeof p !== 'string') return false;
  return p.length >= 8 && p.length <= 128;
}

function validateRegistration({ username, email, password }) {
  const errors = [];
  if (!isValidUsername(username)) errors.push('Invalid username');
  if (!isValidEmail(email)) errors.push('Invalid email');
  if (!isValidPassword(password)) errors.push('Invalid password (min 8)');
  return { valid: errors.length === 0, errors };
}

function validateTask({ title, description }) {
  const errors = [];
  const t = sanitizeString(title);
  const d = sanitizeString(description || '');
  if (!t || t.length > 200) errors.push('Invalid title');
  if (d.length > 2000) errors.push('Description too long');
  return { valid: errors.length === 0, errors, sanitized: { title: t, description: d } };
}

module.exports = { sanitizeString, isValidUsername, isValidEmail, isValidPassword, validateRegistration, validateTask };
