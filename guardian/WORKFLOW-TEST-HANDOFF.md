# EWD-RB v0.3 — Full Workflow Test Handoff

## Objective

Walk through the complete MRV pipeline on the DEMO policy to verify all blocks, events, approvals, and minting work end-to-end. Use test data from the methodology's Appendix D.

---

## Environment

- **Guardian URL:** https://guardianservice.app
- **Policy:** `EWD-RB v0.3 _1773803376991` (DEMO mode)
- **Policy ID:** `69ba1770e755119d0773d24a`
- **Auth:** SR login via `POST /api/v1/accounts/loginByEmail` with `email: r.aguileira88@gmail.com`, then `POST /api/v1/accounts/access-token` with the refresh token.

## Virtual Users Created

| Virtual User   | DID (full)                                                                                     | Policy Role          | Current State           |
|----------------|-----------------------------------------------------------------------------------------------|----------------------|-------------------------|
| Administrator  | `did:hedera:testnet:Gt2DaoWQqV1NA5P6X4EqoTh9PcrZCv5qAUytYnCGrUJy_0.0.8187554`               | OWNER                | At registration form    |
| Virtual User 1 | `did:hedera:testnet:6n9k4gtXzWFahyRLKjrvQrjVbQKuChJ7gSGq4Eo2npPJ_0.0.8187554`               | Registry             | At approval queue       |
| Virtual User 2 | `did:hedera:testnet:3x4yLYnb5f5vookE4X1FYCFW2Ph4z7BJruAV3yuHBrRn_0.0.8187554`               | Project_Proponent    | At registration form    |
| Virtual User 3 | `did:hedera:testnet:J9ZBDTybaWfvcxUo8mjj2BE51yydJHnP5My4Gvt8Wz7i_0.0.8187554`               | Operator             | At registration form    |
| Virtual User 4 | `did:hedera:testnet:hFW6Va1fn7R4KaC4ak8no5Tg4vgpkUNV2QbSdcqYwLM_0.0.8187554`               | VVB                  | At registration form    |

**Note:** VU5 was created by accident and is unused. Ignore it.

## Role Strings (with trailing whitespace)

These MUST be used exactly as-is in any API call that references roles:

```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```

## API Patterns

### Switch active virtual user

```bash
POST /api/v1/policies/{POLICY_ID}/dry-run/login
Body: {"did": "<user_did>"}
```

### Get visible blocks for active user

```bash
GET /api/v1/policies/{POLICY_ID}/blocks
```

### Get specific block details

```bash
GET /api/v1/policies/{POLICY_ID}/blocks/{BLOCK_ID}
```

### Submit data to a block (form or button)

```bash
POST /api/v1/policies/{POLICY_ID}/blocks/{BLOCK_ID}
Body: {"document": { ... schema fields ... }, "ref": null}
```

All requests require `Authorization: Bearer {ACCESS_TOKEN}` header.

---

## Workflow Steps (Execution Order)

### Pre-step: Get schema field definitions

Before submitting any forms, query each `requestVcDocumentBlock` to discover the schema fields it expects. The block response includes `data.schema.document.properties` with all field definitions.

Key block IDs (from DEMO policy):
- OWNER registration form: `e369ccd6-e4f6-49fa-8157-cb4182b7fbac`
- PP registration form: get by logging in as VU2 and querying step block `63c1d13e-2f3b-4b18-a54b-400bd15d3399`
- Operator registration form: get by logging in as VU3 and querying step block `62439e6d-5b7d-4437-acaf-d199e47f089e`
- VVB registration form: get by logging in as VU4 and querying step block `51cdc8d7-a36b-432d-932d-d37d6aa6e27f`

### Step 1: OWNER submits Impact Calculation description

- **Login as:** Administrator
- **Block:** `e369ccd6-e4f6-49fa-8157-cb4182b7fbac` (requestVcDocumentBlock)
- **Schema:** EWD-RB Impact Calculation (`#626bc024...` in DEMO)
- **Expected result:** OWNER advances to "Submitted to approve" info screen, then to main tabs interface
- **Event triggers:** Refreshes OWNER doc view + VVB doc view

### Step 2: Project_Proponent submits Supplier Registration

- **Login as:** Virtual User 2
- **Block:** First child of step `63c1d13e-...`
- **Schema:** EWD-RB Supplier Registration
- **Test data:** Use a Melo restaurant (e.g., "Restaurante El Buen Sabor", RUT ficticio, address in Melo)
- **Expected result:** PP advances to "Submitted to approve" info screen
- **Depends on:** Nothing (can run in parallel with Step 1)

### Step 3: Registry approves Supplier Registration

- **Login as:** Virtual User 1
- **Block:** Registry sees a table with PP's submission. Click Approve button.
- **Expected result:**
  - Document status changes to "Approved"
  - PP advances from "Submitted" to main tabs interface (triggered via RunEvent to `Project_Proponent_interfaceContainerBlock_3`)
  - Document reassigned to OWNER
