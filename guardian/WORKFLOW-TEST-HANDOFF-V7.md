# EWD-RB v0.4 — Handoff v7 (DRY-RUN Complete — Prepare for PUBLISH)

## Status: DRY-RUN WORKFLOW VERIFIED — All minting matches expected values. Next: PUBLISH + real users.

**Date:** 2026-03-19
**Previous handoffs:** V1-V6
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

1. **Executed all 10 EWD-RB workflow steps** on the DRY-RUN policy (`69bc4638e755119d0774dd03`)
2. **Verified EGGOCOIN minting** — 135 total (33 + 34 + 31 + 37), matching expected values exactly
3. **Verified NFT minting** — 0 NFTs (135.1 kg < 1000 kg threshold), correct
4. **Verified rejection** — ENT-004 (category C) rejected as expected
5. **Discovered execution-order dependency** — Step 8 requires Step 9a first (see notes below)

### Execution Results

| Metric | Expected | Actual | Match |
|--------|----------|--------|-------|
| Approved deliveries | 4 (ENT-001,002,003,005) | 4 (ENT-001,002,003,005) | YES |
| Rejected deliveries | 1 (ENT-004, cat C) | 1 (ENT-004, cat C) | YES |
| EGGOCOIN minted | 135 (33+34+31+37) | 135 (33+34+31+37) | YES |
| NFTs minted | 0 | 0 | YES |

### Mint Events (from Token History)

| # | Amount | Type | Description |
|---|--------|------|-------------|
| 1 | 0 | mint | NFT — Impact Calc approved, but 135.1 kg < 1000 kg threshold |
| 2 | 34 | mint | EGGOCOIN for ENT-002 (kg_ajustados=33.74, rounded up) |
| 3 | 33 | mint | EGGOCOIN for ENT-001 (kg_ajustados=33.11, rounded down) |
| 4 | 31 | mint | EGGOCOIN for ENT-003 (kg_ajustados=31.15, rounded down) |
| 5 | 37 | mint | EGGOCOIN for ENT-005 (kg_ajustados=37.1, rounded down) |

---

## KEY DISCOVERY: EXECUTION ORDER DEPENDENCY

The handoff V6 listed steps 1-10 sequentially, but there is a **gating dependency** at Step 8:

**Problem:** OWNER cannot submit CALC-2026-002 (Step 8) until VVB approves CALC-2026-001 (part of Step 9). After submitting the initial Impact Calculation, the OWNER is stuck at an `informationBlock` titled "Submitted to approve" (step index 2). The OWNER's interface only advances to the tabs view (step index 3) — where a second Impact Calculation form is available — **after VVB approves the first one**.

**Actual execution order used:**
1. Step 1: OWNER submits CALC-2026-001 (Draft)
2. Step 2: PP registers SUP-001
3. Step 3: Registry approves SUP-001
4. Step 4: Operator submits Production Output
5. Step 5: VVB submits External Validation
6. Step 6: PP submits 5 Waste Deliveries
7. Step 7: Operator submits Waste Batch
8. **Step 9a: VVB approves CALC-2026-001** ← must happen before Step 8
9. Step 8: OWNER submits CALC-2026-002 (Calculated)
10. Step 9b: VVB approves CALC-2026-002
11. Step 10: VVB approves/rejects Waste Deliveries → EGGOCOIN Mint

**For PUBLISH workflow:** Follow this corrected order. The VVB must approve each Impact Calculation before the OWNER can submit the next one.

---

## POLICY STATE

| Field | Value |
|-------|-------|
| **Policy ID** | `69bc4638e755119d0774dd03` |
| **Policy Name** | `EWD-RB v0.3 _1773803376991_1773946424790` |
| **Status** | `DRY-RUN` (workflow complete, ready to PUBLISH) |
| **TopicId** | `0.0.8291451` |
| **NFT Token** | `0.0.8287362` (Circular Impact NFT) |
| **EGGOCOIN Token** | `0.0.8287358` (fungible) |

---

## BLOCK IDS DISCOVERED DURING WORKFLOW

These are **DRY-RUN block IDs** — they will change after PUBLISH. The block discovery pattern remains the same.

### Initial Registration Forms (step index 0)
| Role | Form Block ID | Schema |
|------|---------------|--------|
| OWNER | `b757d788-e57e-4100-9bc0-59025b614805` | EWD-RB Impact Calculation |
| PP (VU2) | `4ebaa10c-bdc7-436e-9a90-aae42a204aab` | EWD-RB Supplier Registration |
| Operator (VU3) | `a9dc598e-81c2-4d00-ab77-417805971d5f` | EWD-RB Production Output |
| VVB (VU4) | `9cbeecb9-482c-46c5-9172-a4dfb5414a83` | EWD-RB External Validation Record |

