# /api/jobs/run

Worker tick, called by a scheduler (cron). Processes due JobRun rows: AI ingestion,
daily catalog build + broadcast, payment-proof matching, order-expiry/restock,
tracking sync. See ../../../../../docs/architecture.md (Background jobs).
