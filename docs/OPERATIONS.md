# Surprise Pages — fulfilment and admin operating plan

## Product promise

Surprise Pages sells a private emotional experience, not generic web-design work. Every order must be traceable from intake to delivery, and every public promise must correspond to either automated behaviour or a named human step.

## Tier fulfilment

| Tier | Intake | Production | Quality check | Delivery |
|---|---|---|---|---|
| Simple Wish ₹99 | Sender, recipient, message, 1–3 photos, contact and needs | Automatic template | Validation, preview, payment signature, private token and PIN | Immediate after verified payment |
| Memory Lane ₹199 | Opening, closing, 2–10 memories, optional song/video, contact and needs | Automatic story template | All captions and media links validated | Immediate after verified payment |
| Time Capsule ₹299 | Message, up to 15 photos, reveal time, theme, optional video, contact and needs | Automatic countdown template | Future timestamp, locked/revealed states and media validated | Link is immediate; content unlocks at the selected time |
| White Glove ₹999+ | Short brief, relationship, tone, language, deadline and preferred contact | Human-owned production queue | Scope confirmation, mobile review, privacy check and one revision | First response within two working hours; delivery estimate agreed before payment |

## Admin workflow

1. New self-serve orders enter `awaiting_payment`; concierge requests enter `new`.
2. Razorpay verification moves self-serve orders to `paid` and publishes the private page.
3. An admin can move work through `in_production`, `needs_customer`, `ready`, and `delivered`.
4. Customer records show email, phone, consent and preferred contact. Call/WhatsApp actions appear only when the customer consented.
5. Internal notes are private and every administrative status or settings change is written to the audit log.
6. Actual page views and unique daily visitors are kept internally. The public count can show the actual number, a custom marketing number, or remain hidden; changing it never overwrites the original data.

## Data boundaries

- Payment credentials remain with Razorpay.
- Customer/order data stays server-side in Supabase behind row-level security.
- Admin access requires an admin role and MFA.
- Visitor analytics use a first-party cookie and a daily salted hash; raw IP addresses are not stored.
- Phone and WhatsApp contact require explicit order-related consent.

## Launch dependencies

- Apply Supabase migrations 001–006.
- Configure Supabase server and public keys.
- Complete Razorpay KYC and configure the payment webhook.
- Configure Resend for receipts and concierge alerts.
- Set a strong `ANALYTICS_SALT`.
- Grant the operator account an admin role and enrol MFA.
- Replace URL-only media inputs with managed uploads before broad public launch.
- Run real mobile QA on lower-end Android devices before enabling paid traffic.