### Blocks Discovered After State Transitions
| Role | Block | Block ID | How found |
|------|-------|----------|-----------|
| PP (VU2) | Waste Delivery form (in tabs, step 3) | `21b04432-265f-4aeb-9cec-1be36a89da46` | After Registry approved SUP-001 → VU2 advanced to step 3 → drilled into "EWD-RB Waste Delivery" tab |
| Operator (VU3) | Waste Batch form (in tabs, step 2) | `9748b22f-7aed-4cf1-b751-b2d5ca5cecf1` | VU3 at step 2 → drilled into "EWD-RB Waste Batch" tab |
| OWNER | Impact Calc form (in tabs, step 3) | `6201143a-6f74-4df0-9e24-47d3310fbff4` | After VVB approved CALC-2026-001 → OWNER advanced to step 3 → drilled into "EWD-RB Impact Calculation" tab |
| Registry (VU1) | Approve Supplier button | `bab4a4d1-4e31-4d37-8d59-6b6d7a7eb072` | Tag lookup: `Registry _buttonBlock_64` |
| VVB (VU4) | Approve Impact Calc button | `3c232f35-448c-434b-a0b3-5f58ce5df31e` | Tag lookup: `VVB  _buttonBlock_87` |
| VVB (VU4) | Approve Waste Delivery button | `de9872cc-9b44-4e1a-883f-f946894ca352` | Tag lookup: `VVB  _buttonBlock_129` |

### Block Discovery Pattern (reusable for PUBLISH)

1. **Login as user** → GET `/policies/{POLICY}/blocks`
2. **Find the step block** → GET `/policies/{POLICY}/blocks/{STEP_ID}` → check `index`
3. **Drill into the container** at the current step → find tab containers with titles
4. **Drill into the tab** → find `requestVcDocumentBlock` (forms) or `interfaceDocumentsSourceBlock` (data)
5. **For approval buttons:** check `uiMetaData.fields` for `bindBlock` tag → use `GET /policies/{POLICY}/tag/{TAG}` to get the UUID
6. **For approval data:** GET the `interfaceDocumentsSourceBlock` → `.data[]` array has the full document objects

---

## APPROACH FOR CREATING REAL USERS (Step 4 of PUBLISH)

### The Problem

The published policy needs 4 separate Guardian accounts (one per role: Registry, Project_Proponent, Operator, VVB). Each account requires:
- A unique email address
- Registration on guardianservice.app
- A Hedera DID (created on first login)

### API Registration Is Broken

`POST /api/v1/accounts/register` returns `500: "Cannot read properties of undefined (reading 'name')"` on the managed service (guardianservice.app). This has been confirmed across multiple sessions. **Users must be created through the web UI.**

### Recommended Approach: Gmail + Aliases

Gmail supports `+` aliases — emails sent to `user+anything@gmail.com` arrive in `user@gmail.com`'s inbox. This gives us unlimited unique emails from a single mailbox:

| Role | Email | Notes |
|------|-------|-------|
| **OWNER** (existing) | `r.aguileira88@gmail.com` | Already registered, STANDARD_REGISTRY role |
| **Registry** | `r.aguileira88+registry@gmail.com` | New account, USER role |
| **Project_Proponent** | `r.aguileira88+proponent@gmail.com` | New account, USER role |
| **Operator** | `r.aguileira88+operator@gmail.com` | New account, USER role |
| **VVB** | `r.aguileira88+vvb@gmail.com` | New account, USER role |

All confirmation emails land in the same inbox. Each counts as a distinct account for Guardian.

### Registration Steps (Manual — via UI)

1. Go to `https://guardianservice.app` in a browser
2. Click "Sign Up" / "Register"
3. For each of the 4 new roles:
   a. Register with the `+alias` email and a password (e.g., `Eggologic2026!`)
   b. Confirm email if required (check same Gmail inbox)
   c. Log in, complete any profile setup
4. After all 4 accounts exist, proceed to PUBLISH

### Alternative: Retry API Registration

If the UI registration also fails, try these API variations:
```bash
# Try with email field instead of username
POST /api/v1/accounts/register
{"email":"r.aguileira88+registry@gmail.com","password":"Eggologic2026!","role":"USER"}

# Try registerByEmail (mirrors loginByEmail pattern)
POST /api/v1/accounts/registerByEmail
{"email":"r.aguileira88+registry@gmail.com","password":"Eggologic2026!"}
```

### After Registration: Role Assignment on Published Policy

Once PUBLISH is done and 4 accounts exist:
1. Each user logs in via API (`/loginByEmail` → `/access-token`)
2. Each user GETs blocks → finds the `policyRolesBlock`
3. Each user POSTs their role to the roles block:
   ```json
   {"role": "Registry "}
   ```
   **Warning:** Role strings have trailing spaces (see V6 handoff for exact strings)
4. After role assignment, each user sees their role-specific forms

---

## PUBLISH CHECKLIST

### Pre-PUBLISH

- [ ] **Verify token IDs** — NFT: `0.0.8287362`, EGGOCOIN: `0.0.8287358`
  - These were set during DRY-RUN setup and should carry through to PUBLISH
  - If tokens need changing: return to DRAFT first, update mint blocks, then PUBLISH
