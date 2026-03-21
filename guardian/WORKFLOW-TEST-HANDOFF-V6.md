# EWD-RB v0.4 — Handoff v6 (DRY-RUN Active — Execute 10-Step Workflow)

## Status: DRY-RUN ACTIVE — 4 virtual users ready, block IDs discovered, execute workflow next

**Date:** 2026-03-19
**Previous handoffs:** V1-V5
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

1. **Exported** DEMO policy (`69ba1770e755119d0773d24a`) as `.policy` ZIP
2. **Imported** as fresh DRAFT → policy `69bc4638e755119d0774dd03` on topic `0.0.8291451`
3. **Schemas imported correctly** — the import created 8 DRAFT schemas with new UUIDs and remapped all 204 block references automatically (zero validation errors!)
4. **Set token IDs** — used v1.0's real Hedera tokens (`0.0.8287362` NFT, `0.0.8287358` EGGOCOIN) in mint blocks
5. **Launched DRY-RUN** — all 204 blocks validated, `isValid: true`
6. **Created 4 virtual users**, assigned roles
7. **Discovered all initial form block IDs** for each role
8. **Mapped all 8 schema field types** — including enums, arrays, required fields

### Key Discovery: Import Bug Was Not Reproducible
The previous v0.4 import had 57 errors because schemas weren't created. This time, the exact same export/import process created schemas and remapped references correctly. The previous failure may have been caused by a corrupted export or a Guardian version issue.

---

## POLICY STATE

| Field | Value |
|-------|-------|
| **Policy ID** | `69bc4638e755119d0774dd03` |
| **Policy Name** | `EWD-RB v0.3 _1773803376991_1773946424790` |
| **Status** | `DRY-RUN` |
| **TopicId** | `0.0.8291451` |
| **InstanceTopicId** | `0.0.1773948001710` |
| **NFT Token** | `0.0.8287362` (Circular Impact NFT, non-fungible) |
| **EGGOCOIN Token** | `0.0.8287358` (EGGOCOIN, fungible) |

---

## VIRTUAL USERS

| User | DID | Role | Shorthand |
|------|-----|------|-----------|
| **Administrator** | `did:hedera:testnet:Gt2DaoWQqV1NA5P6X4EqoTh9PcrZCv5qAUytYnCGrUJy_0.0.8187554` | OWNER | ADMIN |
| **Virtual User 1** | `did:hedera:testnet:FYmyNAmE2LUXYrrDEX3UHkoK5Co7WsyUTQWVtWNXgE9D_0.0.8187554` | Registry | VU1 |
| **Virtual User 2** | `did:hedera:testnet:4ypea7X96noY6kbDi8xsAUXGQUMHYgVHkfyLwWtbpLga_0.0.8187554` | Project_Proponent | VU2 |
| **Virtual User 3** | `did:hedera:testnet:3gYyGHiRoiGpxk5WLmFvRh1hGRuqFdQR5BdUwCyRShEU_0.0.8187554` | Operator | VU3 |
| **Virtual User 4** | `did:hedera:testnet:7aGzeKihX2VwChjY9tjWxrVYH18oKBQdtNWqsJge1UAV_0.0.8187554` | VVB | VU4 |

---

## DISCOVERED BLOCK IDS (Initial Registration Forms)

| Role | Form Block ID | Schema |
|------|---------------|--------|
| OWNER | `b757d788-e57e-4100-9bc0-59025b614805` | EWD-RB Impact Calculation |
| PP (VU2) | `4ebaa10c-bdc7-436e-9a90-aae42a204aab` | EWD-RB Supplier Registration |
| Operator (VU3) | `a9dc598e-81c2-4d00-ab77-417805971d5f` | EWD-RB Production Output |
| VVB (VU4) | `9cbeecb9-482c-46c5-9172-a4dfb5414a83` | EWD-RB External Validation Record |

### Blocks STILL TO DISCOVER (appear after initial forms, in tabs)

| Role | Tab | Schema | How to discover |
|------|-----|--------|-----------------|
| PP (VU2) | Waste Delivery | EWD-RB Waste Delivery | After step 3 (Registry approves SUP-001), VU2 advances to tabs. GET blocks → find requestVcDocumentBlock for Waste Delivery |
| Operator (VU3) | Waste Batch | EWD-RB Waste Batch | After step 4, VU3 is at tabs. GET blocks → find Waste Batch form |
| OWNER | Impact Calc (in tabs) | EWD-RB Impact Calculation | After VVB approves initial Impact Calc, OWNER advances to tabs |
| Registry (VU1) | Approve Supplier button | — | After step 2, VU1 sees a button block to approve/reject |
| VVB (VU4) | Approve Impact Calc button | — | After step 8, VU4 sees queued Impact Calcs with approve/reject |
| VVB (VU4) | Approve Waste Delivery button | — | After step 6, VU4 sees queued deliveries with approve/reject |

