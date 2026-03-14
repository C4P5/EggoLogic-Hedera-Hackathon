# DOMAIN: KMS Signer Integration Boundary

## Goal
Create an isolated service layer that connects the authenticated dashboard API to the existing AWS KMS Hedera signer. 

## Context
The project operates on an N-to-1 model. 'N' authenticated users will trigger actions that are paid for and signed by '1' single Operator Treasury account secured by AWS KMS (`ECC_SECG_P256K1`). Our goal with this integration is to use the MKS for creating hashgraph accounts for new non-web3 users.

## Specifications
1. The actual KMS signing logic is already written and working in another file based on the `aws-mks-workshop`. DO NOT rewrite the KMS signing logic. The Customer managed key Alias is 'hedera-signing-key'.
2. Create a Facade/Interface named `HederaGuardianService`.
3. This service should expose a method: 
   `async function submitDataToGuardian(Email: string, payload: any): Promise<TransactionReceipt | null>`
4. Internally, this method should:
   - Format the data as required for the Guardian Policy/Google Sheets middleware.
   - Call the pre-existing KMS signing function (import it as a stub for now, assume it takes `(transaction: Transaction)` as an argument).

## Output Required
- A clean, well-documented Service Class or Module.
