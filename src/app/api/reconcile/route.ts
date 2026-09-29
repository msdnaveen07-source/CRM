import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsAppMissedLeadAlert } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetTenantId = searchParams.get('tenantId') || 'tenant-101';

    // 1. Run 10-Minute Missed Lead SLA Engine
    const tenMinutesAgo = new Date(Date.now() - 10 * 60000);
    const missedLeads = await db.lead.findMany({
      where: {
        tenantId: targetTenantId,
        status: 'NEW',
        isMissed: false,
        createdAt: { lte: tenMinutesAgo }
      }
    });

    let checked = 0;
    let newlyMissed = 0;

    for (const lead of missedLeads) {
      await db.lead.update({
        where: { id: lead.id },
        data: { isMissed: true, missedEscalationLevel: 'WARNING' }
      });
      newlyMissed++;
      
      await db.leadActivity.create({
        data: {
          tenantId: targetTenantId,
          leadId: lead.id,
          actorName: 'SLA Missed Lead Detector',
          type: 'MISSED_ALERT',
          description: `Lead response SLA breached.`
        }
      });

      await sendWhatsAppMissedLeadAlert(targetTenantId, lead, 10);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      missedAlertsDispatched: newlyMissed
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