---

## COMPLETE SCHEMA FIELD REFERENCE

### 1. EWD-RB Impact Calculation
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | number | no | |
| field2 | schema_version | string | YES | |
| field3 | calculation_id | string | YES | |
| field4 | period_start | string | YES | date |
| field5 | period_end | string | YES | date |
| field6 | batch_ids | **array** | no | items: string |
| field7 | delivery_ids | **array** | YES | items: string |
| field8 | kg_ajustados_total | number | no | |
| field9 | nft_threshold_kg | number | no | |
| field10 | nfts_to_mint | number | no | |
| field11 | issuance_lot_id | string | YES | |
| field12 | allocation_strategy | string | YES | **enum: `["by_delivery_atomic"]`** |
| field13 | guard_rule | string | YES | **enum: `["delivery_id_must_be_unique_across_all_issuance_records"]`** |
| field14 | double_counting_checked_at | string | no | |
| field15 | calculation_status | string | YES | **enum: `["Draft","Calculated","Under_VVB_Review","VVB_Approved","Under_Validation","Validated","Ready_To_Mint","Minting","Issued","Superseded","Invalidated"]`** |
| field16 | calculation_evidence | **array** | no | items: string (URI) |

### 2. EWD-RB Supplier Registration
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | string | YES | |
| field2 | schema_version | string | YES | |
| field3 | supplier_id | string | YES | |
| field4 | supplier_display_name | string | YES | |
| field5 | supplier_legal_name | string | YES | |
| field6 | supplier_type | string | YES | **enum: `["restaurant","food_court","catering","supermarket","other"]`** |
| field7 | contact_email | string | YES | |
| field8 | contact_phone | string | YES | |
| field9 | address_city | string | YES | |
| field14 | address_country | string | no | |
| field10 | supplier_terms_accepted | string | YES | |
| field11 | supplier_signature_evidence | string | YES | |
| field12 | registry_status | string | YES | **enum: `["Under_Registry_Review","Approved_by_Registry","Rejected_by_Registry"]`** |
| field13 | created_at | string | YES | |

### 3. EWD-RB Production Output
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | string | YES | |
| field2 | schema_version | string | YES | |
| field3 | output_id | string | YES | |
| field4 | batch_id | string | YES | |
| field5 | larvae_kg | number | no | |
| field6 | frass_kg | number | no | |
| field7 | compost_kg | number | no | |
| field8 | output_evidence | **array** | no | items: string (URI) |

### 4. EWD-RB External Validation Record
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | string | YES | |
| field2 | schema_version | string | YES | |
| field3 | validation_id | string | YES | |
| field4 | target_type | string | YES | **enum: `["ImpactCalculation"]`** |
| field5 | target_id | string | YES | |
| field6 | validator_org | string | no | |
| field7 | validator_user_id | string | no | |
| field8 | decision | string | no | **enum: `["Approved","Rejected"]`** |
| field9 | decision_note | string | no | |
| field10 | validated_at | string | YES | |
| field11 | validation_evidence | **array** | YES | items: string (URI) |

### 5. EWD-RB Waste Delivery
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | string | YES | |
| field2 | schema_version | string | YES | |
| field3 | schema_version (dup) | string | YES | (duplicate key in schema — use same value) |
| field4 | delivery_id | string | YES | |
| field5 | supplier_id | string | YES | |
| field6 | capture_timestamp | string | YES | |
| field7 | waste_stream | string | YES | **enum: `["food_waste_mixed","pre_consumer","post_consumer","coffee_grounds","other_organic"]`** |
| field8 | kg_bruto | number | YES | |
| field9 | kg_impropios | number | YES | |
| field10 | impropios_ratio | number | no | pre-computed |
| field11 | kg_netos | number | no | pre-computed |
| field12 | kg_ajustados | number | no | pre-computed (used by mint) |
| field13 | acceptance_category | string | no | **enum: `["A","B","C"]`** |
| field14 | supplier_confirmed | boolean | YES | |
| field15 | supplier_confirmation_evidence | **array** | YES | items: string (URI) |
| field16 | delivery_status | string | YES | **enum: `["Draft","Submitted","Supplier_Confirmed","Validated, Under_VVB_Review","VVB_Approved","Rejected","Batched","Included_In_IssuanceLot","Issued","Superseded","Invalidated"]`** |
| field17 | evidence_capture | **array** | YES | items: string (URI) |

