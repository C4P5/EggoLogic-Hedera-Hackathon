# DOMAIN: Authentication & Authorization

## Goal
Implement a Social Login flow for external users using Google OAuth 2.0, ensuring only approved users can access the dashboard.

## Specifications
1. **OAuth Provider:** Google OAuth 2.0.
2. **Framework:** Inspect the local `/dashboard` directory to determine the active framework (e.g., Next.js, React/Vite + Express). Implement the most native authentication library for that framework (e.g., NextAuth.js for Next.js, or Passport.js/session for Express).
3. **Authorization (Allowlist):** 
   - We do NOT have a database yet.
   - Read an environment variable `ALLOWED_EMAILS` (comma-separated list of emails).
   - If the authenticated Google email is NOT in this list, return a 403 Forbidden / Access Denied error at the login boundary.
4. **Session:** Issue a secure HTTP-only session cookie or JWT so the frontend knows the user is logged in.

## Output Required
- Setup the OAuth Google Provider.
- Create the Allowlist Middleware/Logic.
- Provide instructions for which `.env` variables the developer needs to set (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ALLOWED_EMAILS`).