// LeadFlow Server-side Authorization & Multi-tenant Middleware
import { NextRequest, NextResponse } from 'next/server';

export interface AuthSession {
  userId: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'SALES_MANAGER' | 'SALES_USER';
  isImpersonating?: boolean;
  impersonatedBy?: string;
}

// Simulated active session for client runtime & API context
export function getAuthSession(req?: NextRequest): AuthSession {
  // Check for impersonation header or token in request
  const impersonateTenant = req?.headers.get('x-impersonate-tenant');
  const roleHeader = req?.headers.get('x-user-role');
  const tenantHeader = req?.headers.get('x-tenant-id');

  if (roleHeader === 'SUPER_ADMIN') {
    if (impersonateTenant) {
      return {
        userId: 'user-super-admin',
        tenantId: impersonateTenant,
        name: 'Super Admin (Impersonating)',
        email: 'admin@leadflow.io',
        role: 'CLIENT_ADMIN',
        isImpersonating: true,
        impersonatedBy: 'user-super-admin'
      };
    }
    return {
      userId: 'user-super-admin',
      tenantId: 'system',
      name: 'System Administrator',
      email: 'admin@leadflow.io',
      role: 'SUPER_ADMIN'
    };
  }

  // Default to Client Admin of Apex Real Estate for local dev demonstration
  return {
    userId: 'user-client-1',
    tenantId: tenantHeader || 'tenant-101',
    name: 'Vikram Sharma',
    email: 'vikram@apexrealestate.com',
    role: 'CLIENT_ADMIN'
  };
}

// Role-Based Authorization Guard
export function authorizeRole(session: AuthSession, allowedRoles: AuthSession['role'][]): boolean {
  if (session.role === 'SUPER_ADMIN') return true; // Super admin possesses master access
  return allowedRoles.includes(session.role);
}

// Tenant Data Filter Guard
export function scopeTenantQuery(session: AuthSession, requestedTenantId?: string): string {
  if (session.role === 'SUPER_ADMIN' && (!requestedTenantId || requestedTenantId === 'system')) {
    return 'system';
  }
  if (session.role === 'SUPER_ADMIN' && requestedTenantId) {
    return requestedTenantId;
  }
  // Clients are strictly locked to their session tenantId
  return session.tenantId;
}