### 6. EWD-RB Waste Batch
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | string | YES | |
| field2 | schema_version | string | YES | |
| field3 | batch_id | string | YES | |
| field4 | batch_closed_at | string | no | |
| field5 | processing_route | string | YES | **enum: `["bsf_bioconversion","composting","mixed","other",""]`** |
| field6 | delivery_ids | **array** | YES | items: string |
| field7 | batch_kg_ajustados_total | number | no | |
| field8 | batch_status | string | YES | **enum: `["Draft","Populated","Closed","Calculated","Locked","Superseded","Invalidated"]`** |
| field9 | batch_evidence | **array** | YES | items: string (URI) |

### 7. EWD-RB VVB Assessment Record
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | string | YES | |
| field2 | schema_version | string | YES | |
| field3 | assessment_id | string | YES | |
| field4 | target_type | string | YES | **enum: `["WasteDelivery","WasteBatch","ImpactCalculation","EGGOCOIN_Issuance"]`** |
| field5 | target_id | string | YES | |
| field6 | vvb_org | string | no | |
| field7 | decision | string | no | **enum: `["Approved","Rejected","Approved_With_Findings"]`** |
| field8 | assessed_at | string | YES | |
| field9 | assessment_evidence | **array** | YES | items: string (URI) |

### 8. EWD-RB Issuance Record
| Field | Description | Type | Required | Enum/Notes |
|-------|-------------|------|----------|------------|
| field0 | methodology_id | string | YES | |
| field1 | methodology_version | string | YES | |
| field2 | schema_version | string | YES | |
| field3 | issuance_id | string | YES | |
| field4 | calculation_id | string | no | |
| field5 | issuance_lot_id | string | YES | |
| field6 | asset_type | string | YES | **enum: `["Circular_Impact_NFT"]`** |
| field7 | nfts_minted | number | YES | |
| field8 | mint_reference | string | no | |
| field9 | issued_at | string | YES | |
| field10 | issuance_status | string | YES | **enum: `["Minting","Issued","Failed","Superseded"]`** |
| field11 | issuance_evidence | string | YES | |

---

## 10-STEP WORKFLOW TO EXECUTE

All steps use the same base pattern:
- **Switch user:** `POST /api/v1/policies/{POLICY}/dry-run/login` with `{"did":"..."}`
- **Get blocks:** `GET /api/v1/policies/{POLICY}/blocks`
- **Submit form:** `POST /api/v1/policies/{POLICY}/blocks/{BLOCK_ID}` with `{"document":{...},"ref":null}`
- **Approve:** `POST /api/v1/policies/{POLICY}/blocks/{BUTTON_BLOCK_ID}` with `{"tag":"Button_0","document":<full_doc>}`
- **Reject:** same but `{"tag":"Button_1","document":<full_doc>}`

### Step 1: OWNER submits Impact Calculation (Draft)
- **User:** ADMIN
- **Block:** `b757d788-e57e-4100-9bc0-59025b614805`
- **Data:**
```json
{
  "document": {
    "field0": "EWD-RB",
    "field2": "v0.3",
    "field3": "CALC-2026-001",
    "field4": "2026-01-01",
    "field5": "2026-03-31",
    "field7": [],
    "field11": "CALC-LOT-001",
    "field12": "by_delivery_atomic",
    "field13": "delivery_id_must_be_unique_across_all_issuance_records",
    "field15": "Draft"
  },
  "ref": null
}
```

### Step 2: PP registers SUP-001
- **User:** VU2
- **Block:** `4ebaa10c-bdc7-436e-9a90-aae42a204aab`
- **Data:**
```json
{
  "document": {
    "field0": "EWD-RB",
    "field1": "0.3",
    "field2": "v0.3",
    "field3": "SUP-001",
    "field4": "Restaurante El Buen Sabor",
    "field5": "Restaurante El Buen Sabor SRL",
    "field6": "restaurant",
    "field7": "buensabor@example.com",
    "field8": "+598-99-123456",
    "field9": "Melo",
    "field14": "UY",
    "field10": "yes",
    "field11": "signed-via-app",
    "field12": "Under_Registry_Review",
    "field13": "2026-03-19"
  },
  "ref": null
}
```

### Step 3: Registry approves SUP-001
- **User:** VU1
- **Action:** GET blocks → find button block in Registry view → POST approve
- **Pattern:** `{"tag":"Button_0","document":<full_doc_object_from_data_array>}`
- **After:** PP advances to tabs interface (Waste Delivery form becomes visible)

