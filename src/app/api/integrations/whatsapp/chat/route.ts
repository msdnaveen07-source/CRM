import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  sendWhatsAppCloudApiMessage,
  get2WayChatHistory,
  add2WayChatMessage
} from '@/lib/whatsapp';
import { generateCrmAiResponse } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId') || 'tenant-101';
  const leadPhone = searchParams.get('leadPhone') || '';

  const history = get2WayChatHistory(tenantId, leadPhone);
  return NextResponse.json({ success: true, history });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, phoneNumberId, accessToken, recipientPhone, text, leadPhone, isCustomerIncoming } = body;

    const targetPhone = recipientPhone || leadPhone;
    const cleanTenantId = tenantId || 'tenant-101';

    if (isCustomerIncoming) {
      // 1. Store Incoming Customer Message
      const incomingMsg = add2WayChatMessage(cleanTenantId, targetPhone, 'CUSTOMER_LEAD', text);

      // 2. Gemini AI Auto-Responder Execution
      const aiReplyData = await generateCrmAiResponse(text, {
        tenantId: cleanTenantId,
        customerPhone: targetPhone,
        incomingMessage: text
      });

      const aiReplyText = aiReplyData.reply || 'Thank you for reaching out! Our team has received your message and will respond shortly.';

      // 3. Dispatch AI Auto-Reply back to customer
      await sendWhatsAppCloudApiMessage(
        phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '',
        accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '',
        targetPhone,
        aiReplyText
      );

      // 4. Record AI Auto-Reply in Chat Stream
      const aiMsg = add2WayChatMessage(cleanTenantId, targetPhone, 'SALES_REP', `🤖 [AI Auto-Reply]: ${aiReplyText}`);

      return NextResponse.json({
        success: true,
        incomingMsg,
        aiMsg,
        aiAutoReplied: true
      });
    }

    // Standard Outgoing Sales Rep Message
    const apiResult = await sendWhatsAppCloudApiMessage(
      phoneNumberId,
      accessToken,
      targetPhone,
      text
    );

    const chatMsg = add2WayChatMessage(cleanTenantId, targetPhone, 'SALES_REP', text);

    return NextResponse.json({
      success: apiResult.success,
      apiResult,
      chatMsg
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
