import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  sendWhatsAppCloudApiMessage,
  get2WayChatHistory,
  add2WayChatMessage
} from '@/lib/whatsapp';

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
    const { tenantId, phoneNumberId, accessToken, recipientPhone, text, leadPhone } = body;

    const targetPhone = recipientPhone || leadPhone;

    // 1. Dispatch via Real Meta WhatsApp Cloud API
    const apiResult = await sendWhatsAppCloudApiMessage(
      phoneNumberId,
      accessToken,
      targetPhone,
      text
    );

    // 2. Store in 2-Way Chat Stream
    const chatMsg = add2WayChatMessage(tenantId || 'tenant-101', targetPhone, 'SALES_REP', text);

    return NextResponse.json({
      success: apiResult.success,
      apiResult,
      chatMsg
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
