# Dashboard Build — Handoff V1

## Status: BRAINSTORM COMPLETE — Ready to implement

**Date:** 2026-03-20
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)
**Previous handoff:** WORKFLOW-TEST-HANDOFF-V8.md (Guardian policy fully published & verified)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

1. **Deleted old dashboard/ and middleware/ folders** — fresh start, no legacy code
2. **Installed 3 Google Stitch skills** globally via `npx skills add`:
   - `stitch-design` — design generation/editing via Stitch MCP
   - `design-md` — design system synthesis into DESIGN.md
   - `enhance-prompt` — prompt enhancement for Stitch
3. **Configured Stitch MCP** in `.vscode/mcp.json` for direct API access
4. **Pulled all 4 Stitch screens** via MCP API (screenshots + HTML code):
   - Screen 1: Symmetrical Refined Marketplace
   - Screen 2: Refined Impact Report
   - Screen 3: Symmetrical Refined Wallet Details
   - Screen 4: Refined Eggologic Dashboard (main hub)
5. **Mapped every mock data point** across all 4 screens to Guardian API / Hedera endpoints
6. **Evaluated 3 architecture approaches** — recommended Approach A (static HTML + JS fetch)

---

## STITCH SCREENS

All assets saved in `docs/stitch-screens/`:

| # | Screen | Files | Dimensions |
|---|--------|-------|------------|
| 1 | Marketplace | `1-marketplace.html`, `1-marketplace.png` | 2560×4916 (DESKTOP) |
| 2 | Impact Report | `2-impact-report.html`, `2-impact-report.png` | 2560×6020 (DESKTOP) |
| 3 | Wallet Details | `3-wallet-details.html`, `3-wallet-details.png` | 2560×4436 (DESKTOP) |
| 4 | Dashboard | `4-dashboard.html`, `4-dashboard.png` | 2560×4762 (DESKTOP) |

**Stitch Project ID:** `4042493877223139973`

**Screen IDs:**
- Marketplace: `88f9fac4445545cba8c2a75dd965d393`
- Impact Report: `f891aa54a7a540318e6538b3b5fca22e`
- Wallet Details: `79c08591ddd94f3f9925e13fadc6b2f3`
- Dashboard: `74c666a5d4ec4453a41f1143efb65517`

**Tech in Stitch HTML:**
- Tailwind CSS (via CDN)
- Google Fonts: Newsreader (headline), Plus Jakarta Sans (body)
- Material Symbols Outlined (icons)
- Custom CSS: `.hero-curved-bg`, `.glass-card`, `.premium-card`
- No JavaScript — pure static HTML/CSS

---

## DATA MAPPING: Mock → Guardian API

### Screen 4: Dashboard (Main Hub)

| UI Element | Mock Value | Data Source | API Call |
|---|---|---|---|
| Organic Waste Processed | `5.1t` | Sum of `kg_ingreso` from approved deliveries | GET delivery VCs from VVB delivery data source block |
| CO2 Avoided | `5.2t` | `Σ (kg_ingreso × 0.70)` | Impact Calc VC or compute from deliveries |
| Eggs Produced | `1,020` | Production Output VC `cantidad_huevos` | GET production VCs from Operator |
| EGO Balance | `2,500 EGO` | HTS token balance | Hedera Mirror Node: `/api/v1/tokens/0.0.8287358/balances?account.id={accountId}` |
| Wallet transactions | `-500`, `+100`, `-200` | HTS transfer history | Mirror Node: `/api/v1/transactions?transactiontype=CRYPTOTRANSFER&account.id={accountId}` |
| Lifecycle satellite stats | Various | Aggregated from delivery, batch, production VCs | Multiple Guardian API calls |

### Screen 3: Wallet Details

| UI Element | Mock Value | Data Source | API Call |
|---|---|---|---|
| EGO Balance | `12,480 EGO` | HTS token balance | Mirror Node token balance query |
| Balance growth | `+12.5%` | Computed | Compare current vs historical balance |
| Transaction list | `-450`, `+138.20` | HTS transfers | Mirror Node transaction history |
| Staking Rewards | `4.2% APY` | **NOT IN GUARDIAN** | Static/placeholder for hackathon |
| Next Payout | `24 May` | **NOT IN GUARDIAN** | Static/placeholder |

### Screen 2: Impact Report

| UI Element | Mock Value | Data Source | API Call |
|---|---|---|---|
| Aggregate Score | `98.4%` | approved/total delivery ratio | Compute from VVB delivery approvals |
| CO2 Avoidance | `1,402 tonnes` | `Σ (kg_ajustados × 0.70 / 1000)` | Impact Calc VCs |
| Methane/Supply split | `72%/28%` | Derived or static | Could compute from category data |
| Waste chart (bar) | Oct 01–30 bars | Deliveries grouped by date | PP waste delivery VCs with timestamps |
| Milestones | Carbon Neutral, 100k Kg | Threshold checks | Computed from cumulative kg |

