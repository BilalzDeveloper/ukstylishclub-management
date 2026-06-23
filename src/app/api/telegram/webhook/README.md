# /api/telegram/webhook

grammY webhook handler. Verifies TELEGRAM_WEBHOOK_SECRET, parses the update, routes
by sender: vendor → onboarding flow; customer → payment-proof flow. Transport only;
enqueues jobs / calls modules. See ../../../../../docs/integrations/telegram.md.
