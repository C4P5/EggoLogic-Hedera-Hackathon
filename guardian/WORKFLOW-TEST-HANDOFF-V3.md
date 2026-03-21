# EWD-RB v0.3 — Handoff v3 (Post-Workflow Test)

## Status: 10-step DEMO workflow test COMPLETE. Ready for next phase.

**Date:** 2026-03-18
**Previous handoffs:** V1 (setup), V2 (field discovery + test plan), V3 (this — results + next steps)

---

## What Was Accomplished

All 10 steps of the EWD-RB v0.3 MRV pipeline were executed end-to-end on the DEMO policy via API. Every step succeeded, including minting.

### Workflow Execution Summary

| Step | Who | What | Result |
|------|-----|------|--------|
| 1 | OWNER | Submit Impact Calculation (Draft) | VC created → "Submitted to approve" |
| 2 | PP (VU2) | Register SUP-001 (Restaurante El Buen Sabor) | VC created → "Submitted to approve" |
| 3 | Registry (VU1) | Approve SUP-001 | PP advances to tabs interface |
| 4 | Operator (VU3) | Submit Production Output (OUT-2026-001) | VC created → tabs interface |
| 5 | VVB (VU4) | Submit External Validation (VAL-2026-001) | VC created → tabs interface |
| 6 | PP (VU2) | Submit 5 Waste Deliveries (ENT-001 to ENT-005) | 5 VCs in grid |
| 7 | Operator (VU3) | Submit Waste Batch (LOT-001) | VC created |
| 8 | OWNER | Submit Impact Calc Issuance Lot (CALC-2026-002) | VC created → VVB queue |
| 9 | VVB (VU4) | Approve both Impact Calculations | 2 mint events (NFT=0) |
| 10 | VVB (VU4) | Approve 4 deliveries, reject ENT-004 | 4 EGGOCOIN mints, total=135 |

### Minting Results
- **NFT (mintDocumentBlock_90):** 0 minted (135.1 kg < 1000 kg threshold) — correct
- **EGGOCOIN (mintDocumentBlock_132):** 135 total (33+34+31+37) — correct
- Tokens are virtual (DEMO mode UUIDs, not real Hedera HTS tokens)

### Test Data Validation
| Metric | Expected | Actual | Match |
|---|---|---|---|
| Approved deliveries | 4 | 4 | YES |
| Rejected deliveries | 1 (ENT-004, 11.7% impropios) | 1 | YES |
| kg_ajustados_total | 135.1 | 135.1 | YES |
| NFTs | 0 | 0 | YES |
| EGGOCOIN | 135 | 135 | YES |

---

## Current State of DEMO Policy

### Virtual Users (all at tabs interface except Registry)

| User | DID | Role | Current State |
|------|-----|------|---------------|
| Administrator | `did:hedera:testnet:Gt2DaoWQqV1NA5P6X4EqoTh9PcrZCv5qAUytYnCGrUJy_0.0.8187554` | OWNER | Tabs (10 tabs) |
| Virtual User 1 | `did:hedera:testnet:6n9k4gtXzWFahyRLKjrvQrjVbQKuChJ7gSGq4Eo2npPJ_0.0.8187554` | Registry | Tabs (4 tabs) |
| Virtual User 2 | `did:hedera:testnet:3x4yLYnb5f5vookE4X1FYCFW2Ph4z7BJruAV3yuHBrRn_0.0.8187554` | Project_Proponent | Tabs (5 tabs) |
| Virtual User 3 | `did:hedera:testnet:J9ZBDTybaWfvcxUo8mjj2BE51yydJHnP5My4Gvt8Wz7i_0.0.8187554` | Operator | Tabs (5 tabs) |
| Virtual User 4 | `did:hedera:testnet:hFW6Va1fn7R4KaC4ak8no5Tg4vgpkUNV2QbSdcqYwLM_0.0.8187554` | VVB | Tabs (7 tabs) |

### Documents in the System

| Schema | Count | Status |
|--------|-------|--------|
| Impact Calculation | 2 | Both Approved |
| Supplier Registration | 1 (SUP-001) | Approved |
| Waste Delivery | 5 | 4 Approved, 1 Rejected |
| Waste Batch | 1 (LOT-001) | Closed |
| Production Output | 1 (OUT-2026-001) | Submitted |
| External Validation | 1 (VAL-2026-001) | Submitted |
| Token History | 6 mint events | Virtual tokens |

---

## Auth (unchanged)

```bash
# Login
curl -s -X POST "https://guardianservice.app/api/v1/accounts/loginByEmail" \
  -H "Content-Type: application/json" \
  -d '{"email":"r.aguileira88@gmail.com","password":"test"}'
# → .login.refreshToken

# Access token
curl -s -X POST "https://guardianservice.app/api/v1/accounts/access-token" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<from above>"}'
# → .accessToken
```

## Policy & API

