# EWD-RB v0.4 — Handoff v4 (DRY-RUN Setup)

## Status: Policy imported as DRAFT. Ready for DRY-RUN launch + 10-step replay.

**Date:** 2026-03-19
**Previous handoffs:** V1 (setup), V2 (field discovery + test plan), V3 (post-DEMO results), V4 (this — DRY-RUN setup)
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)

---

## What Was Accomplished This Session

1. **Grilled the plan** — Confirmed goal: re-run proven DEMO workflow as DRY-RUN so the policy can be published with real Hedera transactions
2. **Exported DEMO policy** — Guardian official export of `69ba1770e755119d0773d24a` (the working DEMO)
3. **Created clean v0.4 package** — Unzipped the `.policy` file, modified `policy.json`:
   - Renamed to `EWD-RB v0.4`
   - Version set to `1.0`
   - Description: `Working policy with EGGO tokens + NFT Mint`
   - Stripped DEMO-specific metadata: `id`, `uuid`, `status`, `topicId`, `instanceTopicId`, `synchronizationTopicId`, `messageId`, `policyTag`
   - All 204 blocks, 8 schemas, 2 mint blocks, 4 roles preserved intact
4. **Imported into Guardian** — Policy accepted as DRAFT

## Key Discovery: Guardian .policy File Format

Guardian `.policy` files are **ZIP archives** with this structure:
```
artifacts/
  metadata.json          (2 bytes)
tokens/                  (empty)
schemas/
  #de795b52-...json      Supplier Registration
  #0783ebf6-...json      Waste Delivery
  #2bc9d736-...json      Waste Batch
  #12257ada-...json      Production Output
  #626bc024-...json      Impact Calculation
  #661ce532-...json      VVB Assessment Record
  #f28c4e56-...json      External Validation Record
  #392b0c99-...json      Issuance Record
systemSchemas/           (empty)
tools/                   (empty)
tags/                    (empty)
tests/                   (empty)
formulas/                (empty)
policy.json              (main policy config — 204 blocks)
```

**Raw JSON will NOT import** — Guardian checks for ZIP "end of central directory" header. Must use PowerShell `Compress-Archive` → `.zip` → rename to `.policy`.

## What Needs To Happen Next

### Phase 1: Launch DRY-RUN + Setup Users
1. **User action (UI):** Open `EWD-RB v0.4` in Guardian → hit **DRY-RUN** (NOT DEMO)
2. **Get new policy ID** — The DRY-RUN instance will have a new policy ID (different from `69ba1770...d24a`)
3. **Authenticate** — Login via API, get access token
4. **Create 4 virtual users** and assign roles:
   - VU1 → `Registry ` (1 trailing space)
   - VU2 → `Project_Proponent ` (1 trailing space)
   - VU3 → `Operator ` (1 trailing space)
   - VU4 → `VVB  ` (2 trailing spaces)
5. **Discover block IDs** — Block UUIDs will likely change. Need to query `GET /api/v1/policies/{POLICY}/blocks` for each user to map the new IDs

### Phase 2: Replay 10-Step Workflow
Same 10 steps as DEMO test (see V3 handoff for full details):

| Step | Who | What |
|------|-----|------|
| 1 | OWNER | Submit Impact Calculation (Draft) |
| 2 | PP (VU2) | Register SUP-001 |
| 3 | Registry (VU1) | Approve SUP-001 |
| 4 | Operator (VU3) | Submit Production Output |
| 5 | VVB (VU4) | Submit External Validation |
| 6 | PP (VU2) | Submit 5 Waste Deliveries |
| 7 | Operator (VU3) | Submit Waste Batch |
| 8 | OWNER | Submit Impact Calc (Issuance Lot) |
| 9 | VVB (VU4) | Approve both Impact Calculations |
| 10 | VVB (VU4) | Approve 4 deliveries, reject ENT-004 |

**Expected results:** 135 EGGOCOIN minted, 0 NFTs, ENT-004 rejected (category C)

