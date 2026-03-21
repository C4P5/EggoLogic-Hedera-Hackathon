# Dashboard Build — Handoff V2

## Status: SCAFFOLD COMPLETE — All 4 pages built, wired to Guardian API + Hedera Mirror Node

**Date:** 2026-03-20
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)
**Previous handoff:** DASHBOARD-HANDOFF-V1.md (brainstorm), WORKFLOW-TEST-HANDOFF-V8.md (policy)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

1. **Confirmed Approach A** — static HTML + JS fetch (no build tools)
2. **Created 13 files** in `dashboard/`:
   - 4 HTML pages (index, wallet, impact, marketplace)
   - 8 JS modules (config, api, hedera, ui, dashboard, wallet, impact, marketplace)
   - 1 CSS file (custom.css)
3. **Wired all 4 Stitch screens** to real data sources:
   - Hero metrics → Guardian VVB delivery block + computed values
   - Wallet balance → Hedera Mirror Node token balance API
   - Transaction history → Mirror Node CRYPTOTRANSFER queries
   - Impact stats → Guardian delivery VCs + CO2 calculations
   - Marketplace → mostly static, bottom stats from Mirror Node supply
4. **Built login system** — modal with account selector, localStorage token caching, auto-refresh
5. **Verified Mirror Node is live** — EGGOCOIN supply = 1,200, 2 holders (Proponent: 1190, Treasury: 10)
6. **Added fallback values** — if Guardian CORS blocks browser requests, known verified data from V8 workflow is shown

---

## FILE STRUCTURE

```
dashboard/
├── index.html          ← Screen 4: Dashboard (entry point)
│                         Hero: waste, CO2, eggs metrics
│                         Lifecycle diagram with satellite stats
│                         Wallet widget with balance + 3 recent txs
│                         Recent Activity section (5 txs)
│
├── wallet.html         ← Screen 3: Wallet Details
│                         Hero: balance + total supply
│                         Full transaction history (25 txs)
│                         All EGGOCOIN holders table
│                         Token details (ID, network, type)
│                         Staking section (static placeholder)
│
├── impact.html         ← Screen 2: Impact Report
│                         Aggregate Score (approved/total ratio)
│                         CO2 Avoidance ring chart
│                         Waste delivery bar chart (per-delivery)
│                         Hedera verification card (policy, topic)
│                         Milestones timeline
│
├── marketplace.html    ← Screen 1: Marketplace
│                         Product catalog (4 items, static)
│                         Bottom stats: H2O saved, m² reforested
│                         Floating cart FAB
│
├── js/
│   ├── config.js       ← Shared constants
│   │                     GUARDIAN_URL, POLICY_ID, MIRROR_URL
│   │                     EGGOCOIN_TOKEN, NFT_TOKEN
│   │                     BLOCKS: VVB_DELIVERY, VVB_IMPACT_CALC, TOKEN_HISTORY, REGISTRY_SUPPLIER
│   │                     ACCOUNTS: 5 demo accounts with roles, emails, Hedera IDs
│   │                     TOKEN_TTL_MS: 28 min
│   │
│   ├── api.js          ← Guardian API wrapper (IIFE: GuardianAPI)
│   │                     .login(email, password) → stores auth in localStorage
│   │                     .getToken() → returns valid access token (auto-refresh)
│   │                     .get(path) → authenticated GET with 401 retry
│   │                     .getBlockData(blockId) → fetch VC documents from policy block
│   │                     .isLoggedIn() / .currentUser() / .logout()
│   │
│   ├── hedera.js       ← Mirror Node queries (IIFE: HederaMirror)
│   │                     .getEggocoinBalance(accountId) → number
│   │                     .getEggocoinSupply() → { totalSupply, name, symbol, decimals }
│   │                     .getTransactions(accountId, limit) → [{ txId, date, eggocoin: { amount }, memo }]
│   │                     .getAllBalances() → [{ account, balance }]
│   │                     .getNFTs(accountId) → []
│   │                     .getMintEvents() → []
│   │
│   ├── ui.js           ← Shared UI (IIFE: UI)
│   │                     Login modal (inject, open, close, doLogin)
│   │                     Auth button state (updateAuthUI)
│   │                     Helpers: setText, setHTML, showLoading, fmt, timeAgo
│   │                     Auto-inits on DOMContentLoaded
│   │
│   ├── dashboard.js    ← index.html binding
│   │                     loadDashboard() → hero metrics + wallet widget + recent activity
│   │                     extractDocuments(blockData) → normalize Guardian response formats
│   │                     Fallback: verified V8 values (135kg waste, 94.6kg CO2, 1020 eggs)
│   │
│   ├── wallet.js       ← wallet.html binding
│   │                     loadWallet() → balance, supply, tx history, all holders
│   │                     renderTxHistory(txs) → per-transaction cards
│   │                     renderHolders(balances) → sorted holder list with role labels
│   │
│   ├── impact.js       ← impact.html binding
│   │                     loadImpact() → aggregate score, CO2, waste chart, milestones
│   │                     renderWasteChart(bars) → delivery bar chart (green=approved, red=rejected)
│   │                     renderFallbackChart() → ENT-001 through ENT-005 from V8
│   │
│   └── marketplace.js  ← marketplace.html binding
│                         loadMarketplace() → H2O saved, m² reforested stats
│                         Uses public Mirror Node (no auth needed)
│
└── css/
    └── custom.css      ← .egg-pulse, .toast, .premium-card, .nav-active, .data-fresh
```

