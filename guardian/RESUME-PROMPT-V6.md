# Resume Prompt — V6

## Copy-paste this into a new Claude session to continue:

---

Continue the EggoLogic Guardian workflow. Handoff at `EggoLogic-Hedera-Hackathon/guardian/WORKFLOW-TEST-HANDOFF-V6.md`.

## SITUATION
We have a DRY-RUN active policy (`69bc4638e755119d0774dd03`) with 4 virtual users already created and role-assigned. All 204 blocks validated. Block IDs for initial forms are discovered. Schema field mappings (types, enums, required fields) are fully documented.

## WHAT TO DO
Execute the 10-step EWD-RB workflow on the DRY-RUN policy. The handoff V6 document contains:
- Exact JSON bodies for all 10 steps
- Complete schema field reference with types and enum values
- All virtual user DIDs
- All discovered block IDs
- Block discovery instructions for tabs that appear mid-workflow

Start with Step 1 (OWNER submits Impact Calculation). Work through all 10 steps sequentially. After each step, verify the response and discover any new blocks that become visible.

## CRITICAL REMINDERS
1. **Re-authenticate first** — access tokens expire in ~30 min
2. **Save JSON bodies to files** — use `node -e` to write, `curl -d @file.json` to send (avoids Content-Length errors)
3. **Array fields** — `delivery_ids`, `batch_ids`, `evidence` fields are arrays, not strings
4. **Enum fields are strict** — check the handoff's schema reference for allowed values
5. **Block discovery is iterative** — after role advances (registration → tabs), re-GET blocks to find new form/button IDs
6. **Approval format** — `{"tag":"Button_0","document":<FULL doc from data array>}` (Button_0=Approve, Button_1=Reject)

## EXPECTED RESULTS
- 4 approved deliveries → 135 total EGGOCOIN minted (33+34+31+37)
- 1 rejected delivery (ENT-004, category C)
- 0 NFTs minted (135.1 kg < 1000 kg threshold)

## GOAL
Complete all 10 steps, verify minting matches expected values, then prepare for PUBLISH. Deadline March 22, 2026.
