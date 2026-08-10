export const getPasswordRulesCol1 = (password) => [
  { label: 'At least 8 characters', met: password.length >= 8 },
  { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
  { label: 'Lowercase letter', met: /[a-z]/.test(password) },
];

export const getPasswordRulesCol2 = (password) => [
  { label: 'Number', met: /\d/.test(password) },
  { label: 'Special character', met: /[^a-zA-Z\d]/.test(password) },
];
