# Dashboard Build — Handoff V7

## Status: CIT CARD DONE, DELIVERY FORM BUILT — Guardian POST fails (CORS)

**Date:** 2026-03-21
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)
**Previous handoffs:** V6 (polish/wallet redesign), V5 (HashScan/login gate/NFT), V4 (mobile/deploy), V3 (CORS fix), V2 (scaffold), V1 (brainstorm)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

### 1. CIT Progress Tracker (wallet.html)

Replaced the static "Staking Rewards" placeholder with a live **Circular Impact Token** card:

- **Header:** `verified` icon + "Circular Impact Token" title
- **Description:** "Each CIT represents 1 tonne of CO2 avoided through composting..."
- **Two info rows** (dual state):
  - Logged out: "Total Composted" (global $EGGO supply) + "CIT Minted" (global NFT supply)
  - Logged in: "Your Composted" (user balance) + "Your CIT" (user NFT count)
- **NFT mint log:** Lists all minted CIT NFTs with serial number, holder role, timestamp, "1 tonne CO2" badge
- **Token Details:** Token ID 0.0.8287362, Hedera Testnet, HTS Non-Fungible (NFT)
- **CTA:** "View on HashScan" → links to real token page
- Data fetched live from Hedera Mirror Node (no login required for global view)

### 2. "Coming Soon" Toasts on Placeholder Buttons

Added `UI.showToast('Coming soon')` to all non-functional buttons:
- **index.html:** "Redeem Credits" button
- **wallet.html:** "Redeem Credits" button
- **marketplace.html:** "Explore Venues", 3x "Get it now", "Contact us", floating cart FAB

### 3. Marketplace Filter Pills → Anchor Links

- Eggs/Compost/Restaurants pills now scroll to their product cards
- Custom `smoothScroll()` function with 1.2s cubic ease-in-out (no CSS scroll-behavior)
- Cards have IDs: `card-eggs`, `card-compost`, `card-restaurants`

### 4. Waste Delivery Form (index.html) — PARTIALLY WORKING

Replaced the "Regeneration Lifecycle" diagram (7-col section) with a dual-state delivery card:

**Logged out (CTA):**
- Dark green gradient card matching wallet aesthetic
- "Log Waste Delivery" heading + description + "Sign In to Submit" button
- Subtitle: "1 kg composted = 1 $EGGO minted • CDM AMS-III.F methodology"

**Logged in (Form):**
- White card with "New Waste Delivery" heading
- Auto-filled chips: delivery ID (ENT-XXX) + supplier (SUP-001) + category badge
- 4 fields: waste type (dropdown), gross weight (number), contaminated kg (number), evidence URL
- **Live preview:** computes net kg, adjusted kg (×0.70), estimated $EGGO reward as user types
- **Category logic:** A (≤5% contamination, green), B (5-10%, yellow), C (>10%, red, blocks submit)
- Submit button → POST to Guardian API

**BLOCKER:** Guardian API POST returns fetch error — likely CORS. The `GuardianAPI.submitDelivery()` calls `POST /api/v1/policies/{POLICY_ID}/blocks/{PP_DELIVERY_FORM}` which hits `guardianservice.app`. Same CORS pattern that affected login (which falls back to offline mode). Need to either:
1. Add a CORS proxy (simplest for hackathon)
2. Test if Guardian Managed Service allows POST from GitHub Pages origin
3. Use a node script to submit server-side
4. Mock the success for the demo and show the form working visually

---

## FILE CHANGES (this session)

| File | Change |
|------|--------|
| `dashboard/js/config.js` | Added `PP_DELIVERY_FORM` block ID |
| `dashboard/js/api.js` | Added `post()` method + `submitDelivery(doc)` wrapper |
| `dashboard/js/hedera.js` | Added `getCITSupply()`, `getUserCIT()`, `getAllCITNfts()` |
| `dashboard/js/wallet.js` | CIT card data binding (global + user), `renderCITLog()` |
| `dashboard/js/dashboard.js` | Removed lifecycle satellite refs, added `updateDeliveryCard()`, `updateDeliveryPreview()`, `submitDeliveryForm()` |
| `dashboard/wallet.html` | Staking card → CIT Progress Tracker + NFT mint log |
| `dashboard/index.html` | Lifecycle diagram → dual-state delivery form + "Redeem Credits" toast |
| `dashboard/marketplace.html` | "Coming soon" toasts on all buttons, smooth scroll filter pills, card IDs |

