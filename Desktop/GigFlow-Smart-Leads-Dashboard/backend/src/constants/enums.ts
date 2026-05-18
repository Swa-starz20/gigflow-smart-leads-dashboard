export const USER_ROLES = ['admin', 'sales'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const SORT_OPTIONS = ['latest', 'oldest'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 50;