### Phase 3: Publish
Once DRY-RUN test passes → PUBLISH the policy → configure real HTS tokens → run real workflow

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

- **Policy name:** `EWD-RB v0.4`
- **Policy ID:** `<PENDING — get after DRY-RUN launch>`
- **Base URL:** `https://guardianservice.app`
- **DRY-RUN user endpoints:**
  - Create user: `POST /api/v1/policies/{POLICY}/dry-run/user`
  - Login as user: `POST /api/v1/policies/{POLICY}/dry-run/login` with `{"did":"..."}`
  - Get blocks: `GET /api/v1/policies/{POLICY}/blocks`
- **Submit form:** `POST /api/v1/policies/{POLICY}/blocks/{BLOCK_ID}` with `{"document":{...},"ref":null}`
- **Approve/reject:** `POST /api/v1/policies/{POLICY}/blocks/{BUTTON_BLOCK_ID}` with `{"tag":"Button_0","document":<full_doc>}`

## Role Strings (MUST be exact — trailing whitespace matters)

```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```

## Block IDs — PENDING REDISCOVERY

Block UUIDs from DEMO may or may not carry over. After DRY-RUN launch, query blocks for each user and map:

### Expected blocks to find (by tag pattern):
| Role | Block Type | Tag Pattern | Purpose |
|------|-----------|-------------|---------|
| OWNER | requestVcDocumentBlock | `OWNER_requestVcDocumentBlock_15` | Initial Impact Calc |
| OWNER | requestVcDocumentBlock | `OWNER_requestVcDocumentBlock_75` | In-tabs Impact Calc |
| PP | requestVcDocumentBlock | `Project_Proponent_requestVcDocumentBlock_10` | Supplier Registration |
| PP | requestVcDocumentBlock | `Project_Proponent_requestVcDocumentBlock_117` | Waste Delivery |
| Operator | requestVcDocumentBlock | `Operator_requestVcDocumentBlock_20` | Production Output |
| Operator | requestVcDocumentBlock | `Operator_requestVcDocumentBlock_36` | Waste Batch |
| VVB | requestVcDocumentBlock | `VVB_requestVcDocumentBlock_26` | External Validation |
| Registry | buttonBlock | `Registry_buttonBlock_64` | Approve/Reject Supplier |
| VVB | buttonBlock | `VVB_buttonBlock_87` | Approve/Reject Impact Calc |
| VVB | buttonBlock | `VVB_buttonBlock_129` | Approve/Reject Waste Delivery |

## Schema Field Mappings (unchanged from DEMO)

Full reference at `C:/Users/CAPS/guardian_tmp/field_mappings.md` and raw JSON files in `guardian_tmp/`.

## Test Data (same as DEMO — reuse)

See `WORKFLOW-TEST-HANDOFF-V3.md` for complete test data payloads.

## Files Created This Session

| File | Purpose |
|------|---------|
| `guardian_tmp/POLICY_EGG_CLEAN.json` | Cleaned raw policy JSON (not importable directly) |
| `guardian_tmp/EWD-RB-v0.4.policy` | Final importable .policy ZIP |
| `guardian_tmp/policy_repack/` | Unpacked .policy working directory |

## Environment Notes

- **Windows** — use `C:/Users/CAPS/guardian_tmp/` for temp files
- **No python** — use `node -e` for JSON parsing
- **PowerShell for ZIP** — `Compress-Archive` → `.zip` → rename to `.policy`
- **Token expiry** — re-authenticate if 401 errors (tokens last ~30 min)

## Broken/Inactive Policies (DO NOT USE)

| Policy | ID | Status | Why |
|--------|-----|--------|-----|
| EWD-RB v0.3 (PUBLISH) | `69b973bbe755119d0773b469` | Discontinued | Broken — bad modifications |
| EWD-RB v0.3 DEMO | `69ba1770e755119d0773d24a` | DEMO | Test complete, can't publish from DEMO |
| Eggologic | `69ba1b9de755119d0773d3df` | DRY-RUN/Draft | Different policy, ignore |
