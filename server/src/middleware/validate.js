// Input validation utilities
const isEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRegister = (req, res, next) => {
  const { name, email, password, companyName } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push('Full name must be at least 2 characters');
  if (!email || !isEmail(email)) errors.push('Valid email address is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  if (!companyName || companyName.trim().length < 2) errors.push('Company name is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('. '), errors });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isEmail(email)) errors.push('Valid email address is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('. '), errors });
  }

  next();
};

export const validateLead = (req, res, next) => {
  const { name, company, email, value } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) errors.push('Lead contact person name is required');
  if (!company || company.trim().length === 0) errors.push('Company name is required');
  if (email && !isEmail(email)) errors.push('Valid email address required');
  if (value !== undefined && (isNaN(Number(value)) || Number(value) < 0)) {
    errors.push('Lead estimated deal value must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('. '), errors });
  }

  next();
};

export const validateDeal = (req, res, next) => {
  const { title, companyName, value } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) errors.push('Deal title is required');
  if (!companyName || companyName.trim().length === 0) errors.push('Associated company name is required');
  if (value === undefined || isNaN(Number(value)) || Number(value) <= 0) {
    errors.push('Deal value must be greater than 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('. '), errors });
  }

  next();
};

export const validateContact = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) errors.push('Contact full name is required');
  if (email && !isEmail(email)) errors.push('Valid email address is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('. '), errors });
  }

  next();
};

export const validateTask = (req, res, next) => {
  const { title, dueDate } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) errors.push('Task title is required');
  if (!dueDate) errors.push('Due date is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('. '), errors });
  }

  next();
};

