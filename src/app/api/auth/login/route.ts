import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    // Special case for Super Admin demo if not in database
    if (email === 'admin@leadflow.io' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'user-super-admin',
          tenantId: 'system',
          name: 'System Administrator',
          email: 'admin@leadflow.io',
          role: 'SUPER_ADMIN',
          businessCategory: 'GENERAL_CRM'
        }
      });
    }

    // Find the user in the database
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Simple password check (In a real app, use bcrypt)
    if (user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Get the tenant for the business category
    const tenant = await db.tenant.findUnique({
      where: { id: user.tenantId }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        tenantId: user.tenantId,
        name: user.name,
        email: user.email,
        role: user.role,
        businessCategory: tenant?.businessCategory || 'GENERAL_CRM',
        tenantName: tenant?.name
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
