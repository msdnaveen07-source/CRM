import { NextRequest, NextResponse } from 'next/server';
import { generateCrmAiResponse } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, tenantId, userRole, contextPage } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const aiResult = await generateCrmAiResponse(message, {
      tenantId: tenantId || 'tenant-101',
      userRole: userRole || 'CLIENT_ADMIN',
      contextPage
    });

    return NextResponse.json({
      success: true,
      reply: aiResult.reply,
      actionType: aiResult.actionType,
      actionData: aiResult.actionData,
      suggestions: aiResult.suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
