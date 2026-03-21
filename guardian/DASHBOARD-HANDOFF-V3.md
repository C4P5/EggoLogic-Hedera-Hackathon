# Dashboard Build — Handoff V3

## Status: CORS FIX COMPLETE — Dashboard loads real Guardian + Hedera data in browser

**Date:** 2026-03-20
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)
**Previous handoffs:** V2 (scaffold), V1 (brainstorm), WORKFLOW-TEST-HANDOFF-V8.md (policy)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

1. **Created Guardian data pre-fetch script** (`dashboard/fetch-guardian-cache.js`)
   - Node.js script that logs into Guardian API server-side (bypasses CORS)
   - Fetches VVB_DELIVERY, VVB_IMPACT_CALC, TOKEN_HISTORY blocks
   - Saves to `dashboard/data/guardian-cache.json` (126 KB)

2. **Ran the script** — Successfully cached 3 blocks:
   - VVB_DELIVERY: 10 documents (9 approved, 1 rejected)
   - VVB_IMPACT_CALC: 3 documents
   - TOKEN_HISTORY: 11 documents
   - REGISTRY_SUPPLIER: returned 422 (not needed by dashboard)

3. **Updated `api.js`** — CORS-resilient architecture:
   - `getBlockData()` now tries local `data/guardian-cache.json` first
   - Falls back to live Guardian API if cache miss
   - Login has offline fallback — stores demo auth state if CORS blocks login endpoint
   - Cache is loaded once and shared across all block reads

4. **Fixed Guardian field mapping** — Guardian returns numbered fields, not named:
   - `field4` = `id_entrega` (e.g. ENT-001)
   - `field8` = `kg_ingreso` (raw waste kg)
   - `field12` = `kg_ajustados` (adjusted kg for token calc)
   - `field13` = category (A/B/C)
   - `option.status` = string "Approved"/"Rejected" (not integer 0/1)
   - Updated `dashboard.js` and `impact.js` to handle both field formats

5. **Discovered 10 deliveries** (not just 5 from V8):
   - ENT-001 through ENT-005 (original cycle): 200.5 kg total
   - ENT-006 through ENT-010 (second cycle): 1,540 kg total
   - Grand total: 1,800.5 kg waste, 1,227.1 kg adjusted, 859 kg CO2

6. **Updated all fallback values** to reflect actual data

7. **Verified everything works** — User confirmed "It works!!"

---

## FILE STRUCTURE (updated)

```
dashboard/
├── index.html              ← Screen 4: Dashboard (entry point)
├── wallet.html             ← Screen 3: Wallet Details
├── impact.html             ← Screen 2: Impact Report
├── marketplace.html        ← Screen 1: Marketplace
├── fetch-guardian-cache.js  ← NEW: Node.js pre-fetch script
├── data/
│   └── guardian-cache.json  ← NEW: Cached Guardian API responses (126 KB)
├── js/
│   ├── config.js            ← Shared constants (unchanged)
│   ├── api.js               ← MODIFIED: cache-first + offline login
│   ├── hedera.js            ← Hedera Mirror Node (unchanged)
│   ├── ui.js                ← Login modal + helpers (unchanged)
│   ├── dashboard.js         ← MODIFIED: field mapping fix
│   ├── wallet.js            ← Unchanged (uses Hedera only)
│   ├── impact.js            ← MODIFIED: field mapping fix + 10 deliveries
│   └── marketplace.js       ← Unchanged (uses Hedera only)
└── css/
    └── custom.css           ← Unchanged
```

---

## DATA FLOW (updated)

### Cache-first architecture:
1. `api.js` loads `data/guardian-cache.json` once on first `getBlockData()` call
2. Block ID is mapped to block name via CONFIG.BLOCKS lookup
3. If cache has the block → return cached data (no network call)
4. If cache miss → fall back to live Guardian API (may fail due to CORS)
5. If both fail → page-level try/catch shows hardcoded fallback values

### What works WITHOUT login:
- Marketplace stats (H2O saved, m² reforested) — from Hedera Mirror Node
- Token info (name, symbol, supply) — from Hedera Mirror Node

### What works AFTER login:
- **Hedera data** (always works — public API, no CORS):
  - EGGOCOIN balance, transactions, holders, NFTs
- **Guardian data** (from local cache — no CORS issue):
  - Delivery documents → waste/CO2 metrics, bar chart
  - Impact Calc documents → aggregate score
  - Token History → mint events

