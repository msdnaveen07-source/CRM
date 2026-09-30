import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession, scopeTenantQuery } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthSession(req);
    const { searchParams } = new URL(req.url);
    const requestedTenant = searchParams.get('tenantId') || undefined;
    const tenantId = scopeTenantQuery(session, requestedTenant);

    if (tenantId === 'system') {
      return NextResponse.json({ success: true, team: [] });
    }

    const team = await db.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getAuthSession(req);
    const body = await req.json();
    
    // Only TENANT_ADMIN or SUPER_ADMIN should create team members in a real app,
    // but we use the scoped tenant ID to ensure they only create within their tenant.
    const tenantId = scopeTenantQuery(session, body.tenantId);
    if (tenantId === 'system') {
      return NextResponse.json({ success: false, error: 'Must provide a valid tenantId' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }

    const newUser = await db.user.create({
      data: {
        tenantId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password || 'password123', // In real app, hash this!
        role: body.role || 'SALES_USER',
        status: body.status || 'ACTIVE'
      }
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
