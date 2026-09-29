# LeadFlow — Production-Ready Multi-Tenant Lead Management CRM SaaS (2026)

LeadFlow is a high-performance multi-tenant CRM SaaS designed for businesses running Meta/Facebook Lead Ads. It captures incoming Meta leads in real-time, stores them securely with strict tenant isolation, instantly dispatches WhatsApp notifications to client sales teams, detects uncontacted leads using a 10-minute SLA engine, and runs an automated 10-minute reconciliation backup process to guarantee zero lost leads and zero duplicates.

---

## 🚀 Key Features

1. **Multi-Tenant Architecture**: Every client record is strictly isolated with `tenant_id` database constraints, server-side authorization guards, and audited admin impersonation.
2. **Meta Lead Ingestion Webhook**: Endpoint `/api/webhooks/meta` handles real-time lead push notifications with verification signatures and idempotent storage.
3. **10-Minute Backup Reconciliation**: Background engine `/api/reconcile` polls Meta API every 10 minutes to fetch missing leads without creating duplicate records.
4. **10-Minute Missed Lead SLA Engine**: Monitors incoming `NEW` leads and triggers warning/urgent alerts if sales reps fail to respond within 10 minutes.
5. **WhatsApp Business API Integration**: Dispatches formatted lead alerts directly to sales agents via official WhatsApp templates.
6. **Role-Based Access Control (RBAC)**: Supports Super Admin, Client Admin, Sales Manager, and Sales User roles.
7. **2026 SaaS UI Aesthetics**: Modern charcoal & electric blue theme with light/dark modes, command palette (`Ctrl+K`), responsive sidebar, interactive tables, and Recharts analytics.

---

## 🛠️ Project Setup & Installation

### 1. Prerequisites
- Node.js 18+ & npm
- PostgreSQL (or local SQLite/In-memory driver included for instant testing)

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Environment variables:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
AUTH_SECRET="leadflow-secret-key-2026-production-ready-super-secure"
META_APP_ID="demo_meta_app_id"
META_APP_SECRET="demo_meta_app_secret"
META_VERIFY_TOKEN="leadflow_webhook_verify_token_2026"
WHATSAPP_ACCESS_TOKEN="demo_whatsapp_access_token"
WHATSAPP_PHONE_NUMBER_ID="demo_whatsapp_phone_number_id"
WHATSAPP_BUSINESS_ACCOUNT_ID="demo_whatsapp_business_account_id"
ENCRYPTION_KEY="leadflow-32-byte-secret-encryption-key!!"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Acceptance Criteria

Run manual or automated verification for the primary workflow:
1. **Receive Lead**: Send POST to `/api/webhooks/meta` with lead payload.
2. **Instant Alert**: Verify lead created under `tenant-101` and WhatsApp alert dispatched.
3. **SLA Monitor**: Trigger `/api/reconcile` to check response timer and SLA escalation after 10 minutes.
4. **Reconciliation**: Verify duplicate Meta lead ID prevention logic.
5. **Multi-Tenant Isolation**: Switch roles to Client B and verify Lead #1001 is completely inaccessible.

---

## 📄 License
Commercial Multi-Tenant SaaS License. All Rights Reserved (2026).
