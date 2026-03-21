# EWD-RB v0.4 — Handoff v8 (PUBLISH Workflow Complete)

## Status: PUBLISHED POLICY — Full workflow executed with real Hedera accounts and token minting verified.

**Date:** 2026-03-20
**Previous handoffs:** V1-V7
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

1. **Created 4 real user accounts** on guardianservice.app via tenant invite API
2. **Set up Hedera testnet profiles** for each account (ED25519 keys, DIDs)
3. **Published the policy** (EWD-RB v0.3, version 0.3.0) to Hedera testnet
4. **Discovered the tenant permission issue** — "Default policy user" grants `ACCESS_POLICY_ALL` which makes users admins. Switched to "Policy User" custom role to enable proper policy role selection.
5. **Assigned policy roles** to all 4 accounts via the `choose_role` policyRolesBlock
6. **Executed all 10 workflow steps** with real accounts (corrected execution order)
7. **Verified EGGOCOIN minting** — 135 total (33 + 34 + 31 + 37), matching expected values exactly
8. **Verified NFT minting** — 0 NFTs (135.1 kg < 1000 kg threshold), correct
9. **Verified rejection** — ENT-004 (category C) rejected as expected

### Execution Results

| Metric | Expected | Actual | Match |
|--------|----------|--------|-------|
| Approved deliveries | 4 (ENT-001,002,003,005) | 4 (ENT-001,002,003,005) | YES |
| Rejected deliveries | 1 (ENT-004, cat C) | 1 (ENT-004, cat C) | YES |
| EGGOCOIN minted | 135 (33+34+31+37) | 135 (33+34+31+37) | YES |
| NFTs minted | 0 | 0 | YES |

### Mint Events (from Token History)

| # | Amount | Token | Tag | Description |
|---|--------|-------|-----|-------------|
| 0 | 0 | 0.0.8287362 (NFT) | `VVB  _mintDocumentBlock_90` | Impact Calc approved, 135.1 kg < 1000 kg threshold |
| 1 | 33 | 0.0.8287358 (EGGOCOIN) | `VVB  _mintDocumentBlock_132` | ENT-001 (kg_ajustados=33.11) |
| 2 | 34 | 0.0.8287358 (EGGOCOIN) | `VVB  _mintDocumentBlock_132` | ENT-002 (kg_ajustados=33.74) |
| 3 | 31 | 0.0.8287358 (EGGOCOIN) | `VVB  _mintDocumentBlock_132` | ENT-003 (kg_ajustados=31.15) |
| 4 | 37 | 0.0.8287358 (EGGOCOIN) | `VVB  _mintDocumentBlock_132` | ENT-005 (kg_ajustados=37.1) |

---

## KEY DISCOVERIES THIS SESSION

### 1. Tenant Custom Role Matters
- **"Default policy user"** includes `ACCESS_POLICY_ALL` permission → users become admins, skip role selection
- **"Policy User"** (22 permissions) is the correct role → users see `policyRolesBlock` and can choose their policy role
- All 4 accounts must use "Policy User" custom role in tenant settings

### 2. Policy Assignment Required
- Users must be explicitly assigned to the policy via `POST /permissions/users/{username}/policies/assign`
- Without assignment, `assigned: false` and role blocks may not function

### 3. API Registration Still Broken
- `POST /accounts/register` returns 500 on managed service — confirmed again
- `POST /accounts/registerByEmail` returns 404
- Users must be invited via tenant admin UI (`POST /tenants/invite` requires Tenant Admin role)

### 4. Approval Button Payload
- Button approval requires the **full document object** from the `interfaceDocumentsSourceBlock`, not just the document ID
- Format: `{"tag":"Button_0","document":{...full document object...}}`
- `Button_0` = Approve, `Button_1` = Reject

---

## POLICY STATE

