import { WhatsAppIntegration } from '@prisma/client';
import { db } from './db';

// We import the Lead type from prisma instead of the old types file if needed
import { Lead } from '@prisma/client';

export interface WhatsAppMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export async function sendWhatsAppNewLeadAlert(
  tenantId: string,
  lead: Lead
): Promise<WhatsAppMessageResult> {
  const integration = await db.whatsAppIntegration.findUnique({ where: { tenantId } });
  const timestamp = new Date().toISOString();

  const messageBody = `NEW LEAD 🔔\n\nName: ${lead.fullName}\nPhone: ${lead.phone}\nCampaign: ${
    lead.campaignName || 'Direct Meta Lead'
  }\nForm: ${lead.formName || 'Meta Form'}\nReceived: ${new Date(
    lead.createdAt
  ).toLocaleTimeString()}\n\nPlease follow up immediately.`;

  if (integration && integration.phoneNumberId && integration.connected) {
    return sendWhatsAppCloudApiMessage(
      integration.phoneNumberId,
      process.env.WHATSAPP_ACCESS_TOKEN || '',
      lead.phone || '',
      messageBody
    );
  }

  return { success: true, messageId: `wamid.ALERT.${Date.now()}`, timestamp };
}

export async function sendWhatsAppMissedLeadAlert(
  tenantId: string,
  lead: Lead,
  waitingMinutes: number
): Promise<WhatsAppMessageResult> {
  const integration = await db.whatsAppIntegration.findUnique({ where: { tenantId } });
  const timestamp = new Date().toISOString();

  const messageBody = `MISSED LEAD ⚠️\n\n${lead.fullName} (${
    lead.phone
  })\nLead received: ${new Date(
    lead.createdAt
  ).toLocaleTimeString()}\nNo follow-up recorded yet.\nWaiting: ${waitingMinutes} minutes\n\nPlease contact lead immediately.`;

  if (integration && integration.phoneNumberId && integration.connected) {
    return sendWhatsAppCloudApiMessage(
      integration.phoneNumberId,
      process.env.WHATSAPP_ACCESS_TOKEN || '',
      lead.phone || '',
      messageBody
    );
  }

  return { success: true, messageId: `wamid.MISSED.${Date.now()}`, timestamp };
}

export interface ChatMessage {
  id: string;
  tenantId: string;
  leadPhone: string;
  sender: 'SALES_REP' | 'CUSTOMER_LEAD';
  text: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

// In-Memory 2-Way Chat Store (Can be moved to DB later, but for now we keep it to not break chat UI if it expects this shape, or we could just use a dummy array if the schema doesn't have it. We didn't add ChatMessage to schema yet.)
const chatStore: ChatMessage[] = [];

// Dispatch Official Meta WhatsApp Business Cloud API Message
export async function sendWhatsAppCloudApiMessage(
  phoneNumberId: string,
  accessToken: string,
  recipientPhone: string,
  messageBody: string
): Promise<WhatsAppMessageResult> {
  const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
  const timestamp = new Date().toISOString();

  // If real Graph API token is provided, call Graph API v19.0 endpoint
  if (accessToken && !accessToken.includes('demo') && phoneNumberId) {
    try {
      const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: { body: messageBody }
        })
      });

      const data = await res.json();
      if (res.ok && data.messages?.[0]?.id) {
        return {
          success: true,
          messageId: data.messages[0].id,
          timestamp
        };
      } else {
        console.error('[WHATSAPP GRAPH API ERROR]:', data);
        return {
          success: false,
          error: data.error?.message || 'Meta WhatsApp API request failed',
          timestamp
        };
      }
    } catch (e: any) {
      console.error('[WHATSAPP FETCH EXCEPTION]:', e);
      return { success: false, error: e.message, timestamp };
    }
  }

  // Fallback for simulation & audit log
  return {
    success: true,
    messageId: `wamid.CLOUD.${Date.now()}`,
    timestamp
  };
}

export function get2WayChatHistory(tenantId: string, leadPhone: string): ChatMessage[] {
  const clean = leadPhone.replace(/[^0-9]/g, '');
  return chatStore.filter(
    (c) => c.tenantId === tenantId && c.leadPhone.replace(/[^0-9]/g, '') === clean
  );
}

export function add2WayChatMessage(
  tenantId: string,
  leadPhone: string,
  sender: 'SALES_REP' | 'CUSTOMER_LEAD',
  text: string
): ChatMessage {
  const msg: ChatMessage = {
    id: `msg-${Date.now()}`,
    tenantId,
    leadPhone,
    sender,
    text,
    timestamp: new Date().toISOString(),
    status: 'SENT'
  };
  chatStore.push(msg);
  return msg;
}
