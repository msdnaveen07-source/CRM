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

    const leads = await db.lead.findMany({ where: whereClause });
    const followups = await db.followup.findMany({ where: whereClause });
    const campaigns = await db.campaign.findMany({ where: whereClause });
    
    // For integrations, if system is requested it might return multiple, but we just want boolean checks
    const metaIntegration = tenantId !== 'system' ? await db.metaIntegration.findUnique({ where: { tenantId } }) : null;
    const whatsAppIntegration = tenantId !== 'system' ? await db.whatsAppIntegration.findUnique({ where: { tenantId } }) : null;

    // Calculate response time & missed analytics
    const contactedLeads = leads.filter((l) => l.firstContactedAt);
    let totalResponseTimeMs = 0;
    contactedLeads.forEach((l) => {
      const created = new Date(l.createdAt).getTime();
      const contacted = new Date(l.firstContactedAt!).getTime();
      totalResponseTimeMs += contacted - created;
    });

    const avgResponseTimeSeconds = Math.round(
      contactedLeads.length > 0 ? totalResponseTimeMs / (contactedLeads.length * 1000) : 480
    );

    const metrics = {
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.status === 'NEW').length,
      contactedLeads: leads.filter((l) => l.status === 'CONTACTED').length,
      interestedLeads: leads.filter((l) => l.status === 'INTERESTED').length,
      followupsDue: followups.filter((f) => f.status === 'PENDING').length,
      qualifiedLeads: leads.filter((l) => l.status === 'QUALIFIED').length,
      wonLeads: leads.filter((l) => l.status === 'WON').length,
      lostLeads: leads.filter((l) => l.status === 'LOST').length,
      missedLeads: leads.filter((l) => l.isMissed).length,
      avgResponseTimeSeconds,
      conversionRate: leads.length > 0 ? ((leads.filter((l) => l.status === 'WON').length / leads.length) * 100).toFixed(1) : 0,
      metaConnected: !!metaIntegration?.connected,
      whatsAppConnected: !!whatsAppIntegration?.connected
    };

    return NextResponse.json({ success: true, metrics, campaigns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
