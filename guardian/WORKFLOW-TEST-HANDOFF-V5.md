# EWD-RB v0.4 — Handoff v5 (Schema/Token Fix — Resume)

## Status: BLOCKED — 57 validation errors persist. Approach needs revision.

**Date:** 2026-03-19
**Previous handoffs:** V1-V4 (see V4 for prior context)
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)

---

## CRITICAL CONTEXT FOR RESUMING AGENT

### The Problem
The v0.4 policy (exported from working DEMO, imported as DRAFT) has **57 validation errors** that prevent DRY-RUN launch:
- **55 errors**: `"Schema with id #XXXX does not exist"` — blocks reference DEMO schema UUIDs
- **2 errors**: Token IDs are DEMO virtual UUIDs that don't exist

### What Was Tried (and failed)
1. **Cleaned .policy ZIP** — stripped DEMO metadata from 8 schema files + policy.json, repacked, re-imported. Result: Guardian imports the policy but does NOT create schemas on the new policy's topic. Zero schemas linked.
2. **Remapped schema refs via PUT API** — Updated the live policy's block `"schema"` fields from old DEMO IDs to PUBLISHED IDs on topic `0.0.8287274` (which belong to `EWD-RB v1.0`). PUT succeeded, refs changed, but **validation still fails**. Cross-policy schema references likely don't work — Guardian scopes schemas per policy.
3. **Second import attempt** created an accidental duplicate policy (`EWD-RB v0.4_1773942333953`, ID `69bc363d`). Needs cleanup.

### Root Cause (confirmed)
Guardian's `.policy` import does NOT properly create schemas from the ZIP's `schemas/` directory. When importing, Guardian creates the policy structure (blocks, roles, config) but the 8 schema files in the ZIP are silently ignored or fail to link. The blocks then reference non-existent schema IDs → validation fails.

### Why the DEMO Worked
The DEMO policy was **built** in Guardian's policy editor (schemas created first, then blocks wired to them). Export preserves the block→schema wiring by UUID, but import into a new policy doesn't recreate the schemas in the new policy's scope.

---

## CURRENT STATE OF ALL POLICIES

| Policy | ID | Status | Topic | Notes |
|--------|-----|--------|-------|-------|
| **EWD-RB v0.4** | `69bc34a6e755119d0774b9e1` | DRAFT | `0.0.8290965` | Target — has remapped schema refs but still fails validation |
| EWD-RB v0.4_1773942333953 | `69bc363de755119d0774c035` | DRAFT | `0.0.8290999` | **JUNK — delete via UI** |
| EWD-RB v0.5 | `69bc308ce755119d0774ab6d` | DRAFT | `0.0.8290829` | Unknown origin — user created? |
| **EWD-RB v1.0** | `69bbdb78e755119d07740446` | PUBLISH | `0.0.8287274` | Has real tokens + schemas |
| EWD-RB v0.3 DEMO | `69ba1770e755119d0773d24a` | DEMO | `0.0.1773803376048641` | Original working test |
| Eggologic | `69ba1b9de755119d0773d3df` | DRAFT | `0.0.8270035` | Different policy — ignore |
| iRec_7 | `69ba17d7e755119d0773d322` | DEMO | — | Sample policy — ignore |
| EWD-RB v0.3 PUBLISH | `69b9f95de755119d0773d12a` | PUBLISH | `0.0.8264778` | Old — ignore |
| EWD-RB v0.3 | `69b973bbe755119d0773b469` | DISCONTINUED | — | Broken — ignore |
| EGGOLOGIC_WASTE...F | `69b4630ee755119d07739c08` | DISCONTINUED | — | Old — ignore |

---

## KEY DISCOVERY: EWD-RB v1.0 EXISTS AND IS PUBLISHED

Policy `69bbdb78e755119d07740446` is **PUBLISHED** with:
- **Real Hedera token IDs**: `0.0.8287358` and `0.0.8287362`
- **8 PUBLISHED schemas** on topic `0.0.8287274`
- **Same block structure** as the DEMO (204 blocks, same roles)

**This may be the fastest path forward** — if v1.0 is already published with the correct structure, we might be able to DRY-RUN or run the workflow directly on it instead of fighting to fix v0.4.

### v1.0 Schema IDs (PUBLISHED on 0.0.8287274)
| Schema | IRI |
|--------|-----|
| Impact Calculation | `#e1d14b90-fc79-4dfb-9383-28e971c581b2&1.0.0` |
| Waste Batch | `#1eac104c-5bc5-4f92-be1a-1773c26faad8&1.0.0` |
| Supplier Registration | `#d4268627-2381-47f9-b79e-d204fcb5b343&1.0.0` |
| Production Output | `#980725cb-7eec-4e0a-bd9b-daa6936931d6&1.0.0` |
| Waste Delivery | `#efb90bfb-f651-4372-924e-f79da0c175a7&1.0.0` |
| VVB Assessment Record | `#9c19c140-58c1-4d8d-ae27-b1269ffc20aa&1.0.0` |
| External Validation Record | `#4eb26fe9-d5c6-4fcd-b4d4-29470004b3ef&1.0.0` |
| Issuance Record | `#3721dc96-2213-41ea-b571-7dc44f73f9c1&1.0.0` |

### v1.0 Token IDs (real Hedera HTS)
| Token | Hedera ID |
|-------|-----------|
| Token 1 (NFT?) | `0.0.8287358` |
| Token 2 (EGGOCOIN?) | `0.0.8287362` |

