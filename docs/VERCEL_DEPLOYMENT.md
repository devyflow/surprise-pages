# Vercel production deployment

## Project settings

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Production branch: `main`
- Node.js: 20.x

## Required environment variables

Configure these for Production and Preview in Vercel. Never commit their values.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_TO_EMAIL`
- `RESEND_FROM_EMAIL`
- `ADMIN_EMAILS`
- `ADMIN_ALERT_EMAIL`
- `ANALYTICS_SALT`

`NEXT_PUBLIC_SITE_URL` must be the final HTTPS production origin without a trailing slash.

## External configuration

1. Apply Supabase migrations `001` through `006` in order.
2. Add the production `/auth/callback` URL to Supabase Auth redirect URLs.
3. Point the Razorpay webhook to `/api/webhooks/razorpay` and enable `payment.captured`.
4. Verify the sending domain in Resend before using its production API key.
5. Run `npm run grant-admin -- admin@example.com` from a trusted environment after configuring Supabase credentials.

## Release checks

- `npx tsc --noEmit`
- `npm run build`
- Verify `/`, `/builder`, `/builder/tier2`, `/builder/tier3`, `/discover`, `/contact`, `/login`, and `/admin`.
- Complete one Razorpay test payment and confirm signed webhook publication.
- Confirm the admin account is required to complete MFA before accessing customer or order data.
