# EWD-RB v0.3 — Workflow Test Handoff v2

## Status: Ready to discover schema fields & execute 10-step test

Everything below is confirmed working. The next session should jump straight to extracting field mappings from the 4 form blocks, then walk through the 10 steps.

---

## Auth (confirmed working)

```bash
# Step 1: Login
curl -s -X POST "https://guardianservice.app/api/v1/accounts/loginByEmail" \
  -H "Content-Type: application/json" \
  -d '{"email":"r.aguileira88@gmail.com","password":"test"}'
# → returns refreshToken

# Step 2: Access token
curl -s -X POST "https://guardianservice.app/api/v1/accounts/access-token" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<from step 1>"}'
# → returns accessToken

# All subsequent: Authorization: Bearer {accessToken}
```

## DEMO Policy

- **Policy ID:** `69ba1770e755119d0773d24a`
- **Guardian URL:** https://guardianservice.app

## Virtual Users (all created, roles assigned)

| User | DID | Role | State |
|------|-----|------|-------|
| Administrator | `did:hedera:testnet:Gt2DaoWQqV1NA5P6X4EqoTh9PcrZCv5qAUytYnCGrUJy_0.0.8187554` | OWNER | At registration form |
| Virtual User 1 | `did:hedera:testnet:6n9k4gtXzWFahyRLKjrvQrjVbQKuChJ7gSGq4Eo2npPJ_0.0.8187554` | Registry | At approval queue |
| Virtual User 2 | `did:hedera:testnet:3x4yLYnb5f5vookE4X1FYCFW2Ph4z7BJruAV3yuHBrRn_0.0.8187554` | Project_Proponent | At registration form |
| Virtual User 3 | `did:hedera:testnet:J9ZBDTybaWfvcxUo8mjj2BE51yydJHnP5My4Gvt8Wz7i_0.0.8187554` | Operator | At registration form |
| Virtual User 4 | `did:hedera:testnet:hFW6Va1fn7R4KaC4ak8no5Tg4vgpkUNV2QbSdcqYwLM_0.0.8187554` | VVB | At registration form |

## Role Strings (exact, with trailing spaces)

```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```

## API Patterns

```bash
# Switch active virtual user
POST /api/v1/policies/{POLICY_ID}/dry-run/login
Body: {"did": "<user_did>"}

# Get blocks for active user
GET /api/v1/policies/{POLICY_ID}/blocks

# Get specific block
GET /api/v1/policies/{POLICY_ID}/blocks/{BLOCK_ID}

# Submit data to a block
POST /api/v1/policies/{POLICY_ID}/blocks/{BLOCK_ID}
Body: {"document": { ...fields... }, "ref": null}
```

## Schema UUIDs (from PUBLISH policy, same structure in DEMO)

| Schema UUID | Name |
|---|---|
| `#076d4b8b-2e17-4732-8e0d-4cd895d5fa50` | EWD-RB Impact Calculation |
| `#834d38df-1477-4227-9f11-3111d1f0b284` | EWD-RB Supplier Registration |
| `#9b94f18f-bcb2-46f2-8844-12469fdbd119` | EWD-RB Waste Delivery |
| `#9c466168-bcdf-47a8-8d68-28441f440b41` | EWD-RB Production Output |
| `#52b3c363-abd3-4c67-8609-10808e559612` | EWD-RB VVB Assessment Record |
| `#10b84954-87d5-43b4-99a8-dc5b0beaa304` | EWD-RB External Validation Record |
| `#0ef1332a-f0f4-46cd-81a5-dda94c61e8ae` | EWD-RB Issuance Record |
| `#450a008f-d1ba-4b67-b713-8e9d0a68bf32` | (Waste Batch — used by Operator) |

## Key Block IDs (DEMO policy)