---

## BLOCKER: Guardian POST CORS

The delivery form UI is complete and functional (live preview, validation, category logic all work). The only issue is the final `fetch()` POST to `guardianservice.app` fails.

**Diagnosis needed:**
- Open browser DevTools → Network tab → attempt a submit → check the exact error
- Is it CORS (no Access-Control-Allow-Origin header)?
- Is it 401 (offline-mode token isn't real)?
- Is it 403 (PP role not assigned to the logged-in user)?

**Possible fixes (pick one):**
1. **CORS proxy:** `npx cors-anywhere` or a Cloudflare Worker proxy
2. **Real login first:** If the user logs in with real Guardian creds (not offline mode), the token is valid
3. **Server-side script:** Node script that accepts form data and forwards to Guardian API
4. **Demo mock:** On submit, show success toast + fake the result (for presentation only)

---

## ARCHITECTURE: DELIVERY FORM DATA FLOW

```
User fills form → updateDeliveryPreview() computes live:
  kg_netos = kg_bruto - kg_impropios
  kg_ajustados = kg_netos × 0.70
  category = A/B/C based on impropios_ratio
  estimated $EGGO = round(kg_ajustados)

Submit → submitDeliveryForm() builds 17-field document:
  field0-3: methodology metadata (auto)
  field4: delivery_id ENT-XXX (auto-incremented)
  field5: supplier_id SUP-001 (auto)
  field6: ISO timestamp (auto)
  field7: waste_stream (user input)
  field8: kg_bruto (user input)
  field9: kg_impropios (user input)
  field10-13: computed from inputs
  field14-17: evidence + status (auto)

POST → GuardianAPI.submitDelivery(doc)
  → POST /api/v1/policies/{POLICY_ID}/blocks/{PP_DELIVERY_FORM}
  → { document: doc, ref: null }
```

---

## CIT TOKEN DETAILS (on-chain)

| Field | Value |
|-------|-------|
| Token ID | 0.0.8287362 |
| Symbol | CIN |
| Type | NON_FUNGIBLE_UNIQUE |
| Total Supply | 4 (serials 1-3 from faulty policies, serial 4 is valid) |
| Treasury | 0.0.7166777 |
| HashScan | https://hashscan.io/testnet/token/0.0.8287362 |
| Mint threshold | 1,000 kg adjusted waste per CIT |
| Formula | `nfts_to_mint = floor(kg_ajustados_total / 1000)` |

---

## ACCOUNTS (unchanged)

| Role | Email | Hedera Account | EGGOCOIN |
|------|-------|----------------|----------|
| OWNER (SR) | r.aguileira88@gmail.com | 0.0.7166777 | 10 |
| Registry | eggologic-registry@outlook.com | 0.0.8292724 | 0 |
| Project_Proponent | eggologic-proponent@outlook.com | 0.0.8294621 | 1,190 |
| Operator | eggologic-operator@outlook.com | 0.0.8294659 | 0 |
| VVB | eggologic-vvb@outlook.com | 0.0.8294709 | 0 |

**Password for all:** `test`

---

## HOW TO RUN / DEPLOY

```bash
# Local dev
cd dashboard && npx http-server . -p 8080 -c-1 --cors

# Deploy (automatic on push to main)
git push origin main
# → GitHub Actions deploys dashboard/ to Pages in ~20s
```

---

## REMAINING WORK

### Critical (before hackathon):
- **Fix Guardian POST** — CORS or auth issue preventing delivery submission
- **Test end-to-end** — submit a real delivery, verify EGGOCOIN minting

### Nice-to-have (if time):
- Wizard mode for delivery form (multi-step with animations)
- Loading skeleton on CIT card info rows
- Hamburger menu verification on wallet after redesign
- Hedera account ID clickable to HashScan on wallet balance

---

## REFERENCED FILES

| File | Purpose |
|------|---------|
| `guardian/DASHBOARD-HANDOFF-V6.md` | Previous session (9 polish tasks + wallet redesign) |
| `docs/carbon-methodology.md` | CDM AMS-III.F methodology + 70% conservative factor |
| `docs/superpowers/specs/2026-03-20-cit-progress-tracker-design.md` | CIT card design spec |
| `guardian/WORKFLOW-TEST-HANDOFF-V8.md` | Published policy workflow + delivery schema |
| `guardian/WORKFLOW-TEST-RESULTS.md` | Test execution results + minting verification |