- **Policy ID:** `69ba1770e755119d0773d24a`
- **Base URL:** `https://guardianservice.app`
- **Switch user:** `POST /api/v1/policies/{POLICY}/dry-run/login` with `{"did":"..."}`
- **Get blocks:** `GET /api/v1/policies/{POLICY}/blocks`
- **Submit form:** `POST /api/v1/policies/{POLICY}/blocks/{BLOCK_ID}` with `{"document":{...},"ref":null}`
- **Approve/reject:** `POST /api/v1/policies/{POLICY}/blocks/{BUTTON_BLOCK_ID}` with `{"tag":"Button_0","document":<full_doc_object>}` (Button_0=Approve, Button_1=Reject)

## Role Strings (with trailing whitespace — MUST be exact)

```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```

---

## Complete Block ID Reference

### Registration Forms (initial — before tabs)
| Role | Form Block (requestVcDocument) | Schema |
|------|-------------------------------|--------|
| OWNER | `e369ccd6-e4f6-49fa-8157-cb4182b7fbac` | Impact Calculation |
| PP | `a2b0b77e-d085-482c-b428-c19b66e7ebc2` | Supplier Registration |
| Operator | `672bc251-7577-468b-9148-db2b5a014f83` | Production Output |
| VVB | `df788af1-a7f0-41ad-b048-7a60a876f54e` | External Validation |

### In-Tabs Forms (after registration)
| Role | Tab | Form Block | Schema |
|------|-----|-----------|--------|
| PP | Waste Delivery | `f2b4bbaf-05e8-4637-aee7-62516700a99f` | Waste Delivery |
| Operator | Waste Batch | `0a666f93-f4fe-4df3-bd91-54be43b82228` | Waste Batch |
| OWNER | Impact Calculation | `12609b50-9bc1-4084-91b2-45650aaafda1` | Impact Calculation |

### Button Blocks (Approve/Reject)
| Role | Context | Button Block ID |
|------|---------|----------------|
| Registry | Supplier Registration | `06cf71b3-7e99-49d5-8471-e7f730e7ed8b` |
| VVB | Impact Calculation | `0d0ace42-9ad0-4b62-9b92-7606c6f22853` |
| VVB | Waste Delivery | `e6b5916b-b2af-4cd5-8cf6-88e17d96e397` |

---

## Complete Schema Field Mappings

See `C:/Users/CAPS/guardian_tmp/field_mappings.md` for the full reference, or the raw JSON files:
- `guardian_tmp/owner_form.json` — Impact Calculation
- `guardian_tmp/pp_form.json` — Supplier Registration
- `guardian_tmp/op_form.json` — Production Output
- `guardian_tmp/vvb_form.json` — External Validation
- `guardian_tmp/waste_delivery_form.json` — Waste Delivery (queried in-session)

---

## Key Discoveries from Testing

1. **Approval POST format:** Must send `{"tag":"Button_0","document":<FULL document object from data array>}` — not just a document ID
2. **OWNER gate:** OWNER stays at "Submitted to approve" until VVB approves the initial Impact Calculation
3. **Single supplier per PP:** Policy advances PP past registration form after one submission
4. **Rejection category:** Schema enum is `["A","B","C"]` not `["A","B","R"]` — category C = reject
5. **EGGOCOIN minting:** Reads `field12` (kg_ajustados) per delivery, rounds to integer
6. **NFT minting:** Reads `field10` (nfts_to_mint) from Impact Calculation
7. **No custom logic blocks:** All calculations must be pre-computed before submission
8. **Virtual tokens in DEMO:** Token IDs are UUIDs, not real Hedera token IDs

## Known Limitations

1. **SUP-002 not registered** — Only SUP-001 was registered because PP gets one registration before advancing. ENT-004 (from SUP-002) was submitted anyway but rejected.
2. **No VVB Assessment Record** — The VVB Assessment tab exists but wasn't used in this test flow.
3. **No Issuance Record creation** — Tab is view-only everywhere.
4. **Token History scoping** — OWNER sees 0 mint events; VVB sees 6. Document visibility is role-scoped.

---

## Possible Next Steps

1. **Verify in Guardian UI** — Log into https://guardianservice.app, open the DEMO policy, switch between virtual users to visually confirm all documents and mint events
2. **PUBLISH policy test** — Run the same 10 steps on the published policy with real Hedera transactions
3. **Dashboard integration** — Build the frontend that pre-computes kg_netos, kg_ajustados, categories, and eggo_points before submitting to Guardian
4. **Second supplier registration** — Test registering SUP-002 (may require a second PP virtual user or policy restart)
5. **VVB Assessment flow** — Test the VVB Assessment Record schema/tab
6. **Stress test** — Submit larger datasets to verify the pipeline handles volume

## Environment Notes

- **Windows** — use `C:/Users/CAPS/guardian_tmp/` for temp files
- **No python** — use `node -e` for JSON parsing
- **Token expiry** — re-authenticate if you get 401 errors (tokens last ~30 min)