### Step 4: Operator submits Production Output
- **User:** VU3
- **Block:** `a9dc598e-81c2-4d00-ab77-417805971d5f`
- **Data:**
```json
{
  "document": {
    "field0": "EWD-RB",
    "field1": "0.3",
    "field2": "v0.3",
    "field3": "OUT-2026-001",
    "field4": "LOT-001",
    "field5": 12.5,
    "field6": 8.3,
    "field7": 15.0
  },
  "ref": null
}
```

### Step 5: VVB submits External Validation
- **User:** VU4
- **Block:** `9cbeecb9-482c-46c5-9172-a4dfb5414a83`
- **Data:**
```json
{
  "document": {
    "field0": "EWD-RB",
    "field1": "0.3",
    "field2": "v0.3",
    "field3": "VAL-2026-001",
    "field4": "ImpactCalculation",
    "field5": "CALC-2026-001",
    "field10": "2026-03-19",
    "field11": ["https://evidence.eggologic.com/val-001"]
  },
  "ref": null
}
```

### Step 6: PP submits 5 Waste Deliveries
- **User:** VU2
- **Block:** DISCOVER after step 3 — VU2 blocks → find Waste Delivery requestVcDocumentBlock in tabs
- **Data for each delivery:**

| ID | supplier_id | kg_bruto | kg_impropios | impropios_ratio | kg_netos | kg_ajustados | category |
|----|-------------|----------|--------------|-----------------|----------|--------------|----------|
| ENT-001 | SUP-001 | 48.5 | 1.2 | 2.5 | 47.3 | 33.11 | A |
| ENT-002 | SUP-001 | 52.0 | 3.8 | 7.3 | 48.2 | 33.74 | B |
| ENT-003 | SUP-001 | 45.0 | 0.5 | 1.1 | 44.5 | 31.15 | A |
| ENT-004 | SUP-001 | 60.0 | 7.0 | 11.7 | 53.0 | 37.1 | C |
| ENT-005 | SUP-001 | 55.0 | 2.0 | 3.6 | 53.0 | 37.1 | A |

- **Template per delivery:**
```json
{
  "document": {
    "field0": "EWD-RB",
    "field1": "0.3",
    "field2": "v0.3",
    "field3": "v0.3",
    "field4": "ENT-001",
    "field5": "SUP-001",
    "field6": "2026-03-19T08:00:00Z",
    "field7": "food_waste_mixed",
    "field8": 48.5,
    "field9": 1.2,
    "field10": 2.5,
    "field11": 47.3,
    "field12": 33.11,
    "field13": "A",
    "field14": true,
    "field15": ["https://evidence.eggologic.com/ent-001"],
    "field16": "Submitted",
    "field17": ["https://evidence.eggologic.com/ent-001-photo"]
  },
  "ref": null
}
```

### Step 7: Operator submits Waste Batch
- **User:** VU3
- **Block:** DISCOVER — VU3 blocks → find Waste Batch requestVcDocumentBlock in tabs
- **Data:**
```json
{
  "document": {
    "field0": "EWD-RB",
    "field1": "0.3",
    "field2": "v0.3",
    "field3": "LOT-001",
    "field5": "bsf_bioconversion",
    "field6": ["ENT-001","ENT-002","ENT-003","ENT-005"],
    "field8": "Closed",
    "field9": ["https://evidence.eggologic.com/lot-001"]
  },
  "ref": null
}
```

### Step 8: OWNER submits Impact Calculation Issuance (CALC-2026-002)
- **User:** ADMIN
- **Block:** DISCOVER — OWNER blocks → find Impact Calculation requestVcDocumentBlock in tabs
- **Data:**
```json
{
  "document": {
    "field0": "EWD-RB",
    "field2": "v0.3",
    "field3": "CALC-2026-002",
    "field4": "2026-01-01",
    "field5": "2026-03-31",
    "field6": ["LOT-001"],
    "field7": ["ENT-001","ENT-002","ENT-003","ENT-005"],
    "field8": 135.1,
    "field9": 1000,
    "field10": 0,
    "field11": "CALC-LOT-002",
    "field12": "by_delivery_atomic",
    "field13": "delivery_id_must_be_unique_across_all_issuance_records",
    "field15": "Calculated"
  },
  "ref": null
}
```

### Step 9: VVB approves both Impact Calculations → NFT Mint
- **User:** VU4
- **Action:** GET blocks → find approve button for Impact Calculations → POST approve for both CALC-2026-001 and CALC-2026-002
- **Pattern:** `{"tag":"Button_0","document":<full_doc_object>}`
- **Expected:** 2 NFT mint events (amount = 0, below 1000 kg threshold)

