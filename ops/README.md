# ops/ — day-to-day working outputs

Every Claude session writes its finished work here, one subfolder per store
function. These files are **committed on purpose**: git is the memory layer, so
each fresh session can read last week's report, past campaigns, and the
onboarding state before doing new work.

| Folder | Written by | Contents |
|--------|-----------|----------|
| `onboarding/` | `telegram-onboarding` skill | Per-run review sheets in `runs/`, intake offset in `state.json` |
| `marketing/` | `new-drop-campaign`, `social-content` | `campaigns/` (one folder per campaign), `social/` (dated post batches), `email/` (drafts) |
| `engagement/` | `customer-winback` | `winback/` segment lists + outreach drafts per run |
| `reports/` | `weekly-sales-report`, `store-health-check` | `weekly/` (YYYY-Www files), `health/` (dated audits) |
| `seo/` | `seo-refresh` | `audits/` before/after tables per collection |

Naming convention: date-prefixed files — `YYYY-MM-DD-<topic>.md` (or `YYYY-Www`
for weekly reports). Throwaway working files go in `scratch/` (gitignored), never
here. No secrets, no tokens — discount codes and product data are fine.
