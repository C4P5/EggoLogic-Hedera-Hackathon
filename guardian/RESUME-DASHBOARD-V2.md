# Resume Dashboard — V2

## STATUS
Dashboard scaffold is COMPLETE (13 files, 4 pages). Needs browser testing, CORS fix for Guardian API, and visual polish before March 22 hackathon deadline.

## PROMPT

```
Read these files in order before doing anything:

1. guardian/WORKFLOW-TEST-HANDOFF-V8.md — full Guardian policy context
2. guardian/DASHBOARD-HANDOFF-V2.md — dashboard build status (THIS SESSION'S WORK)

Then quickly scan these JS files to understand the current code:
- dashboard/js/config.js
- dashboard/js/api.js
- dashboard/js/hedera.js
- dashboard/js/ui.js

CONTEXT:
- Eggologic circular economy platform on Hedera for Apex Hackathon (deadline March 22, 2026)
- Dashboard was FULLY SCAFFOLDED in previous session: 4 HTML pages + 8 JS modules + 1 CSS file
- Architecture: Approach A (static HTML + JS fetch, no build tools)
- Hedera Mirror Node data is LIVE and VERIFIED (supply: 1200 EGGOCOIN, 2 holders)
- Guardian API calls may be blocked by CORS from browser — fallback values are in place
- Login system works via localStorage with token refresh

WHAT WAS DONE:
- Built dashboard/index.html (Dashboard), wallet.html, impact.html, marketplace.html
- Built config.js, api.js (Guardian auth), hedera.js (Mirror Node), ui.js (login modal)
- Built dashboard.js, wallet.js, impact.js, marketplace.js (per-page data binding)
- All pages have fallback to verified V8 workflow values if Guardian CORS blocks

TASK — Pick up from: "WHAT TO DO NEXT" in DASHBOARD-HANDOFF-V2.md:
1. Open dashboard in browser and test the login flow
2. Fix Guardian CORS issue (recommend pre-fetch to JSON cache, or tiny proxy)
3. Visual polish and responsive testing
4. Test all 4 pages end-to-end
5. If time permits: restore Stitch images, loading skeletons, deploy

Key constraints:
- ~1.5 days remain until hackathon deadline (March 22)
- No middleware — dashboard calls APIs directly from browser
- Guardian managed service at guardianservice.app
- Windows 10, no python, use node for scripting
- Auth tokens expire ~30 min, need re-auth handling (already implemented)
- Password for all demo accounts: "test"

Installed skills available:
- stitch-design, design-md, enhance-prompt (Google Stitch skills)
- Stitch MCP configured in .vscode/mcp.json
```