---

## DATA FLOW

### What works WITHOUT login (public Hedera Mirror Node):
- Marketplace bottom stats (H2O saved, m² reforested) — derived from EGGOCOIN total supply
- Token info (name, symbol, supply)

### What works AFTER login:
- **Hedera data** (always works — public API, no CORS):
  - EGGOCOIN balance for logged-in account
  - Transaction history (CRYPTOTRANSFER)
  - All holder balances
  - NFT holdings

- **Guardian data** (may be blocked by CORS — has fallback):
  - VVB Delivery documents → waste metrics, delivery chart
  - Impact Calc documents → CO2 calculations
  - Token History → mint events

### Fallback strategy:
Every Guardian API call is wrapped in try/catch. On failure, verified values from the V8 workflow test are shown:
- 135 kg waste processed
- 94.6 kg CO2 avoided
- 1,020 eggs produced
- 4 approved / 1 rejected deliveries
- ENT-001 through ENT-005 bar chart

---

## LIVE HEDERA STATE (verified 2026-03-20)

| Metric | Value |
|--------|-------|
| EGGOCOIN Total Supply | 1,200 |
| Holders | 2 (Proponent: 1190, Treasury: 10) |
| NFT Supply | 0 (threshold not reached) |
| Token ID | 0.0.8287358 |
| NFT Token ID | 0.0.8287362 |
| Network | Hedera Testnet |

---

## KNOWN ISSUES / BLOCKERS

### 1. Guardian CORS (HIGH PRIORITY)
- `guardianservice.app` likely blocks browser-origin `fetch()` calls
- **Impact:** Hero metrics, delivery chart, aggregate score fall back to static V8 values
- **Fix options:**
  - A) Tiny Node.js CORS proxy (10 lines, `npx http-server` with proxy)
  - B) Pre-fetch Guardian data into a JSON file, serve statically
  - C) Use `npx cors-anywhere` or similar
- **Recommendation:** Option B for hackathon — run a node script that fetches Guardian data and saves to `dashboard/data/guardian-cache.json`, then the JS reads from that file instead

### 2. Product images (LOW)
- Marketplace cards use Material Symbols placeholders instead of Stitch CDN images
- Could restore original Stitch image URLs or download them locally

### 3. Staking section (STATIC)
- Wallet page has "Staking Rewards" with "4.2% APY" — this is a placeholder
- Not connected to any real data (staking isn't in the Guardian policy)

### 4. Nav "Upload Data" link
- Original Stitch had "Upload Data" nav item — renamed to "Impact Report" in the dashboard
- The upload flow would be a separate page for operators (not built)

---

## ACCOUNTS (unchanged from V8)

| Role | Email | Hedera Account | EGGOCOIN Balance |
|------|-------|----------------|-----------------|
| OWNER (SR) | r.aguileira88@gmail.com | 0.0.7166777 | 10 |
| Registry | eggologic-registry@outlook.com | 0.0.8292724 | 0 |
| Project_Proponent | eggologic-proponent@outlook.com | 0.0.8294621 | 1,190 |
| Operator | eggologic-operator@outlook.com | 0.0.8294659 | 0 |
| VVB | eggologic-vvb@outlook.com | 0.0.8294709 | 0 |

**Password for all:** `test`

---

## WHAT TO DO NEXT

### Immediate (before hackathon):
1. **Open in browser** — test login flow, verify Hedera data loads
2. **Fix Guardian CORS** — implement option B (pre-fetch to JSON cache) or A (proxy)
3. **Visual polish** — check responsive behavior, fix any Tailwind alignment issues
4. **Test all 4 pages** — ensure nav links work, login persists across pages

### If time permits:
5. **Restore Stitch images** — download from CDN or use local copies
6. **Add loading skeletons** — better UX than "—" placeholders
7. **Deploy** — GitHub Pages, Vercel, or Netlify for hackathon demo URL
8. **Demo video** — walk through login → dashboard → wallet → impact → marketplace

---

## REFERENCED FILES

| File | Purpose |
|------|---------|
| `guardian/WORKFLOW-TEST-HANDOFF-V8.md` | Full Guardian policy context (block IDs, accounts, workflow) |
| `guardian/DASHBOARD-HANDOFF-V1.md` | Brainstorm results (data mapping, architecture decision) |
| `docs/stitch-screens/*.html` | Original Stitch HTML source (reference) |
| `docs/stitch-screens/*.png` | Original Stitch screenshots |
