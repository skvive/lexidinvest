export const APP_NAME = 'LEXID INVEST';
export const RESOURCE_NAMES = ['projects', 'investors', 'programs', 'applications', 'documents', 'issues'] as const;
export type Resource = (typeof RESOURCE_NAMES)[number];
export const APPLICATION_STATUS = ['planned', 'researching', 'draft', 'needs_review', 'submitted', 'follow_up', 'meeting', 'rejected', 'won', 'withdrawn'] as const;
export const INVESTOR_STATUS = ['new', 'qualified', 'contacted', 'replied', 'meeting', 'inactive'] as const;
export const PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;
export const RISK_STATUS = ['open', 'in_review', 'resolved'] as const;
export function isResource(value: unknown): value is Resource { return typeof value === 'string' && (RESOURCE_NAMES as readonly string[]).includes(value); }
export function displayDate(value: string | null | undefined) { if (!value) return '—'; const date = new Date(value); return Number.isNaN(+date) ? '—' : date.toLocaleDateString('ko-KR', {year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Seoul'}); }
export function deadlineTone(value: string | null | undefined) { if (!value) return 'neutral'; const date = new Date(value); if (date.getTime() < Date.now()) return 'past'; if (date.getTime() - Date.now() < 7*86400e3) return 'urgent'; return 'upcoming'; }
