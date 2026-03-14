const config = require('../config/env');
const logger = require('../utils/logger');

const GUARDIAN_URL = config.guardian.url;
const TENANT_ID = "69a20b80b545b115a3d33542";

async function guardianLogin() {
  try {
    const loginRes = await fetch(`${GUARDIAN_URL}/api/v1/accounts/loginByEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: config.guardian.username, 
        password: config.guardian.password,
        tenantId: TENANT_ID
      }),
    });

    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);

    const loginData = await loginRes.json();
    const refreshToken = loginData.login?.refreshToken;
    if (!refreshToken) return null;

    const tokenRes = await fetch(`${GUARDIAN_URL}/api/v1/accounts/access-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!tokenRes.ok) throw new Error(`Access-token exchange failed`);

    const tokenData = await tokenRes.json();
    return tokenData.accessToken;
  } catch (err) {
    logger.error(`Guardian login error: ${err.message}`);
    return null;
  }
}

async function getSuppliers() {
  const token = await guardianLogin();
  if (!token) return [];

  try {
    // Using the search-documents endpoint discovered by visual inspection
    const res = await fetch(`${GUARDIAN_URL}/api/v1/policies/${config.guardian.policyId}/search-documents?pageIndex=0&pageSize=50`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    logger.info(`Guardian docs response keys: ${Object.keys(data).join(', ')}`);
    const results = Array.isArray(data) ? data : (data.results || []);
    logger.info(`Guardian: Found ${results.length} documents.`);
    if (results.length > 0) {
      logger.info(`Sample doc type: ${JSON.stringify(results[0].type)}`);
      logger.info(`Sample doc keys: ${Object.keys(results[0]).join(', ')}`);
    }
    // Filter for documents that look like suppliers (by schema or fields)
    const suppliers = results
      .filter(doc => {
        const d = doc.document || doc;
        if (!d.credentialSubject || !d.credentialSubject[0] || !d.credentialSubject[0].field2) return false;
        // The Provider VC schema only has up to field4/field5. The Delivery schema has field0-field7.
        // Differentiate them by ensuring field6 or field7 is undefined.
        return d.credentialSubject[0].field7 === undefined;
      })
      .map(doc => {
        const d = doc.document || doc;
        const sub = d.credentialSubject[0];
        return {
          id: sub.id,
          nombre: sub.field0 || sub.field1,
          wallet: sub.field2
        };
      });
    logger.info(`Guardian: Logic found ${suppliers.length} matching suppliers.`);
    return suppliers;
  } catch (err) {
    logger.error(`Error fetching suppliers: ${err.message}`);
  }
  return [];
}

async function submitDelivery(deliveryData) {
  const token = await guardianLogin();
  if (!token) return { status: 'ERROR', message: 'Auth failed' };

  try {
    const tagName = 'OWNER_requestVcDocumentBlock_17';
    
    // Format date to YYYY-MM-DD
    let formattedDate = deliveryData.Fecha || new Date().toISOString().split('T')[0];
    if (formattedDate.includes('/')) {
      const parts = formattedDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    const payload = {
      "document": {
        "field0": deliveryData.delivery_id || `${deliveryData.supplier_id}_${Date.now()}`,
        "field1": String(deliveryData.supplier_id),
        "field2": String(deliveryData.supplier_wallet || '0.0.0'), 
        "field3": formattedDate,
        "field4": String(deliveryData.kg_brutos || '0'),
        "field5": String(deliveryData.pct_impropios || '0'),
        "field6": Number(deliveryData.kg_netos || 0),
        "field7": String(deliveryData.observaciones || 'Carga via Middleware')
      },
      "ref": null
    };

    const res = await fetch(`${GUARDIAN_URL}/api/v1/policies/${config.guardian.policyId}/tag/${tagName}/blocks`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { status: 'ERROR', message: errorText };
    }

    const result = await res.json();
    return { status: 'SUCCESS', result };
  } catch (err) {
    logger.error(`Guardian submission error: ${err.message}`);
    return { status: 'ERROR', message: err.message };
  }
}

module.exports = { guardianLogin, submitDelivery, getSuppliers };
