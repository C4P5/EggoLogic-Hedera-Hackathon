# Resume Prompt — V5

Copy/paste this into a new Claude session:

---

Continue the EggoLogic Guardian workflow. Handoff at `EggoLogic-Hedera-Hackathon/guardian/WORKFLOW-TEST-HANDOFF-V5.md`.

## SITUATION
We have a PUBLISHED policy `EWD-RB v1.0` (ID: `69bbdb78e755119d07740446`) with real Hedera tokens and 8 PUBLISHED schemas. We also have a broken DRAFT `EWD-RB v0.4` (ID: `69bc34a6e755119d0774b9e1`) that fails validation with 57 errors — Guardian's .policy import does NOT recreate schemas on the new policy's topic. Remapping block schema refs to cross-reference another policy's schemas also failed.

## WHAT TO DO FIRST
1. **Ask me**: Should we use the working v1.0 PUBLISHED policy directly instead of fixing v0.4? v1.0 has real tokens (`0.0.8287358`, `0.0.8287362`) and all 8 schemas PUBLISHED. If v1.0 has the correct 204-block structure, it's the fastest path to the hackathon deadline (March 22).
2. **If fixing v0.4**: Read Guardian docs at `https://docs.guardianservice.io/` about how to properly create/link schemas to a DRAFT policy. The core problem is that imported policies have zero schemas — the `schemas/` dir in the .policy ZIP is ignored.
3. **Cleanup first**: There's a junk duplicate policy `EWD-RB v0.4_1773942333953` (ID: `69bc363d`) — ask me to delete it via UI. Also clarify what `EWD-RB v0.5` is.

## GOAL
Get a policy to DRY-RUN status, create 4 virtual users (Registry, PP, Operator, VVB), replay the proven 10-step workflow, then PUBLISH. Deadline March 22, 2026.

---