- [ ] **Create 4 real user accounts** on guardianservice.app (see approach above)
- [ ] **Decide:** Keep current policy name or rename before PUBLISH
  - Current: `EWD-RB v0.3 _1773803376991_1773946424790`
  - Rename via: `PUT /api/v1/policies/{POLICY}` with updated name field

### PUBLISH

```bash
# Publish the policy (transitions from DRY-RUN to live on Hedera testnet)
curl -s -X PUT "https://guardianservice.app/api/v1/policies/69bc4638e755119d0774dd03/publish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d "{}"
```

**Expected:** Policy status changes to `PUBLISH` → Guardian creates Hedera topic, registers schemas on-chain. This may take 1-5 minutes.

### Post-PUBLISH

- [ ] Verify policy status is `PUBLISH` (not stuck in `PUBLISH_ERROR`)
- [ ] Confirm schemas are registered on Hedera (check policy's topicId)
- [ ] Each of the 4 new users logs in and selects their role
- [ ] Execute the 10-step workflow (corrected order) with real accounts
- [ ] Verify EGGOCOIN minting on Hedera testnet (real token transfers)
- [ ] Verify 0 NFTs minted (below threshold)

---

## 10-STEP WORKFLOW (CORRECTED ORDER — For PUBLISH)

Same JSON bodies as V6 handoff. The only change is execution order:

| Order | Step | User | Action |
|-------|------|------|--------|
| 1 | Step 1 | OWNER | Submit Impact Calc CALC-2026-001 (Draft) |
| 2 | Step 2 | PP | Register SUP-001 |
| 3 | Step 3 | Registry | Approve SUP-001 |
| 4 | Step 4 | Operator | Submit Production Output OUT-2026-001 |
| 5 | Step 5 | VVB | Submit External Validation VAL-2026-001 |
| 6 | Step 6 | PP | Submit 5 Waste Deliveries (ENT-001 through ENT-005) |
| 7 | Step 7 | Operator | Submit Waste Batch LOT-001 |
| 8 | **Step 9a** | **VVB** | **Approve CALC-2026-001** ← unblocks OWNER |
| 9 | Step 8 | OWNER | Submit Impact Calc CALC-2026-002 (Calculated) |
| 10 | **Step 9b** | **VVB** | **Approve CALC-2026-002** |
| 11 | Step 10 | VVB | Approve ENT-001,002,003,005 / Reject ENT-004 → EGGOCOIN mint |

**Important:** After PUBLISH, block IDs will be different. You MUST re-discover all block IDs using the pattern described above. The block tags (e.g., `Registry _buttonBlock_64`) remain the same — use the tag-to-UUID lookup.

---

## VCs CREATED DURING DRY-RUN (for reference)

| Step | VC ID | Content |
|------|-------|---------|
| 1 | `urn:uuid:4d61a12e-c7ec-405f-b26d-baefc87e5dec` | CALC-2026-001 Impact Calc |
| 2 | `urn:uuid:dc46b28b-3740-40de-b3d7-69f56d211804` | SUP-001 Supplier Registration |
| 4 | `urn:uuid:afcbee39-761e-493e-b57c-e87a77df706d` | OUT-2026-001 Production Output |
| 5 | `urn:uuid:2313b10b-bb15-4dca-a007-14ebcda69417` | VAL-2026-001 External Validation |
| 6a | `urn:uuid:d0ab67cc-cd51-4227-89...` | ENT-001 Waste Delivery |
| 6b | `urn:uuid:820e97fd-fcfc-4bd0-b8...` | ENT-002 Waste Delivery |
| 6c | `urn:uuid:b850c7e3-154d-43cd-8a...` | ENT-003 Waste Delivery |
| 6d | `urn:uuid:56fa14f6-38c7-4f40-98...` | ENT-004 Waste Delivery |
| 6e | `urn:uuid:0c84cb29-5e36-473b-89...` | ENT-005 Waste Delivery |
| 8 | (auto-generated) | CALC-2026-002 Impact Calc |
| 7 | (auto-generated) | LOT-001 Waste Batch |

---

## ENVIRONMENT

- **Windows 10** — use `C:/Users/CAPS/guardian_tmp/` for temp files
- **No python** — use `node -e` for JSON processing
- **Token expiry** — re-auth if 401 (tokens ~30 min)
- **Managed service** — guardianservice.app (multi-tenant, API registration broken)

## LOCAL FILES

| File | Purpose |
|------|---------|
| `guardian_tmp/access_token.txt` | Current access token (may be expired) |
| `guardian_tmp/step*.json` | All JSON payloads from the DRY-RUN workflow (reusable for PUBLISH) |
| `guardian_tmp/vu4_delivery_data.json` | Delivery data with full VC documents |
| `guardian_tmp/vu4_impactcalc_data2.json` | Impact Calc data from VVB view |

## AUTH

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

## COMPLETE SCHEMA FIELD REFERENCE

Unchanged from V6 — all 8 schemas with field types, enums, and required flags. See V6 handoff for full reference.

## ROLE STRINGS (exact — trailing whitespace matters)

```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```
