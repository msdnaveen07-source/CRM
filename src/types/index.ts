// LeadFlow Production Database Schema & Multi-tenant Store
// Supports tenant isolation, role-based permissions, reconciliation, audit logging & webhooks

export type BusinessCategory = 'REAL_ESTATE' | 'EDUCATION' | 'CONSTRUCTION' | 'SOLAR_ENERGY' | 'FITNESS' | 'HEALTHCARE' | 'GENERAL_CRM';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessCategory?: BusinessCategory;
  plan: 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'INACTIVE' | 'TRIAL' | 'EXPIRED';
  leadLimit: number;
  whatsAppNumber: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  leadCountToday?: number;
  leadCountMonth?: number;
  metaConnected?: boolean;
  whatsAppConnected?: boolean;
  lastSyncAt?: string;
  settings?: TenantSettings;
}

export interface TenantSettings {
  firstResponseDeadlineMinutes: number; // Default 10 mins
  autoAssignment: boolean;
  assignmentStrategy: 'ROUND_ROBIN' | 'MANUAL' | 'CAMPAIGN';
  notifyNewLeadWhatsApp: boolean;
  notifyNewLeadBrowser: boolean;
  notifyMissedLeadWhatsApp: boolean;
  notifyMissedLeadBrowser: boolean;
  notifyFollowupReminder: boolean;
  customStatuses?: string[];
}

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'CLIENT_ADMIN' 
  | 'SALES_MANAGER' 
  | 'SALES_USER'
  | 'TEACHER'
  | 'STUDENT'
  | 'LEAD_MANAGER';

export interface User {
  id: string;
  tenantId: string; // Multi-tenant key ('system' for Super Admin)
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  assignedLeadsCount?: number;
  contactedCount?: number;
  qualifiedCount?: number;
  wonCount?: number;
  avgResponseTimeSeconds?: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  tenantId: string; // Crucial tenant isolation identifier
  metaLeadId?: string; // Platform unique ID to prevent duplicates
  platform: 'META' | 'GOOGLE' | 'WEBSITE' | 'WHATSAPP' | 'MANUAL' | 'CSV_IMPORT';
  fullName: string;
  phone: string;
  email: string;
  location?: string;
  campaignId?: string;
  campaignName?: string;
  adSetId?: string;
  adSetName?: string;
  adId?: string;
  adName?: string;
  formId?: string;
  formName?: string;
  pageId?: string;
  pageName?: string;
  questionsAnswers?: Record<string, string>;
  assignedTo?: string; // User ID
  status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'MEETING' | 'WON' | 'LOST' | 'NOT_INTERESTED' | 'WRONG_NUMBER' | 'DUPLICATE';
  isMissed: boolean;
  missedEscalationLevel?: 'WARNING' | 'URGENT' | 'CRITICAL';
  firstResponseDeadline: string;
  firstContactedAt?: string;
  lastContactedAt?: string;
  nextFollowupAt?: string;
  
  aiScore?: number;
  aiValidationStatus?: 'HOT' | 'JUNK' | 'PENDING';
  aiValidationReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  tenantId: string;
  leadId: string;
  actorName: string;
  type: 'CREATED' | 'ASSIGNED' | 'STATUS_CHANGE' | 'WHATSAPP_SENT' | 'NOTE_ADDED' | 'FOLLOWUP_SCHEDULED' | 'MISSED_ALERT';
  description: string;
  timestamp: string;
}

export interface LeadNote {
  id: string;
  tenantId: string;
  leadId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Followup {
  id: string;
  tenantId: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  assignedTo: string;
  assignedName: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'RESCHEDULED';
  note?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  platform: 'META' | 'GOOGLE';
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  leadsCount: number;
  spend: number;
  cpl: number;
  contactedCount: number;
  qualifiedCount: number;
  wonCount: number;
  conversionRate: number;
}

export interface MetaIntegration {
  tenantId: string;
  connected: boolean;
  pageId?: string;
  pageName?: string;
  adAccountId?: string;
  adAccountName?: string;
  formIds?: string[];
  lastSyncAt: string;
  webhookStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
  tokenStatus: 'VALID' | 'EXPIRED' | 'REVOKED';
  permissionsStatus: 'VALID' | 'MISSING_LEADS_ACCESS';
}

export interface WhatsAppIntegration {
  tenantId: string;
  connected: boolean;
  phoneNumber: string;
  businessAccountId: string;
  phoneNumberId: string;
  notificationPreferences: {
    newLead: boolean;
    missedLead: boolean;
    followupReminder: boolean;
  };
  lastMessageSentAt?: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'TOKEN_EXPIRED';
}

export interface NotificationItem {
  id: string;
  tenantId: string;
  userId?: string;
  title: string;
  message: string;
  category: 'NEW_LEAD' | 'MISSED_LEAD' | 'FOLLOWUP_DUE' | 'META_ERROR' | 'WHATSAPP_ERROR' | 'SYNC_ERROR' | 'SYSTEM_ALERT';
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface SyncRun {
  id: string;
  tenantId: string;
  triggeredBy: 'RECONCILIATION_CRON' | 'WEBHOOK' | 'MANUAL';
  leadsFound: number;
  leadsInserted: number;
  duplicatesSkipped: number;
  errorsCount: number;
  status: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED';
  errorMessage?: string;
  startedAt: string;
  completedAt: string;
}