### Login flow:
- Tries Guardian API login → if CORS blocks → creates offline auth state
- Either way, user gets logged in with their Hedera account ID stored
- Hedera Mirror Node data loads regardless (public API)
- Guardian data loads from cache regardless (local file)

---

## LIVE STATE (verified 2026-03-20)

| Metric | Value |
|--------|-------|
| EGGOCOIN Total Supply | 1,200 |
| Holders | 2 (Proponent: 1190, OWNER: 10) |
| Deliveries (Guardian) | 10 (9 approved, 1 rejected) |
| Total Waste Processed | 1,800.5 kg |
| Total kg Adjusted | 1,227.1 kg |
| CO2 Avoided (adj × 0.70) | 859 kg |
| Guardian Cache Size | 126 KB, 3 blocks |
| Local Server | http-server on port 8080 |

---

## GUARDIAN FIELD MAPPING (IMPORTANT)

Guardian VC `credentialSubject` uses numbered fields, NOT named fields:

| Field | Name | Example |
|-------|------|---------|
| `field0` | policy_name | EWD-RB |
| `field1` | policy_version | 0.3 |
| `field4` | id_entrega | ENT-001 |
| `field5` | id_proveedor | SUP-001 |
| `field6` | fecha_entrega | 2026-03-19T08:00:00Z |
| `field7` | tipo_residuo | food_waste_mixed |
| `field8` | kg_ingreso | 48.5 |
| `field9` | humedad_pct | 1.2 |
| `field10` | contaminacion_pct | 2.5 |
| `field11` | kg_neto | 47.3 |
| `field12` | kg_ajustados | 33.11 |
| `field13` | categoria | A |
| `field14` | aceptado | true |

Status is `d.option.status` = `"Approved"` or `"Rejected"` (string, not integer).

---

## KNOWN ISSUES / REMAINING WORK

### Done (this session):
- [x] Guardian CORS fix — cache-first architecture
- [x] Field mapping fix — numbered fields handled
- [x] Login works (with offline fallback)
- [x] All 4 pages load and display data

### Remaining (before hackathon):
1. **Visual polish** — responsive testing, mobile breakpoints
2. **Loading skeletons** — better UX than "—" placeholders before login
3. **Restore Stitch images** — marketplace cards use Material Symbols placeholders
4. **Deploy** — GitHub Pages, Vercel, or Netlify for demo URL
5. **Demo video** — walk through login → dashboard → wallet → impact → marketplace
6. **Refresh cache** — run `node fetch-guardian-cache.js` if Guardian data changes

### Minor issues:
- `supply` variable declared but unused in `dashboard.js` line 14 (cosmetic)
- Staking section on wallet page is static placeholder
- "Redeem Credits" button on dashboard is non-functional placeholder

---

## HOW TO RE-CACHE GUARDIAN DATA

If the Guardian policy data changes (new deliveries, etc.):
```bash
cd dashboard
node fetch-guardian-cache.js
```
This overwrites `data/guardian-cache.json` with fresh data.

---

## HOW TO RUN LOCAL SERVER

```bash
cd dashboard
npx http-server . -p 8080 -c-1 --cors
```
Then open http://localhost:8080

---

## ACCOUNTS (unchanged from V8)

| Role | Email | Hedera Account | EGGOCOIN |
|------|-------|----------------|----------|
| OWNER (SR) | r.aguileira88@gmail.com | 0.0.7166777 | 10 |
| Registry | eggologic-registry@outlook.com | 0.0.8292724 | 0 |
| Project_Proponent | eggologic-proponent@outlook.com | 0.0.8294621 | 1,190 |
| Operator | eggologic-operator@outlook.com | 0.0.8294659 | 0 |
| VVB | eggologic-vvb@outlook.com | 0.0.8294709 | 0 |

**Password for all:** `test`

---

## REFERENCED FILES

| File | Purpose |
|------|---------|
| `guardian/WORKFLOW-TEST-HANDOFF-V8.md` | Full Guardian policy context |
| `guardian/DASHBOARD-HANDOFF-V2.md` | Previous session (scaffold build) |
| `guardian/DASHBOARD-HANDOFF-V1.md` | Brainstorm results |
| `docs/stitch-screens/*.html` | Original Stitch HTML source (reference) |
| `docs/stitch-screens/*.png` | Original Stitch screenshots |
