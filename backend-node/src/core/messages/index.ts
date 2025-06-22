export const MSG = {
    /* ---------- Generic validation ---------- */
    REQUIRED: (field = 'value') => `${field} is required`,
    STRING_MIN: (field = 'value', n = 2) => `${field} must be at least ${n} characters`,
    NUMBER_MIN: (field = 'value', n = 1) => `${field} must be ≥ ${n}`,
    NUMBER_MAX: (field = 'value', n: number) => `${field} must be ≤ ${n}`,
    INVALID_EMAIL: () => `Invalid email address`,

    /* ---------- Business-specific ---------- */
    EMAIL_TAKEN: (email: string) => `Email '${email}' already exists`,
    UNAUTH: () => `You need to log in to access this resource`,

    /* ── Generic HTTP statuses ── */
    BAD_REQUEST: () => 'Bad request',
    UNAUTHORIZED: () => 'Authentication required',
    FORBIDDEN: () => 'You do not have permission to perform this action',
    NOT_FOUND: () => 'Resource not found',
    CONFLICT: () => 'Resource already exists',
    INTERNAL: () => 'Something went wrong. Please try again later.',
} as const;
