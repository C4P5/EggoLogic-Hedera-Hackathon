# Dashboard Build — Handoff V5

## Status: POLISH IN PROGRESS — Global data visible without login, HashScan links, $EGGO branding

**Date:** 2026-03-20
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)
**Previous handoffs:** V4 (mobile/deploy), V3 (CORS fix), V2 (scaffold), V1 (brainstorm)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

1. **HashScan Explorer Links**
   - All transaction rows in dashboard + wallet link to `hashscan.io/testnet/transaction/{txId}`
   - All holder rows in wallet link to `hashscan.io/testnet/account/{accountId}`
   - `CONFIG.HASHSCAN_URL` added to config.js
   - `open_in_new` icon appears on hover, links open in new tab

2. **Login Gate Removed for Global Data**
   - **impact.js** — `loadImpact()` runs for ALL visitors (Guardian cache + public Hedera API)
   - **dashboard.js** — Split into `loadGlobalMetrics()` (always) + `loadUserData()` (login only)
   - **wallet.js** — Split into `loadGlobalWallet()` (supply + holders) + `loadUserWallet()` (balance + txs)
   - **marketplace.js** — Cleaned up redundant login branch (was already public)
   - Judges can now see full impact data, metrics, and holders without logging in

3. **NFT Milestone Unlocked**
   - Milestone circle changed from grey lock → gold trophy with "UNLOCKED" badge
   - Text: "1,800+ kg processed — exceeded 1,000 kg threshold"
   - Dynamic update in impact.js writes actual `totalKg` after data loads
   - EGGOCOIN minted milestone updated to show live supply (was hardcoded "135")

4. **$EGGO Branding**
   - All display instances of "EGO" changed to "$EGGO" across dashboard.js, wallet.js, index.html, wallet.html

5. **User also manually edited (outside Claude):**
   - index.html — H1 sizing, hero text, footer text
   - impact.html — Footer updated to match index style, copyright text changed
   - marketplace.html — Various text/heading edits
   - wallet.html — Text edits

---

## FILE CHANGES (this session)

| File | Change |
|------|--------|
| `dashboard/js/config.js` | Added `HASHSCAN_URL` constant |
| `dashboard/js/dashboard.js` | Split into `loadGlobalMetrics()` + `loadUserData()`, HashScan tx links, $EGGO branding |
| `dashboard/js/impact.js` | Removed login gate, dynamic milestone updates, NFT milestone fix |
| `dashboard/js/wallet.js` | Split into `loadGlobalWallet()` + `loadUserWallet()`, HashScan links, $EGGO branding |
| `dashboard/js/marketplace.js` | Simplified — removed redundant login branch |
| `dashboard/index.html` | $EGGO in wallet placeholder + user's manual edits |
| `dashboard/impact.html` | NFT milestone unlocked + EGGOCOIN milestone text + user's footer edits |
| `dashboard/wallet.html` | $EGGO in hero balance placeholder |
| `dashboard/marketplace.html` | User's manual text/heading edits |

---

## ARCHITECTURE: DATA LOADING (updated)

| Page | Global (no login) | User-specific (login) |
|------|---|---|
| **index.html** | `loadGlobalMetrics()` — hero waste/CO2/eggs, lifecycle satellites (Guardian cache) | `loadUserData()` — wallet balance, tx widget, recent activity (Hedera Mirror) |
| **impact.html** | `loadImpact()` — ALL data: aggregate score, CO2 ring, waste chart, milestones, supply | Nothing — everything is global |
| **wallet.html** | `loadGlobalWallet()` — total supply, all holders list (Hedera Mirror) | `loadUserWallet()` — personal balance, tx history |
| **marketplace.html** | `loadMarketplace()` — H2O saved, reforested stats (Hedera Mirror) | Nothing |

---

## REMAINING POLISH TASKS (from V4 list)

### Done this session:
- [x] HashScan explorer links on transactions + holders
- [x] NFT milestone fix (1,800 kg > 1,000 kg threshold)
- [x] Global data visible without login

### Still pending:
1. **"Live from Hedera" badge** — green pulse dot + text near hero metrics
2. **Fade-in animations** — CSS transitions when data values populate
3. **Favicon** — egg icon as SVG inline data URI (all 4 pages)
4. **OG meta tags** — social sharing preview (all 4 pages)
5. **Toast notification** — show after successful login (CSS `.toast` class exists)
6. **Chart bar entrance animations** — bars grow up on impact page
7. **Clean up unused vars** — `supply` + `tokenData` in dashboard.js, `maxKg` in impact.js
8. **"Download Impact Report"** — print-friendly button on impact page
9. **Footer consistency** — user started manually, may need final pass to ensure all 4 match

### Known issues:
- Staking section on wallet is static placeholder
- "Redeem Credits" button is non-functional
- Some text/heading changes were done manually and may need review

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

## REFERENCED FILES

| File | Purpose |
|------|---------|
| `guardian/DASHBOARD-HANDOFF-V4.md` | Previous session (mobile + deploy) |
| `guardian/DASHBOARD-HANDOFF-V3.md` | CORS fix + real data context |
| `.github/workflows/deploy-pages.yml` | GitHub Pages deploy workflow |