### Screen 1: Marketplace

| UI Element | Mock Value | Data Source | API Call |
|---|---|---|---|
| Product catalog | Compost 85 EC, Bins 120 EC, Eggs 65 EC | **NOT IN GUARDIAN** | Static product data |
| H2O Saved | `1.2M` | Derived or static | Could compute: waste × water factor |
| m² Reforested | `450k` | **NOT IN GUARDIAN** | Static |

---

## ARCHITECTURE DECISION (Pending User Approval)

**Recommended: Approach A — Static HTML + JS fetch calls**

```
docs/stitch-screens/          ← Stitch source (reference)
dashboard/
├── index.html                ← Screen 4: Dashboard (entry point)
├── wallet.html               ← Screen 3: Wallet Details
├── impact.html               ← Screen 2: Impact Report
├── marketplace.html          ← Screen 1: Marketplace
├── js/
│   ├── api.js                ← Guardian auth + API wrapper
│   ├── hedera.js             ← Mirror Node queries (balances, transfers)
│   ├── dashboard.js          ← Screen 4 data binding
│   ├── wallet.js             ← Screen 3 data binding
│   ├── impact.js             ← Screen 2 data binding
│   └── marketplace.js        ← Screen 1 data binding (mostly static)
└── css/
    └── custom.css            ← Shared styles extracted from Stitch
```

**Why this approach:**
- Fastest to implement (2-day deadline)
- No build tools needed
- Stitch HTML preserved nearly as-is
- Each page is independently deployable
- Demo-ready immediately

**Alternatives considered:**
- Approach B (Vite + React SPA) — too much setup for deadline
- Approach C (single page with tabs) — unmaintainable, huge file

---

## GUARDIAN API REFERENCE (from V8 handoff)

| Field | Value |
|---|---|
| Policy ID | `69bc4638e755119d0774dd03` |
| EGGOCOIN Token | `0.0.8287358` (fungible) |
| NFT Token | `0.0.8287362` (Circular Impact NFT) |
| Guardian URL | `https://guardianservice.app/api/v1` |
| Mirror Node URL | `https://testnet.mirrornode.hedera.com` |

### Key Guardian API Endpoints

```bash
# Auth
POST /accounts/loginByEmail → {email, password} → .login.refreshToken
POST /accounts/access-token → {refreshToken} → .accessToken

# Policy data
GET /policies/{policyId}/blocks  (with auth header)

# Block data (use block IDs from V8 handoff)
# VVB Delivery docs: block 3a5afd50-d4a5-49ca-866b-75477790ae4c
# VVB Impact Calc docs: block a77f0551-9cce-41c9-889d-c7b1110c059e
# Token History: block cd9ed4c2-ff79-474c-bd7c-6a9c525c6035
# Registry Supplier docs: block d6b1e092-59c1-48af-8671-1a5dfdeaaddb
```

### Key Hedera Mirror Node Endpoints

```bash
# Token balance
GET /api/v1/tokens/0.0.8287358/balances?account.id={accountId}

# Token info
GET /api/v1/tokens/0.0.8287358

# Transaction history (token transfers)
GET /api/v1/transactions?account.id={accountId}&transactiontype=CRYPTOTRANSFER&limit=25

# NFT holdings
GET /api/v1/tokens/0.0.8287362/nfts?account.id={accountId}
```

---

## USER ACCOUNTS (from V8 — for dashboard testing)

| Role | Username | Hedera Account |
|---|---|---|
| OWNER (SR) | `r.aguileira88@gmail.com` | `0.0.7166777` |
| Registry | `Registry` | `0.0.8292724` |
| Project_Proponent | `Proponent` | `0.0.8294621` |
| Operator | `Operator` | `0.0.8294659` |
| VVB | `VVB` | `0.0.8294709` |

**Password for all:** `test`

---

## MCP CONFIGURATION

`.vscode/mcp.json` configured with Stitch MCP server.
**NOTE:** API key needs rotation after this session.

---

## INSTALLED SKILLS

```
~/.agents/skills/stitch-design/    — Stitch design generation/editing
~/.agents/skills/design-md/        — Design system synthesis
~/.agents/skills/enhance-prompt/   — Prompt enhancement for Stitch
```

Also symlinked to `~/.claude/skills/`

---

## WHAT TO DO NEXT

1. **User confirms architecture approach** (A recommended)
2. **Create `dashboard/` folder** with the 4 HTML files (copy from Stitch source)
3. **Build `api.js`** — Guardian auth wrapper with token caching
4. **Build `hedera.js`** — Mirror Node query functions
5. **Wire Screen 4 (Dashboard)** first — it's the main entry point
6. **Wire Screen 3 (Wallet)** — token balances + transfer history
7. **Wire Screen 2 (Impact Report)** — aggregate stats from VCs
8. **Wire Screen 1 (Marketplace)** — mostly static, lowest priority
9. **Test end-to-end** with real Guardian accounts
10. **Deploy / demo prep** for March 22
