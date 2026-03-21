# CIT Progress Tracker Card — Design Spec

**Date:** 2026-03-20
**Status:** Approved
**Replaces:** Staking Rewards card on wallet.html (lines 132-166)

---

## Overview

Replace the static "Staking Rewards" placeholder on the wallet page with a live **Circular Impact Token (CIT) Progress Tracker** card. CIT is an HTS Non-Fungible Token (0.0.8287362, symbol CIN) representing 1 tonne of CO2 avoided through composting, minted by the Guardian EWD-RB policy when verified waste reaches the 1,000 kg threshold.

## Visual Structure

Same skeleton as current staking card: white `rounded-3xl` card, `p-10`, flex column, justify-between.

### Elements (top to bottom)

1. **Header**: `verified` icon in green circle (`w-14 h-14`) + "Circular Impact Token" title (bold 2xl)
2. **Description**: "Each CIT represents 1 tonne of CO2 avoided through composting. Minted as an NFT when verified waste reaches the 1,000 kg threshold."
3. **Info Row 1**: TOTAL COMPOSTED / YOUR COMPOSTED — $EGGO balance
4. **Info Row 2**: CIT MINTED / YOUR CIT — NFT count
5. **Token Details block**: Token ID, Network, Type
6. **CTA button**: "View on HashScan" → https://hashscan.io/testnet/token/0.0.8287362

### Two States

| State | Row 1 Label | Row 1 Value | Row 2 Label | Row 2 Value |
|-------|-------------|-------------|-------------|-------------|
| **Global** (no login) | TOTAL COMPOSTED | total_supply of EGGOCOIN + " $EGGO" | CIT MINTED | total_supply of CIT token |
| **User** (logged in) | YOUR COMPOSTED | user's EGGOCOIN balance + " $EGGO" | YOUR CIT | user's NFT count for CIT token |

## Data Fetching

### New functions in hedera.js

- `getCITSupply()` — GET `/api/v1/tokens/0.0.8287362` → returns `total_supply`
- `getUserCIT(accountId)` — GET `/api/v1/accounts/{accountId}/nfts?token.id=0.0.8287362` → returns `nfts.length`

### Integration in wallet.js

- `loadGlobalWallet()` — call `getCITSupply()`, populate Row 2 with global total; also show total EGGOCOIN supply in Row 1
- `loadUserWallet()` — call `getUserCIT(accountId)`, populate Row 2 with user count; Row 1 already shows user EGGOCOIN balance

Both use `UI.setText()` for fade-in animations.

## File Changes

| File | Change |
|------|--------|
| `dashboard/wallet.html` | Replace staking card HTML (lines 132-166) with CIT card |
| `dashboard/js/hedera.js` | Add `getCITSupply()` and `getUserCIT(accountId)` |
| `dashboard/js/wallet.js` | Wire CIT data into global and user wallet loaders |

## Token Details

- **Token ID:** 0.0.8287362
- **Symbol:** CIN
- **Type:** NON_FUNGIBLE_UNIQUE
- **Current Supply:** 4 (on-chain)
- **Treasury:** 0.0.7166777
- **HashScan:** https://hashscan.io/testnet/token/0.0.8287362

## Constraints

- No build tools — static HTML + Tailwind CDN
- Must work without login (global view) and with login (user view)
- Hackathon deadline: 2026-03-22
