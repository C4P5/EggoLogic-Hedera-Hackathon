# Resume Prompt — Dashboard Build V1

Paste this into a new Claude session to continue where we left off.

---

## PROMPT

```
Read these files in order before doing anything:

1. guardian/WORKFLOW-TEST-HANDOFF-V8.md — full Guardian policy context (accounts, block IDs, tokens, workflow)
2. guardian/DASHBOARD-HANDOFF-V1.md — dashboard brainstorm results (data mapping, architecture, Stitch screens)

Then read the 4 Stitch HTML source files:
- docs/stitch-screens/4-dashboard.html
- docs/stitch-screens/3-wallet-details.html
- docs/stitch-screens/2-impact-report.html
- docs/stitch-screens/1-marketplace.html

CONTEXT:
- Eggologic is a circular economy platform on Hedera for the Apex Hackathon (deadline March 22, 2026)
- The Guardian policy (EWD-RB v0.3) is PUBLISHED and fully verified on Hedera testnet
- EGGOCOIN (0.0.8287358) and CARBONCOIN NFT (0.0.8287362) are live
- We have 4 Stitch-generated HTML screens that need to be wired to real Guardian API + Hedera Mirror Node data
- The old dashboard/ and middleware/ folders were deleted — we're starting fresh
- Architecture decision pending: recommended Approach A (static HTML pages + shared JS for API calls)

TASK:
We were in the brainstorming phase. The data mapping is complete (see DASHBOARD-HANDOFF-V1.md).
The user needs to confirm the architecture approach (A/B/C), then we proceed to implementation.

Pick up from: "User confirms architecture approach" in the WHAT TO DO NEXT section.

Installed skills available:
- stitch-design, design-md, enhance-prompt (Google Stitch skills in ~/.claude/skills/)
- Stitch MCP configured in .vscode/mcp.json

Key constraints:
- 2-day deadline (hackathon submission March 22)
- No middleware — dashboard calls Guardian API directly
- Guardian managed service at guardianservice.app
- Windows 10, no python, use node for scripting
- Auth tokens expire ~30 min, need re-auth handling
```