### DEMO Schema IDs (for reference — these are the broken refs)
| Schema | IRI |
|--------|-----|
| Impact Calculation | `#626bc024-edb1-4257-a4bf-763125864e62` |
| Waste Batch | `#2bc9d736-8dd9-474e-99d5-2200c0fa115b` |
| Supplier Registration | `#de795b52-bf24-4eca-8798-1b1b80660733` |
| Production Output | `#12257ada-e83b-4100-814d-5b5c80209861` |
| Waste Delivery | `#0783ebf6-16f9-4e27-919e-479e29cdc009` |
| VVB Assessment Record | `#661ce532-fe97-485b-8965-bdeb03e2e451` |
| External Validation Record | `#f28c4e56-289a-473d-90f9-dd4e9dfee6f1` |
| Issuance Record | `#392b0c99-77bf-4b0c-9bb0-d51783f8eaae` |

---

## APPROACHES FOR NEXT SESSION (ordered by likelihood of success)

### Approach 1: USE v1.0 DIRECTLY (fastest)
If `EWD-RB v1.0` is already published and has the correct structure, skip v0.4 entirely:
1. Query v1.0's blocks to discover block IDs
2. Create virtual users (if DRY-RUN available) or real users
3. Run the 10-step workflow with real Hedera transactions
4. **Risk**: Need to confirm v1.0 has the same 204-block structure and isn't a different/broken policy

### Approach 2: CREATE SCHEMAS VIA API FOR v0.4
Instead of importing schemas via ZIP, create them directly via Guardian API:
1. Check Guardian docs for `POST /api/v1/schemas` — can you create schemas on a specific policy?
2. Create 8 schemas on the v0.4 policy's topic (`0.0.8290965`)
3. Get the new schema IDs Guardian assigns
4. Remap block references to these new IDs via PUT
5. **Risk**: Schema creation API may not support this for DRAFT policies

### Approach 3: EXPORT v1.0 AND RE-IMPORT
Since v1.0 is PUBLISHED and working:
1. Export v1.0 as `.policy` file
2. Import it — Guardian might handle PUBLISHED→DRAFT better than DEMO→DRAFT
3. The schemas might carry over properly from a PUBLISHED source
4. **Risk**: Same import bug could recur

### Approach 4: READ GUARDIAN DOCS ON POLICY IMPORT
The Guardian docs may explain:
- How to properly import with schemas
- Whether there's a flag to preserve/recreate schemas
- Why DEMO exports lose schema linkage
- Docs base URL: `https://docs.guardianservice.io/`
- Specifically check: policy import/export docs, schema management docs

---

## AUTH

```bash
# Login
curl -s -X POST "https://guardianservice.app/api/v1/accounts/loginByEmail" \
  -H "Content-Type: application/json" \
  -d '{"email":"r.aguileira88@gmail.com","password":"test"}'
# → .refreshToken

# Access token
curl -s -X POST "https://guardianservice.app/api/v1/accounts/access-token" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<from above>"}'
# → .accessToken
```

## API PATTERNS

- **List policies**: `GET /api/v1/policies`
- **Get policy**: `GET /api/v1/policies/{id}`
- **Update DRAFT policy**: `PUT /api/v1/policies/{id}` with full policy JSON body (confirmed working)
- **Import policy**: `POST /api/v1/policies/import/file` with `Content-Type: binary/octet-stream` and `--data-binary @file.policy`
- **List schemas**: `GET /api/v1/schemas` (all) or `GET /api/v1/schemas?topicId=X` or `?policyId=X`
- **Delete policy**: NOT available via API (use Guardian UI)

## ROLE STRINGS (exact — trailing whitespace matters)
```
"Registry "           (1 trailing space)
"Project_Proponent "  (1 trailing space)
"Operator "           (1 trailing space)
"VVB  "               (2 trailing spaces)
```

## LOCAL FILES

| File | Purpose |
|------|---------|
| `guardian_tmp/policy_repack/` | Unpacked .policy working dir (schemas now have PUBLISHED UUIDs) |
| `guardian_tmp/policy_repack/policy.json` | Policy config with remapped schema refs |
| `guardian_tmp/EWD-RB-v0.4-remapped.policy` | Latest repacked .policy ZIP |
| `guardian_tmp/policy_live_full.json` | Full v0.4 policy JSON from API (before PUT) |
| `guardian_tmp/policy_live_remapped.json` | Full v0.4 policy JSON with remapped refs (after PUT) |
| `guardian_tmp/schemas_all2.json` | All 45 schemas in the system |
| `guardian_tmp/field_mappings.md` | Schema field reference |
| Previous handoffs in `EggoLogic-Hedera-Hackathon/guardian/` |

## ENVIRONMENT
- **Windows 10** — use `C:/Users/CAPS/guardian_tmp/` for temp files
- **No python** — use `node -e` for JSON processing
- **PowerShell** for ZIP operations
- **Token expiry** — re-auth if 401 (tokens ~30 min)

## CLEANUP NEEDED
1. Delete `EWD-RB v0.4_1773942333953` (`69bc363d`) via Guardian UI — accidental duplicate
2. Clarify what `EWD-RB v0.5` (`69bc308c`) is — user may have created it
3. If using v1.0 approach, the v0.4 policies can all be deleted
