// Business email validation utility
// Prevents generic/disposable email addresses

// Common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
  'throwaway.email', 'yopmail.com', 'getnada.com', 'mailnesia.com',
  'sharklasers.com', 'grr.la', 'guerrillamailblock.com', 'pokemail.net',
  'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com',
  'maildrop.cc', 'mailinator.net', 'mintemail.com', 'mohmal.com',
  'my10minutemail.com', 'tempr.email', 'tmpeml.com', 'tmpmail.org'
]);

// Generic email patterns that suggest personal/non-business use
const GENERIC_PATTERNS = [
  /^[a-z]+[0-9]*@/, // test123@, john123@
  /^[a-z]+[0-9]{2,}@/, // user1234@, admin5678@
  /^[a-z]{1,3}[0-9]{1,3}@/, // ab12@, xyz789@
  /^[a-z]+\.(test|demo|example|sample)@/, // user.test@, demo.example@
  /^[a-z]+(test|demo|example|sample)[0-9]*@/, // usertest@, demouser123@
  /^[a-z]+(admin|user|test|demo|example|sample)[0-9]*@/, // admin123@, user456@
  /^[a-z]{1,2}[0-9]{1,2}[a-z]{1,2}@/, // ab12cd@, xy34z@
];

// Common personal email domains
const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'protonmail.com', 'mail.com', 'live.com', 'msn.com'
]);

// Business email indicators (positive signals)
const BUSINESS_INDICATORS = [
  /^[a-z]+\.[a-z]+@/, // first.last@company.com
  /^[a-z]+[a-z]+@/, // firstlast@company.com
  /^[a-z]+[0-9]{1,2}@/, // firstname12@company.com (reasonable numbers)
];

export interface EmailValidationResult {
  isValid: boolean;
  isBusiness: boolean;
  reason?: string;
  suggestions?: string[];
}

export function validateBusinessEmail(email: string): EmailValidationResult {
  // Input validation
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      isBusiness: false,
      reason: 'Invalid email input'
    };
  }



  const trimmedEmail = email.trim().toLowerCase();
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      isBusiness: false,
      reason: 'Invalid email format'
    };
  }

  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      isBusiness: false,
      reason: 'Invalid email format'
    };
  }
  
  const [, domain] = parts;
  
  // Check for disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      isBusiness: false,
      reason: 'Disposable email addresses are not allowed',
      suggestions: ['Please use your company email address']
    };
  }

  // Check for generic patterns
  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.test(trimmedEmail)) {
      return {
        isValid: false,
        isBusiness: false,
        reason: 'Generic email patterns are not allowed',
        suggestions: ['Please use your company email address']
      };
    }
  }

  // Check for business indicators (positive signals)
  for (const pattern of BUSINESS_INDICATORS) {
    if (pattern.test(trimmedEmail)) {
      return {
        isValid: true,
        isBusiness: true
      };
    }
  }

  // Check for personal domains (block completely)
  if (PERSONAL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      isBusiness: false,
      reason: 'Personal email domains are not accepted',
      suggestions: ['Please use your company email address']
    };
  }

  // If it's not a personal domain and not disposable, it's likely a business email
  // This catches legitimate company domains like nytromarketing.com, acme.com, etc.
  return {
    isValid: true,
    isBusiness: true
  };
}

export function getEmailValidationMessage(result: EmailValidationResult): string {
  if (!result.isValid) {
    return result.reason || 'Invalid email address';
  }
  
  if (!result.isBusiness) {
    return result.reason || 'Please use a business email address';
  }
  
  return '';
}
