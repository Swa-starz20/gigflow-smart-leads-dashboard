export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Account created successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'You do not have permission to perform this action',
    USER_NOT_FOUND: 'User not found',
  },
  LEADS: {
    CREATED: 'Lead created successfully',
    UPDATED: 'Lead updated successfully',
    DELETED: 'Lead deleted successfully',
    NOT_FOUND: 'Lead not found',
    FETCHED: 'Leads fetched successfully',
    FETCHED_ONE: 'Lead fetched successfully',
    DELETE_FORBIDDEN: 'Sales users cannot delete leads',
  },
  VALIDATION: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
} as const;