| Field | Value |
|-------|-------|
| **Policy ID** | `69bc4638e755119d0774dd03` |
| **Policy Name** | `EWD-RB v0.3 _1773803376991_1773946424790` |
| **Status** | `PUBLISH` (live on Hedera testnet) |
| **Version** | `0.3.0` |
| **TopicId** | `0.0.8291451` |
| **InstanceTopicId** | `0.0.8294148` |
| **NFT Token** | `0.0.8287362` (Circular Impact NFT) |
| **EGGOCOIN Token** | `0.0.8287358` (fungible) |

---

## USER ACCOUNTS

| Role | Email | Username | Hedera Account | DID (prefix) |
|------|-------|----------|----------------|--------------|
| **OWNER (SR)** | `r.aguileira88@gmail.com` | `r.aguileira88@gmail.com` | `0.0.7166777` | `did:hedera:testnet:Gt2Da...` |
| **Registry** | `eggologic-registry@outlook.com` | `Registry` | `0.0.8292724` | `did:hedera:testnet:5J5Ae...` |
| **Project_Proponent** | `eggologic-proponent@outlook.com` | `Proponent` | `0.0.8294621` | `did:hedera:testnet:AvoVn...` |
| **Operator** | `eggologic-operator@outlook.com` | `Operator` | `0.0.8294659` | `did:hedera:testnet:9dDbm...` |
| **VVB** | `eggologic-vvb@outlook.com` | `VVB` | `0.0.8294709` | `did:hedera:testnet:ABqKg...` |

**Password for all accounts:** `test`
**Tenant ID:** `69a20b80b545b115a3d33542`
**Tenant custom role:** `Policy User` (NOT "Default policy user")

---

## BLOCK IDS (PUBLISHED POLICY)

### Root Structure
| Block | ID | Type |
|-------|----|------|
| Root container | `c92f5e9a-9309-4db9-b7c6-93a6274b3f5f` | interfaceContainerBlock |
| Roles block (tag: `choose_role`) | `bb6f3d1d-8a82-4f1f-ac42-1c23573f999e` | policyRolesBlock |

### User Step Blocks
| Role | Step Block ID |
|------|---------------|
| OWNER | `7fb56383-1bb3-49b9-b718-76bfeb3afc18` |
| Registry | `f6600677-1318-425a-9fb0-5031c87bc275` (container, no step) |
| Project_Proponent | `735489b4-85e5-4ce2-8883-bd31593617de` |
| Operator | `87a742d5-d394-485e-85db-2b9431c03eaa` |
| VVB | `6a8b7663-fc87-4366-9068-45c145c2172a` |

### Initial Registration Forms (step index 0)
| Role | Form Block ID | Schema |
|------|---------------|--------|
| OWNER | `daad0fcb-31dc-42db-94e2-db9e07fb0db3` | EWD-RB Impact Calculation |
| PP | `7e5a63d6-3337-4b04-8383-ccc0ca04990e` | EWD-RB Supplier Registration |
| Operator | `9e025649-626f-4e77-bcfc-eff5994926b6` | EWD-RB Production Output |
| VVB | `4247d7eb-d8d9-464d-aa62-a4a38e5a8249` | EWD-RB External Validation Record |

### Approval Buttons (via tag lookup)
| Tag | Block ID | Purpose |
|-----|----------|---------|
| `Registry _buttonBlock_64` | `21c5c832-ad4b-4164-bfaa-a9ae3b937424` | Approve/Reject Supplier |
| `VVB  _buttonBlock_87` | `350a7d1b-2c09-43e7-9889-12ef8900dc62` | Approve/Reject Impact Calc |
| `VVB  _buttonBlock_129` | `337cef47-e484-48bb-9249-a952cb72f203` | Approve/Reject Waste Delivery |

### Tab-Level Form Blocks (discovered during workflow)
| Role | Tab | Form Block ID |
|------|-----|---------------|
| PP | Waste Delivery | `b322eaa1-7611-4704-be60-b033db83dadb` |
| Operator | Waste Batch | `96d7e557-cb60-405e-ba30-344e55cc4240` |
| OWNER | Impact Calc (step 3) | `06cccd23-5629-43d5-ae33-601b92b5f2b1` |