### Step 10: VVB approves/rejects Waste Deliveries → EGGOCOIN Mint
- **User:** VU4
- **Action:** GET blocks → find approve button for Waste Deliveries → Approve ENT-001,002,003,005; Reject ENT-004
- **Pattern approve:** `{"tag":"Button_0","document":<full_doc>}`
- **Pattern reject:** `{"tag":"Button_1","document":<full_doc>}`
- **Expected minting:**
  - ENT-001: 33 EGGOCOIN
  - ENT-002: 34 EGGOCOIN
  - ENT-003: 31 EGGOCOIN
  - ENT-005: 37 EGGOCOIN
  - **Total: 135 EGGOCOIN**

---

## AUTH

```bash
# Login
curl -s -X POST "https://guardianservice.app/api/v1/accounts/loginByEmail" \
  -H "Content-Type: application/json" \
  -d '{"email":"r.aguileira88@gmail.com","password":"test"}'
# → .login.refreshToken (nested under .login)

# Access token
curl -s -X POST "https://guardianservice.app/api/v1/accounts/access-token" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<from above>"}'
# → .accessToken
```

## API PATTERNS

| Action | Method | Endpoint |
|--------|--------|----------|
| Switch virtual user | POST | `/api/v1/policies/{POLICY}/dry-run/login` with `{"did":"..."}` |
| Get visible blocks | GET | `/api/v1/policies/{POLICY}/blocks` |
| Get specific block | GET | `/api/v1/policies/{POLICY}/blocks/{BLOCK_ID}` |
| Submit form | POST | `/api/v1/policies/{POLICY}/blocks/{BLOCK_ID}` with `{"document":{...},"ref":null}` |
| Approve/Reject | POST | `/api/v1/policies/{POLICY}/blocks/{BUTTON_ID}` with `{"tag":"Button_0|Button_1","document":<full_doc>}` |
| List schemas | GET | `/api/v1/schemas?topicId=0.0.8291451` |
| List policies | GET | `/api/v1/policies` |

## ROLE STRINGS (exact — trailing whitespace matters)

```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```

## KEY DISCOVERIES / GOTCHAS

1. **Array fields are strict** — `field7` (delivery_ids) in Impact Calc is type `array`, NOT string. Submit as `[]` or `["id1","id2"]`
2. **Enum fields are strict** — `field12` (allocation_strategy) MUST be `"by_delivery_atomic"`, not free text. Check the enum list for each field
3. **Approval POST format** — Must send `{"tag":"Button_0","document":<FULL document object from data array>}` (not just an ID)
4. **Button_0 = Approve, Button_1 = Reject**
5. **Save body to file** — Use `node -e` to write JSON to file, then `curl -d @file.json` to avoid Content-Length mismatches
6. **Block discovery is iterative** — After each role advances (registration → tabs), new blocks become visible. Re-GET blocks after each state transition
7. **field3 in Waste Delivery** is duplicated (both field2 and field3 are "schema_version") — use the same value for both
8. **URI array fields** (`supplier_confirmation_evidence`, `validation_evidence`, etc.) must be arrays of valid URI strings like `["https://..."]`

## ENVIRONMENT

- **Windows 10** — use `C:/Users/CAPS/guardian_tmp/` for temp files
- **No python** — use `node -e` for JSON processing
- **Token expiry** — re-auth if 401 (tokens ~30 min)

## LOCAL FILES

| File | Purpose |
|------|---------|
| `guardian_tmp/access_token.txt` | Current access token (may be expired) |
| `guardian_tmp/demo_schemas.json` | All 8 DEMO schema definitions |
| `guardian_tmp/all_schema_fields.json` | Parsed field mappings for all 8 schemas |
| `guardian_tmp/new_policy_full.json` | Full policy JSON from import |
| `guardian_tmp/vu4.json` | All 5 virtual users with DIDs |
| `guardian_tmp/EWD-RB-DEMO-export.policy` | DEMO policy export ZIP |

## AFTER WORKFLOW COMPLETES

1. **Verify minting**: Check token history (switch to VVB, find mint events)
2. **Return to editing**: If needed, `PUT /api/v1/policies/{POLICY}/draft` with `{}`
3. **Set production tokens**: Before PUBLISH, ensure correct token IDs
4. **PUBLISH**: Deploy to testnet with real Hedera transactions
5. **Create real users**: Register 4 accounts on guardianservice.app for each role
6. **Run workflow with real users**: Repeat 10 steps for the hackathon submission
