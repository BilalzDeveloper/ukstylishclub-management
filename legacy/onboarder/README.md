# Legacy: uksc-onboarder

The original single-file product-onboarding tool (`index.html`), preserved as-is.

It is a client-side HTML/JS app that pulled vendor product data/images (via Google
Drive + OAuth), ran an AI review/confidence step, let you set prices, and pushed
products to Shopify via the GraphQL Admin API.

**Why it's kept:** its Shopify product-create logic (variants, size/colour options,
`inventoryPolicy:'CONTINUE'`) and review-UI pattern are ported into the new system
during M1–M2 (see ../../docs/roadmap.md). Retire this folder once that port is
complete and verified.
