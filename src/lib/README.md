# lib: low-level clients

- shopify/  — Admin GraphQL client + operations (port from legacy onboarder)
- telegram/ — grammY bot setup
- meta/     — WhatsApp + Instagram Graph API clients
- ai/       — Anthropic/Claude client: product extraction + proof OCR
- db.ts     — Prisma client singleton

Thin wrappers only; business logic lives in src/modules/*.
