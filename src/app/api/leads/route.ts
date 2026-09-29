import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession, scopeTenantQuery } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthSession(req);
    const { searchParams } = new URL(req.url);
    const requestedTenant = searchParams.get('tenantId') || undefined;
    const tenantId = scopeTenantQuery(session, requestedTenant);

    const whereClause = tenantId === 'system' ? {} : { tenantId };
    
    const leads = await db.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, leads, count: leads.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getAuthSession(req);
    const body = await req.json();

    const tenantId = body.tenantId || session.tenantId;
    if (session.role !== 'SUPER_ADMIN' && tenantId !== session.tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized tenant access' }, { status: 403 });
    }

    let lead;
    let created = false;

    if (body.metaLeadId) {
      const existing = await db.lead.findFirst({
        where: { tenantId, metaLeadId: body.metaLeadId }
      });
      if (existing) {
        lead = await db.lead.update({
          where: { id: existing.id },
          data: { updatedAt: new Date() }
        });
      }
    }

    if (!lead) {
      // Find round robin assignee if not provided
      let assignedToId = body.assignedTo;
      if (!assignedToId) {
        const salesUsers = await db.user.findMany({
          where: { tenantId, role: { in: ['SALES_USER', 'SALES_MANAGER'] }, status: 'ACTIVE' },
          orderBy: { assignedLeadsCount: 'asc' },
          take: 1
        });
        if (salesUsers.length > 0) assignedToId = salesUsers[0].id;
      }

      lead = await db.lead.create({
        data: {
          tenantId,
          metaLeadId: body.metaLeadId,
          platform: body.platform || 'MANUAL',
          fullName: body.fullName || 'Anonymous Lead',
          phone: body.phone || '',
          email: body.email || '',
          location: body.location,
          campaignId: body.campaignId,
          campaignName: body.campaignName,
          adSetId: body.adSetId,
          adSetName: body.adSetName,
          adId: body.adId,
          adName: body.adName,
          formId: body.formId,
          formName: body.formName,
          pageId: body.pageId,
          pageName: body.pageName,
          questionsAnswers: body.questionsAnswers || {},
          assignedToId,
          status: body.status || 'NEW',
          firstResponseDeadline: new Date(Date.now() + 10 * 60000),
          
          // AI Validation Simulation
          aiScore: (body.fullName?.toLowerCase().includes('test') || body.email?.toLowerCase().includes('test')) ? 12 : 92,
          aiValidationStatus: (body.fullName?.toLowerCase().includes('test') || body.email?.toLowerCase().includes('test')) ? 'JUNK' : 'HOT',
          aiValidationReason: (body.fullName?.toLowerCase().includes('test') || body.email?.toLowerCase().includes('test')) ? 'Contains test keywords, likely spam' : 'Valid intent detected by AI'
        }
      });
      created = true;
      
      await db.leadActivity.create({
        data: {
          tenantId,
          leadId: lead.id,
          actorName: 'System Ingestion',
          type: 'CREATED',
          description: `Lead created via ${lead.platform}`
        }
      });
    }

    await db.auditLog.create({
      data: {
        tenantId,
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: 'CREATE_LEAD',
        entity: 'Lead',
        entityId: lead.id
      }
    });

    return NextResponse.json({ success: true, lead, created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
