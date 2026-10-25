# Surprise Pages pricing and plan specification

## Commercial model

- Customers build and preview a self-serve page for free.
- Payment is requested only when the customer chooses to publish.
- Prices are one-time charges in Indian Rupees; there is no subscription.
- Gift discovery remains a separate optional experience and does not change these plans.

## Public plans

| Plan | Price | Product promise | Hosting |
|---|---:|---|---:|
| Quick Surprise | ₹99 | A message, optional song, up to 3 photos, branded private link and PIN | 30 days |
| Full Story | ₹299 | A captioned timeline or scheduled reveal, optional music/video, private link and PIN | 1 year |
| Made for You | ₹1,499+ | Human-built experience, written scope, one revision and agreed delivery deadline | agreed in scope |

## Full Story formats

Full Story is one public plan with two builder formats at the same price:

1. **Timeline** — opening message, 2–10 captioned memories, closing message and optional media.
2. **Scheduled reveal** — message, up to 15 photos, optional video, custom colours and a validated future reveal time.

The existing internal identifiers remain `tier2` and `tier3` so saved pages remain compatible. Both charge ₹299 and are presented publicly as Full Story.

## Fulfilment rules

- Quick Surprise and Full Story are self-serve and may also generate a manual-assistance request.
- Made for You is human-owned. Scope, final price and deadline are confirmed before payment.
- Made for You includes one review round and a first response within two working hours.
- Every page receives a private link and four-digit PIN.
- Phone or WhatsApp contact is available only when the customer explicitly consents.

## Implementation mapping

| Internal key | Public label | Builder |
|---|---|---|
| `tier1` | Quick Surprise | `/builder` |
| `tier2` | Full Story — Timeline | `/builder/tier2` |
| `tier3` | Full Story — Scheduled Reveal | `/builder/tier3` |
| `tier4` | Made for You | `/builder/white-glove` |

## Admin requirements

- Show the public plan label and the internal format for Full Story orders.
- Track payment and fulfilment independently.
- Keep customer needs, deadline, preferred contact and consent attached to each order.
- Calculate expiry as 30 days for Quick Surprise and 365 days for either Full Story format.
- Keep original visitor analytics immutable even when a custom public counter is selected.
