// Validation utility functions

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validates required fields
 * @param {object} data - Object with data to validate
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - Validation result with isValid and message
 */
export const validateRequiredFields = (data, requiredFields) => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, message: 'Invalid data provided' };
  }
  
  const missingFields = requiredFields.filter(field => 
    !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')
  );
  
  if (missingFields.length > 0) {
    return { 
      isValid: false, 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }
  
  return { isValid: true, message: 'All required fields provided' };
};

/**
 * Sanitizes string input
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validates user role
 * @param {string} role - Role to validate
 * @returns {boolean} - True if valid role
 */
export const isValidRole = (role) => {
  const validRoles = ['student', 'teacher', 'admin'];
  return validRoles.includes(role);
};
