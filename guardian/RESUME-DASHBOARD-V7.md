## STATUS
CIT card live on wallet, delivery form UI complete on index, Guardian POST fails (CORS/auth). Hackathon deadline is March 22, 2026.

## PROMPT

```
Read guardian/DASHBOARD-HANDOFF-V7.md first.

Then read files ON DEMAND as needed (don't read everything upfront — saves context):
- dashboard/js/api.js — if touching Guardian POST/auth/CORS fix
- dashboard/js/dashboard.js — if touching delivery form logic
- dashboard/js/config.js — if touching block IDs or config
- dashboard/js/hedera.js — if touching Hedera API calls
- dashboard/js/wallet.js — if touching wallet/CIT data
- dashboard/js/ui.js — if touching login/toast/loading
- dashboard/css/custom.css — if adding CSS animations
- dashboard/index.html — if touching delivery form HTML
- dashboard/wallet.html — if touching wallet/CIT layout
- dashboard/marketplace.html — if touching marketplace layout
- dashboard/impact.html — if touching impact page

CONTEXT:
- Eggologic circular economy platform on Hedera for Apex Hackathon (deadline March 22, 2026)
- Dashboard DEPLOYED at https://c4p5.github.io/EggoLogic-Hedera-Hackathon/
- Architecture: static HTML + JS fetch + Tailwind CDN, no build tools
- GitHub Pages deploys on push to main (~20s)
- All data now loads WITHOUT login (Guardian cache + public Hedera Mirror Node)
- Token display uses "$EGGO" not "EGO"
- Password for all demo accounts: "test"
- CDM AMS-III.F methodology: kg_ajustados = (kg_bruto - kg_impropios) × 0.70
- CIT Token: 0.0.8287362 (NFT), 4 minted, 1 valid (serial #4)
- Guardian POST block ID: b322eaa1-7611-4704-be60-b033db83dadb

WHAT WAS DONE (V7 session):
- CIT Progress Tracker card on wallet (replaces staking, live data from Mirror Node)
- NFT mint log on wallet (lists all minted CITs with serial/holder/timestamp)
- "Coming soon" toasts on all placeholder buttons (index, wallet, marketplace)
- Marketplace filter pills smooth-scroll to product cards
- Delivery form (dual-state: CTA when logged out, form when logged in)
- Guardian API post() + submitDelivery() methods added
- BLOCKER: Guardian POST fails — needs CORS/auth debugging

TASK — [describe what you want done next]:
[e.g., Fix Guardian POST CORS, test delivery submission, wizard mode, final QA, etc.]

PRIORITY BLOCKER:
The delivery form UI works perfectly (live preview, validation, category logic).
The Guardian POST fetch fails. Debug steps:
1. Open DevTools → Network tab → submit form → check exact error
2. If CORS: need proxy or Guardian CORS config
3. If 401: offline-mode tokens are fake, need real Guardian login
4. If 403: PP role not assigned to logged-in user

Key constraints:
- Hours remaining until hackathon deadline
- No build tools — static HTML + JS fetch + Tailwind CDN
- Auto-deploys on push to main via GitHub Actions
- Local server: cd dashboard && npx http-server . -p 8080 -c-1 --cors
- Windows 10, no python, use node for scripting
- READ FILES ON DEMAND to save context window
```