### Key Data Source Blocks
| Role | Tab | Documents Source Block ID |
|------|-----|--------------------------|
| Registry | Supplier Registration | `d6b1e092-59c1-48af-8671-1a5dfdeaaddb` |
| VVB | Impact Calculation | `a77f0551-9cce-41c9-889d-c7b1110c059e` |
| VVB | Waste Delivery | `3a5afd50-d4a5-49ca-866b-75477790ae4c` |
| OWNER | Token History | `cd9ed4c2-ff79-474c-bd7c-6a9c525c6035` |

---

## 10-STEP WORKFLOW (CORRECTED ORDER — Verified on PUBLISH)

| Order | Step | User | Action | Status |
|-------|------|------|--------|--------|
| 1 | Step 1 | OWNER | Submit Impact Calc CALC-2026-001 (Draft) | DONE |
| 2 | Step 2 | PP | Register SUP-001 | DONE |
| 3 | Step 3 | Registry | Approve SUP-001 | DONE |
| 4 | Step 4 | Operator | Submit Production Output OUT-2026-001 | DONE |
| 5 | Step 5 | VVB | Submit External Validation VAL-2026-001 | DONE |
| 6 | Step 6 | PP | Submit 5 Waste Deliveries (ENT-001 through ENT-005) | DONE |
| 7 | Step 7 | Operator | Submit Waste Batch LOT-001 | DONE |
| 8 | Step 9a | VVB | Approve CALC-2026-001 | DONE |
| 9 | Step 8 | OWNER | Submit Impact Calc CALC-2026-002 (Calculated) | DONE |
| 10 | Step 9b | VVB | Approve CALC-2026-002 | DONE |
| 11 | Step 10 | VVB | Approve ENT-001,002,003,005 / Reject ENT-004 → EGGOCOIN mint | DONE |

---

## ROLE STRINGS (exact — trailing whitespace matters)

```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```

---

## ENVIRONMENT

- **Windows 10** — use `C:/Users/CAPS/guardian_tmp/` for temp files
- **No python** — use `node -e` for JSON processing
- **Token expiry** — re-auth if 401 (tokens ~30 min)
- **Managed service** — guardianservice.app (multi-tenant)

## AUTH

```bash
# Login (any account)
curl -s -X POST "https://guardianservice.app/api/v1/accounts/loginByEmail" \
  -H "Content-Type: application/json" \
  -d '{"email":"EMAIL","password":"test"}'
# → .login.refreshToken

# Access token
curl -s -X POST "https://guardianservice.app/api/v1/accounts/access-token" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<from above>"}'
# → .accessToken
```

## LOCAL FILES

| File | Purpose |
|------|---------|
| `guardian_tmp/access_token.txt` | OWNER access token (may be expired) |
| `guardian_tmp/token_registry.txt` | Registry access token |
| `guardian_tmp/token_proponent.txt` | PP access token |
| `guardian_tmp/token_operator.txt` | Operator access token |
| `guardian_tmp/token_vvb.txt` | VVB access token |
| `guardian_tmp/step*.json` | All JSON payloads (reusable) |
| `guardian_tmp/publish_root_blocks.json` | Root block structure after PUBLISH |
| `guardian_tmp/vvb_delivery_data_publish.json` | Delivery docs used for approval |

---

## WHAT TO DO NEXT

The PUBLISH workflow is **100% complete**. Possible next steps:

1. **Verify on Hedera Explorer** — Check token `0.0.8287358` (EGGOCOIN) and `0.0.8287362` (NFT) on HashScan testnet
2. **Prepare hackathon submission** — Document the policy, workflow, and results
3. **Create demo video** — Walk through the workflow showing real Hedera transactions
4. **Clean up policy name** — Rename from `EWD-RB v0.3 _1773803376991_1773946424790` to something cleaner
5. **Run a second cycle** — The policy supports multiple issuance rounds

---

## COMPLETE SCHEMA FIELD REFERENCE

Unchanged from V6 — all 8 schemas with field types, enums, and required flags. See V6 handoff for full reference.
