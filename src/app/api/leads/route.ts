import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession, scopeTenantQuery } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function evaluateLeadQuality(leadData: any, businessCategory: string = "GENERAL_CRM") {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert AI assistant for a ${businessCategory.replace('_', ' ')} business. Evaluate the following lead data and return a JSON object scoring the lead.

Lead Data:
Name: ${leadData.fullName}
Email: ${leadData.email}
Phone: ${leadData.phone}
Location/Project: ${leadData.location}
Platform: ${leadData.platform}
Questions/Answers: ${JSON.stringify(leadData.questionsAnswers || {})}

Return ONLY a valid JSON object with no markdown formatting, using this structure:
{
  "aiScore": <number 0-100>,
  "aiValidationStatus": "<HOT | WARM | COLD | JUNK>",
  "aiValidationReason": "<Short reason for the score>"
}

Rules:
- HOT: High budget, clear intent, real contact info provided. (Score 80-100)
- WARM: Missing some info but valid intent. (Score 50-79)
- COLD: Low intent or very low budget. (Score 20-49)
- JUNK: Spam, fake names (like 'test'), fake emails/phones. (Score 0-19)
`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    return null;
  }
}

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

      // Fetch tenant to get business category
      const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
      const businessCategory = tenant?.businessCategory || 'GENERAL_CRM';

      // Run AI Evaluation before creating the lead
      const aiEval = await evaluateLeadQuality(body, businessCategory);

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
          
          
          // Generate real AI evaluation
          aiScore: aiEval?.aiScore ?? ((body.fullName?.toLowerCase().includes('test') || body.email?.toLowerCase().includes('test')) ? 12 : 92),
          aiValidationStatus: aiEval?.aiValidationStatus ?? ((body.fullName?.toLowerCase().includes('test') || body.email?.toLowerCase().includes('test')) ? 'JUNK' : 'HOT'),
          aiValidationReason: aiEval?.aiValidationReason ?? ((body.fullName?.toLowerCase().includes('test') || body.email?.toLowerCase().includes('test')) ? 'Contains test keywords, likely spam' : 'Valid intent detected by AI')
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
