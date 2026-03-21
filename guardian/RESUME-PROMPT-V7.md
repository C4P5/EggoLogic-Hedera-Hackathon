# RESUME PROMPT — V7

Continue the EggoLogic Guardian workflow. Handoff at `EggoLogic-Hedera-Hackathon/guardian/WORKFLOW-TEST-HANDOFF-V7.md`.

## SITUATION
DRY-RUN workflow is **100% verified** — all 10 steps executed, minting matches expected values (135 EGGOCOIN, 0 NFTs, 1 rejection). Policy `69bc4638e755119d0774dd03` is ready for PUBLISH.

## WHAT TO DO
1. **Create 4 real user accounts** on guardianservice.app (via UI — API registration is broken)
   - Use Gmail `+` aliases: `r.aguileira88+registry@gmail.com`, `+proponent`, `+operator`, `+vvb`
   - All confirmation emails go to same inbox
   - Or probe `registerByEmail` endpoint first in case it works
2. **PUBLISH the policy** to Hedera testnet
3. **Re-discover all block IDs** (they change after PUBLISH)
4. **Assign roles** for each new user account
5. **Execute the 10-step workflow** with real accounts (corrected execution order from V7)
6. **Verify minting on Hedera testnet** — real token transfers

## CRITICAL REMINDERS
1. **Execution order matters** — VVB must approve CALC-2026-001 BEFORE OWNER can submit CALC-2026-002 (OWNER is gated at "Submitted to approve" until VVB approves)
2. **Block IDs change after PUBLISH** — all V6/V7 block UUIDs are DRY-RUN only. Block tags stay the same.
3. **Re-authenticate first** — tokens expire in ~30 min
4. **Role strings have trailing spaces** — `"Registry "`, `"VVB  "` (2 spaces)
5. **JSON bodies from DRY-RUN are reusable** — same field values, same schemas

## EXPECTED RESULTS (same as DRY-RUN)
- 4 approved deliveries → 135 total EGGOCOIN minted (33+34+31+37)
- 1 rejected delivery (ENT-004, category C)
- 0 NFTs minted (135.1 kg < 1000 kg threshold)

## GOAL
Complete PUBLISH workflow with real Hedera transactions and real user accounts. Deadline March 22, 2026.
