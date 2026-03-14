const { getSuppliers } = require('../services/guardian.service');
const { getSupplierRows, addOrUpdateSupplierRow } = require('../services/sheets.service');
const logger = require('../utils/logger');

async function syncSuppliers() {
  if (process.env.DEMO_MODE === 'true') return;

  try {
    logger.info('--- Syncing Suppliers Start ---');
    
    // 1. Fetch from Guardian
    let guardianSuppliers = [];
    try {
      guardianSuppliers = await getSuppliers();
      logger.info(`Guardian: Found ${guardianSuppliers.length} suppliers.`);
    } catch (gErr) {
      logger.error(`Guardian: Failed to fetch suppliers: ${gErr.message}`);
      return;
    }

    if (guardianSuppliers.length === 0) {
      logger.info('Guardian: No expected Proveedor VCs found.');
      return;
    }

    // 2. Fetch from Google Sheet
    const sheetSuppliers = await getSupplierRows();

    // 3. Update Sync
    let newOrUpdatedCount = 0;
    for (const gs of guardianSuppliers) {
      if (!gs.id || !gs.nombre) continue; // Skip invalid VCs
      
      const sheetSup = sheetSuppliers.find(s => s.Id === gs.id || s.supplier_id === gs.nombre);
      
      // If it exists but wallet isn't changing, skip unnecessary writes if needed (simplifying for now, writing anyways if anything changed)
      let needsUpdate = true;
      if (sheetSup && sheetSup.Id === gs.id && sheetSup.wallet_destino === gs.wallet) {
          if (sheetSup.codigo_corto && sheetSup.codigo_corto !== '') {
            needsUpdate = false; // Already synced and has code
          }
      }

      if (needsUpdate) {
          logger.info(`Syncing supplier ${gs.nombre} to Google Sheets...`);
          await addOrUpdateSupplierRow(gs);
          newOrUpdatedCount++;
      }
    }

    logger.info(`--- Syncing Suppliers End --- Synced ${newOrUpdatedCount} rows.`);

  } catch (err) {
    logger.error(`Sync suppliers error: ${err.message}`);
  }
}

module.exports = { syncSuppliers };
