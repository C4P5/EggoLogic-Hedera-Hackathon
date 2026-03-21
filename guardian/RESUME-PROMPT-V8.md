# Resume Prompt — V8

Continue the EggoLogic Guardian workflow. Handoff at `EggoLogic-Hedera-Hackathon/guardian/WORKFLOW-TEST-HANDOFF-V8.md`.

## SITUATION
PUBLISH workflow is **100% complete** — all 10 steps executed on live Hedera testnet with real user accounts. Minting verified: 135 EGGOCOIN (33+34+31+37), 0 NFTs, 1 rejection (ENT-004). Policy `69bc4638e755119d0774dd03` is live on Hedera testnet (version 0.3.0).

## WHAT WAS DONE
1. Created 4 real user accounts via tenant invite (Outlook emails)
2. Set up Hedera testnet profiles (ED25519 keys + DIDs) for each account
3. Published the policy to Hedera testnet
4. Discovered tenant permission fix: must use "Policy User" custom role (not "Default policy user")
5. Assigned policy roles (Registry, Project_Proponent, Operator, VVB)
6. Executed full 10-step workflow with corrected execution order
7. Verified all minting matches expected values

## ACCOUNTS
- **OWNER (SR):** r.aguileira88@gmail.com | 0.0.7166777
- **Registry:** eggologic-registry@outlook.com | 0.0.8292724
- **Proponent:** eggologic-proponent@outlook.com | 0.0.8294621
- **Operator:** eggologic-operator@outlook.com | 0.0.8294659
- **VVB:** eggologic-vvb@outlook.com | 0.0.8294709
- **Password (all):** test

## TOKENS ON HEDERA TESTNET
- **EGGOCOIN (fungible):** 0.0.8287358 — 135 minted
- **Circular Impact NFT:** 0.0.8287362 — 0 minted (below threshold)

## CRITICAL REMINDERS
1. **Auth tokens expire in ~30 min** — run `guardian_tmp/reauth_all.sh` to refresh
2. **Tenant custom role** must be "Policy User" (not "Default policy user") for role selection to work
3. **Role strings have trailing spaces** — `"Registry "`, `"VVB  "` (2 spaces)
4. **Approval buttons need full document** — not just the doc ID

## POSSIBLE NEXT STEPS
1. Verify tokens on HashScan testnet explorer
2. Prepare hackathon submission materials
3. Create demo video
4. Rename policy to a cleaner name
5. Run a second issuance cycle
