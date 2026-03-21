# EWD-RB v0.3 DEMO — Workflow Test Results

**Date:** 2026-03-18
**Policy ID:** `69ba1770e755119d0773d24a`
**Status:** ALL 10 STEPS COMPLETED SUCCESSFULLY

---

## Summary

| Step | Action | Result |
|------|--------|--------|
| 1 | OWNER submits Impact Calculation (Draft) | VC created, OWNER at "Submitted to approve" |
| 2 | PP registers SUP-001 (Restaurante El Buen Sabor) | VC created, PP at "Submitted to approve" |
| 3 | Registry approves SUP-001 | `option.status=Approved`, PP advances to tabs |
| 4 | Operator submits Production Output (OUT-2026-001) | VC created, Operator advances to tabs |
| 5 | VVB submits External Validation (VAL-2026-001) | VC created, VVB advances to tabs |
| 6 | PP submits 5 Waste Deliveries (ENT-001 to ENT-005) | 5 VCs created, all visible in grid |
| 7 | Operator submits Waste Batch (LOT-001) | VC created with 4 approved delivery_ids |
| 8 | OWNER submits Impact Calculation Issuance Lot (CALC-2026-002) | VC created, submitted for VVB approval |
| 9 | VVB approves Impact Calculations → NFT Mint | 2 mint events (mintDocumentBlock_90) |
| 10 | VVB approves/rejects Waste Deliveries → EGGOCOIN Mint | 4 approved, 1 rejected, 4 mint events |

## Minting Results

### NFT Mint (mintDocumentBlock_90) — Impact Calculation approvals
| Token ID (virtual) | Source | Amount |
|---|---|---|
| `e2be1620-2db5-491c-8b12-46eccf7b8092` | CALC-2026-001 | 0 |
| `e2be1620-2db5-491c-8b12-46eccf7b8092` | CALC-2026-002 | 0 |

NFT amount = 0 because `kg_ajustados_total = 135.1 < 1000 threshold` → `floor(135.1/1000) = 0`

### EGGOCOIN Mint (mintDocumentBlock_132) — Waste Delivery approvals
| Token ID (virtual) | Delivery | Amount (EGGOCOIN) |
|---|---|---|
| `55a234c4-f43d-4d5b-a4d9-0109fb985589` | ENT-001 | 33 |
| `55a234c4-f43d-4d5b-a4d9-0109fb985589` | ENT-002 | 34 |
| `55a234c4-f43d-4d5b-a4d9-0109fb985589` | ENT-003 | 31 |
| `55a234c4-f43d-4d5b-a4d9-0109fb985589` | ENT-005 | 37 |

**Total EGGOCOIN minted: 33 + 34 + 31 + 37 = 135**

### Validation Against Expected Values
| Metric | Expected | Actual | Match |
|---|---|---|---|
| Approved deliveries | 4 (ENT-001,002,003,005) | 4 | YES |
| Rejected deliveries | 1 (ENT-004) | 1 | YES |
| Total kg_ajustados_total | 135.1 | 135.1 | YES |
| NFTs minted | 0 | 0 | YES |
| Total EGGOCOIN | 135 | 135 | YES |

## Waste Delivery Details

| ID | Supplier | kg_bruto | kg_imp | ratio | Cat | kg_netos | kg_ajust | VVB Decision |
|---|---|---|---|---|---|---|---|---|
| ENT-001 | SUP-001 | 48.5 | 1.2 | 2.5% | A | 47.3 | 33.11 | Approved |
| ENT-002 | SUP-001 | 52.0 | 3.8 | 7.3% | B | 48.2 | 33.74 | Approved |
| ENT-003 | SUP-001 | 45.0 | 0.5 | 1.1% | A | 44.5 | 31.15 | Approved |
| ENT-004 | SUP-002 | 60.0 | 7.0 | 11.7% | C | 53.0 | 37.1 | Rejected |
| ENT-005 | SUP-001 | 55.0 | 2.0 | 3.6% | A | 53.0 | 37.1 | Approved |

## EGGOCOIN Minting Calculation Note

The mint amounts (33, 34, 31, 37) correspond to `round(kg_ajustados)` per delivery:
- ENT-001: round(33.11) = 33
- ENT-002: round(33.74) = 34
- ENT-003: round(31.15) = 31
- ENT-005: round(37.1) = 37

The mint block reads `field12` (kg_ajustados) from each delivery VC and rounds to integer.

## Key Observations

1. **Virtual tokens only** — DEMO mode uses internal UUIDs, not real Hedera token IDs
2. **No custom calculation logic** — all kg_netos, kg_ajustados, ratios, and categories are pre-computed by the tester/dashboard
3. **Single supplier registration per PP** — policy advances PP past the form after one submission
4. **OWNER "Submitted to approve" gate** — OWNER stays blocked until VVB approves the initial Impact Calculation
5. **Rejection category** — schema uses "C" (not "R") for rejected waste category
6. **Approval mechanism** — POST to buttonBlock with `{tag:"Button_0", document:<full_doc_object>}`

## Block IDs Reference (DEMO)

| Block | ID |
|---|---|
| OWNER Impact Calc form (initial) | `e369ccd6-e4f6-49fa-8157-cb4182b7fbac` |
| PP Supplier Reg form | `a2b0b77e-d085-482c-b428-c19b66e7ebc2` |
| Operator Production Output form | `672bc251-7577-468b-9148-db2b5a014f83` |
| VVB Ext Validation form | `df788af1-a7f0-41ad-b048-7a60a876f54e` |
| PP Waste Delivery form (in tabs) | `f2b4bbaf-05e8-4637-aee7-62516700a99f` |
| Operator Waste Batch form (in tabs) | `0a666f93-f4fe-4df3-bd91-54be43b82228` |
| OWNER Impact Calc form (in tabs) | `12609b50-9bc1-4084-91b2-45650aaafda1` |
| Registry Approve button | `06cf71b3-7e99-49d5-8471-e7f730e7ed8b` |
| VVB Approve Impact Calc button | `0d0ace42-9ad0-4b62-9b92-7606c6f22853` |
| VVB Approve Waste Delivery button | `e6b5916b-b2af-4cd5-8cf6-88e17d96e397` |
