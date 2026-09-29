import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthSession(req);
    if (session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }
    const clients = await db.tenant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getAuthSession(req);
    if (session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await req.json();
    
    // Create Tenant and User in a transaction
    const newTenant = await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: body.name || body.businessName,
          email: body.email,
          phone: body.phone,
          plan: body.plan || 'PRO',
          status: body.status || 'ACTIVE',
          leadLimit: body.leadLimit || 5000,
          whatsAppNumber: body.whatsAppNumber || body.phone,
          timezone: body.timezone || 'Asia/Kolkata',
          settings: body.settings || {},
          businessCategory: body.businessCategory || 'GENERAL_CRM'
        }
      });

      await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: body.clientName || `${body.name || body.businessName} Admin`,
          email: body.email,
          phone: body.phone,
          password: body.password || 'password123',
          role: 'CLIENT_ADMIN',
          status: 'ACTIVE'
        }
      });

      await tx.auditLog.create({
        data: {
          tenantId: tenant.id, // Or 'system' but we need a valid tenant ID or adjust schema if 'system' is used. Actually Prisma expects a valid relation. We'll use the created tenant's ID.
          actorId: session.userId,
          actorName: session.name,
          actorRole: session.role,
          action: 'CREATE_CLIENT',
          entity: 'Tenant',
          entityId: tenant.id
        }
      });

      return tenant;
    });

    return NextResponse.json({ success: true, tenant: newTenant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getAuthSession(req);
    if (session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await req.json();
    const { id, businessName, email, phone, plan, businessCategory, password, clientName } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Tenant ID is required' }, { status: 400 });
    }

    const updatedTenant = await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.update({
        where: { id },
        data: {
          name: businessName,
          email,
          phone,
          plan,
          businessCategory
        }
      });

      // Update the main CLIENT_ADMIN user if they are changing password or name
      const adminUser = await tx.user.findFirst({
        where: { tenantId: id, role: 'CLIENT_ADMIN' }
      });

      if (adminUser) {
        const userUpdateData: any = {
          email,
          phone
        };
        if (password) {
          userUpdateData.password = password;
        }
        if (clientName) {
          userUpdateData.name = clientName;
        }

        await tx.user.update({
          where: { id: adminUser.id },
          data: userUpdateData
        });
      }

      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          actorId: session.userId,
          actorName: session.name,
          actorRole: session.role,
          action: 'UPDATE_CLIENT',
          entity: 'Tenant',
          entityId: tenant.id
        }
      });

      return tenant;
    });

    return NextResponse.json({ success: true, tenant: updatedTenant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
