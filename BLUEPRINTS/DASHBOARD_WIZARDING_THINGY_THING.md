# DOMAIN: Frontend-to-Backend Wiring

## Goal
Connect the UI dashboard forms to the newly created Authentication and KMS Service layers.

## Specifications
1. **UI State:** Ensure the Dashboard UI checks if the user is authenticated. If not, show a "Log in" button. That button should open a modal with 2 buttons: 1- "Log in with wallet" 2- "Log in with google"
2. **Submission:** When a client fills out the form (The Guardian policy requirements), trigger an API call to the backend. This information provided by the client must land in the guardian policy
3. **API Route:** Create a secure API route that:
   - Verifies the user's Auth Session.
   - Verifies the user is on the `ALLOWED_EMAILS` list.
   - Passes the `req.body` to `HederaGuardianService.submitDataToGuardian()`.
   - Returns the Hedera Transaction ID or Success/Error message to the frontend dashboard.