- OWNER registration form: `e369ccd6-e4f6-49fa-8157-cb4182b7fbac` (Impact Calculation schema)
- PP step block: `63c1d13e-2f3b-4b18-a54b-400bd15d3399`
- Operator step block: `62439e6d-5b7d-4437-acaf-d199e47f089e`
- VVB step block: `51cdc8d7-a36b-432d-932d-d37d6aa6e27f`

## Partial Field Mapping (Impact Calculation — discovered from API)

From querying block `e369ccd6-e4f6-49fa-8157-cb4182b7fbac`, the schema name is `EWD-RB Impact Calculation` (UUID `626bc024-edb1-4257-a4bf-763125864e62` in DEMO).

Fields confirmed so far:
- `field0` → methodology_id (string)
- `field1` → methodology_version (number)
- `field2` → schema_version (string)
- `field3` → (needs extraction — response was truncated)
- ... remaining fields need extraction

**The full response (7217 bytes) is saved at:** `C:/Users/CAPS/guardian_tmp/owner_form.json`

## WHAT TO DO NEXT

### Step A: Extract all field mappings

For each of the 4 registration form blocks, authenticate, switch to the right virtual user, query the block, and extract the `fieldN → description` mapping from `schema.document.properties`.

1. **OWNER form** (`e369ccd6-...`): Impact Calculation schema — partially extracted, file at `guardian_tmp/owner_form.json`, just parse it
2. **PP form**: Switch to VU2, query step block `63c1d13e-...`, find the child `requestVcDocumentBlock`, query it → Supplier Registration schema
3. **Operator form**: Switch to VU3, query step block `62439e6d-...` → Production Output schema
4. **VVB form**: Switch to VU4, query step block `51cdc8d7-...` → External Validation schema

For the schemas used later (Waste Delivery, Waste Batch, VVB Assessment), those form blocks become available AFTER the registration steps complete. Query them then.

### Step B: Walk through 10-step workflow

See WORKFLOW-TEST-HANDOFF.md Steps 1-10. The test data is in Appendix D of the methodology PDF and summarized in the handoff doc.

Simplified test data for the handoff doc steps:

**Step 6 Waste Deliveries:**
| ID | supplier_id | fecha | kg_bruto | kg_impropios | Expected |
|---|---|---|---|---|---|
| ENT-001 | SUP-001 | 2026-02-01 | 48.5 | 1.2 | A (2.5%) |
| ENT-002 | SUP-001 | 2026-02-03 | 52.0 | 3.8 | B (7.3%) |
| ENT-003 | SUP-001 | 2026-02-05 | 45.0 | 0.5 | A (1.1%) |
| ENT-004 | SUP-002 | 2026-02-07 | 60.0 | 7.0 | R (11.7%) |
| ENT-005 | SUP-001 | 2026-02-08 | 55.0 | 2.0 | A (3.6%) |

**Expected totals (approved only):** kg_bruto=200.5, kg_impropios=7.5, kg_netos=193.0, kg_ajustados=135.1, NFTs=0 (below 1000), EGGOCOIN=135

## Known Issues

1. **No custom logic blocks** — all calculations (kg_netos, kg_ajustados, category, eggo_points) must be pre-computed by the dashboard/tester
2. **No Issuance Record creation block** — view-only
3. **Empty token template in DEMO** — minting may create virtual tokens only
4. **Trailing whitespace in roles** — must include exact trailing spaces
5. **Windows environment** — use `C:/Users/CAPS/guardian_tmp/` for temp files, no `/tmp/`, no python (use node for JSON parsing)

## Formulas (for pre-computing values)

```
kg_netos = max(kg_bruto - kg_impropios, 0)
kg_ajustados = kg_netos × 0.70
ratio_impropios = kg_impropios / kg_bruto
Category: A if ratio ≤ 0.05, B if 0.05 < ratio ≤ 0.10, R if ratio > 0.10
eggo_points = round(kg_ajustados, 0)
nfts_to_mint = floor(kg_ajustados_total / 1000)
```