- **Depends on:** Step 2

### Step 4: Operator submits Production Output

- **Login as:** Virtual User 3
- **Block:** First child of step `62439e6d-...`
- **Schema:** EWD-RB Production Output
- **Test data:** BSF processing record — larvae weight, compost weight, feed conversion ratio
- **Expected result:** Operator advances to main interface (no approval gate)
- **Depends on:** Nothing

### Step 5: VVB submits External Validation Record

- **Login as:** Virtual User 4
- **Block:** First child of step `51cdc8d7-...`
- **Schema:** EWD-RB External Validation Record
- **Test data:** Validation assessment data
- **Expected result:** VVB advances to main interface (no approval gate)
- **Depends on:** Nothing

### Step 6: Project_Proponent submits Waste Deliveries

- **Login as:** Virtual User 2 (now in main interface after Step 3 approval)
- **Tab:** Waste Delivery tab → "Create" button
- **Schema:** EWD-RB Waste Delivery
- **Test data from Appendix D:**

| Delivery | supplier_id | fecha_entrega | kg_bruto | kg_impropios | Expected Category |
|----------|------------|---------------|----------|-------------|-------------------|
| ENT-001  | SUP-001    | 2026-02-01    | 48.5     | 1.2         | A (2.5%)         |
| ENT-002  | SUP-001    | 2026-02-03    | 52.0     | 3.8         | B (7.3%)         |
| ENT-003  | SUP-001    | 2026-02-05    | 45.0     | 0.5         | A (1.1%)         |
| ENT-004  | SUP-002    | 2026-02-07    | 60.0     | 7.0         | R (11.7%) REJECT |
| ENT-005  | SUP-001    | 2026-02-08    | 55.0     | 2.0         | A (3.6%)         |

- **Dashboard pre-computes:** `kg_netos`, `kg_ajustados`, `categoria`, `eggo_points`
- **Depends on:** Step 3 (PP must be approved first)

### Step 7: Operator submits Waste Batches

- **Login as:** Virtual User 3 (in main interface)
- **Tab:** Waste Batch tab → "Create"
- **Schema:** EWD-RB Waste Batch
- **Test data:** Aggregate approved deliveries into batch LOT-001
- **Depends on:** Step 6

### Step 8: OWNER creates Impact Calculation (Issuance Lot)

- **Login as:** Administrator (in main interface)
- **Tab:** Impact Calculation tab → "Create"
- **Schema:** EWD-RB Impact Calculation
- **Test data:** Issuance lot linking batch to NFT calculation
- **Key field:** `field10` = number of NFTs to mint (kg_ajustados / 1000)
- **Expected result:** Submitted for VVB approval
- **Depends on:** Step 7

### Step 9: VVB approves Impact Calculation → NFT Mint

- **Login as:** Virtual User 4
- **Tab:** Impact Calculation tab → see OWNER's submission → Approve
- **Expected result:**
  - Document marked "Approved"
  - `mintDocumentBlock_90` fires → mints token (tokenId from DEMO)
  - Mint quantity from `field10`
- **Depends on:** Step 8

### Step 10: VVB approves Waste Delivery → EGGOCOIN Mint

- **Login as:** Virtual User 4
- **Tab:** Waste Delivery tab → see PP's submissions → Approve each
- **Expected result:**
  - Each delivery marked "Approved"
  - `mintDocumentBlock_132` fires → mints EGGOCOIN tokens
  - Mint quantity from `field12` (eggo_points)
- **Depends on:** Step 6

### Final: Verify Token History & TrustChain

- **Login as any user** → Token History tab / Trust Chain tab
- **Expected:** See minted tokens with full provenance chain

---

## Known Issues to Watch For

1. **Empty token template** — DEMO mint blocks use internal UUIDs, not real Hedera token IDs. Minting may fail or create virtual tokens only.
2. **No Issuance Record creation block** — The Issuance Record tab is view-only everywhere. This step is skipped for now.
3. **No custom logic blocks** — All calculations (kg_netos, kg_ajustados, eggo_points, NFT count) must be pre-computed and entered manually into schema fields.
4. **Trailing whitespace** — Role strings in any API payloads must include exact trailing spaces.
5. **Schema field names** — We need to discover the actual `field0`, `field1`, etc. names from each form block before submitting data. The pre-step queries each form block.

---

## Test Data Reference (Appendix D)

### Suppliers
- SUP-001: Restaurante El Buen Sabor, Melo
- SUP-002: Panadería La Espiga, Melo

### Expected Aggregation (approved deliveries only, excluding ENT-004 which is R)
- Total kg_bruto (approved): 48.5 + 52.0 + 45.0 + 55.0 = 200.5
- Total kg_impropios: 1.2 + 3.8 + 0.5 + 2.0 = 7.5
- Total kg_netos: 193.0
- Total kg_ajustados: 193.0 × 0.70 = 135.1
- NFTs mintable: 0 (below 1000 threshold — remainder absorbed)
- EGGOCOIN: 135 points total
