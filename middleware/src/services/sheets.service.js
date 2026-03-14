const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const config = require('../config/env');
const { getWeekNumber } = require('../utils/date.utils');
const logger = require('../utils/logger');

const GOOGLE_ENABLED = config.google && config.google.spreadsheetId && config.google.serviceAccountEmail && config.google.privateKey;

async function getDoc(readOnly = true) {
  if (!GOOGLE_ENABLED) {
    logger.info("Google Sheets polling disabled in demo mode");
    return null;
  }

  try {
    const auth = new JWT({
      email: config.google.serviceAccountEmail,
      key: config.google.privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });
    const doc = new GoogleSpreadsheet(config.google.spreadsheetId, auth);
    await doc.loadInfo();
    return doc;
  } catch (err) {
    logger.error(`Google Sheets connection error: ${err.message}`);
    return null;
  }
}

async function getSupplierDoc() {
  if (!config.google.supplierSpreadsheetId) return null;

  try {
    const auth = new JWT({
      email: config.google.serviceAccountEmail,
      key: config.google.privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });
    const doc = new GoogleSpreadsheet(config.google.supplierSpreadsheetId, auth);
    await doc.loadInfo();
    return doc;
  } catch (err) {
    logger.error(`Google Sheets supplier doc connection error: ${err.message}`);
    return null;
  }
}

function mapRowToEntrega(row) {
  const kgBruto = parseFloat(row.get('kg_brutos') || '0') || 0;
  const pctImpropios = parseFloat(row.get('pct_impropios') || '0') || 0;

  return {
    supplier_id: row.get('supplier_id') || '',
    Fecha: row.get('Fecha') || '',
    kg_brutos: kgBruto,
    pct_impropios: pctImpropios,
    destination: row.get('destination') || 'Plant',
    kg_netos: parseFloat(row.get('kg_netos') || '0') || kgBruto,
    Eggocoin: parseFloat(row.get('Eggocoin') || '0'),
    Foto: row.get('Foto') || '',
    waste_type: mapWasteType(row.get('Tipo de Residuo') || 'organico'),
    Semana: row.get('Semana') || '',
    delivery_id: row.get('delivery_id') || '',
    hts_mint_tx: row.get('hts_mint_tx') || '',
    hcs_tx: row.get('hcs_tx') || '',
    transfer_tx: row.get('transfer_tx') || '',
    _rowNumber: row.rowNumber,
  };
}

function mapWasteType(raw) {
  const map = {
    'organico': 'Food Waste',
    'orgánico': 'Food Waste',
    'food waste': 'Food Waste',
    'trampa_grasa': 'Grease Trap',
    'grease trap': 'Grease Trap',
    'mixto': 'Mixed Organic',
    'mixed organic': 'Mixed Organic',
    'poda': 'Garden Waste',
    'garden waste': 'Garden Waste',
  };
  return map[(raw || '').toLowerCase().trim()] || 'Food Waste';
}

async function getDeliveryRows() {
  const document = await getDoc();
  if (!document) return [];

  const sheet = document.sheetsByTitle['Entregas'] || document.sheetsByTitle['ENTREGAS'];
  if (!sheet) return [];
  const rows = await sheet.getRows();
  
  return rows
    .map(mapRowToEntrega)
    .filter(r => r.supplier_id && r.supplier_id.trim() !== '' && r.kg_brutos > 0);
}

async function addDeliveryRow(data) {
  const document = await getDoc(false);
  if (!document) return null;

  const sheet = document.sheetsByTitle['Entregas'] || document.sheetsByTitle['ENTREGAS'];
  if (!sheet) return null;

  try {
    const row = await sheet.addRow({
      Fecha: data.Fecha || new Date().toLocaleDateString('es-ES'),
      supplier_id: data.supplier_id,
      kg_brutos: data.kg_brutos,
      pct_impropios: data.pct_impropios || 0,
      destination: data.destination || 'Plant',
      kg_netos: data.kg_netos || data.kg_brutos,
      Foto: data.Foto || '',
      Semana: data.Semana || `W${getWeekNumber(new Date())}`,
      'Tipo de Residuo': data.waste_type || 'organico',
      delivery_id: data.delivery_id || data.external_id || `${data.supplier_id || 'unkn'}_${new Date().getTime()}`,
      hts_mint_tx: '',
      hcs_tx: '',
      transfer_tx: ''
    });
    return row;
  } catch (err) {
    logger.error(`Error adding row: ${err.message}`);
    throw err;
  }
}

async function updateDeliveryRow(rowNumber, data) {
  const document = await getDoc(false);
  if (!document) return null;

  const sheet = document.sheetsByTitle['Entregas'] || document.sheetsByTitle['ENTREGAS'];
  if (!sheet) return null;

  try {
    const rows = await sheet.getRows();
    const row = rows.find(r => r.rowNumber === rowNumber);
    if (row) {
      Object.keys(data).forEach(key => {
        row.set(key, data[key]);
      });
      await row.save();
      return row;
    }
  } catch (err) {
    logger.error(`Error updating row ${rowNumber}: ${err.message}`);
    throw err;
  }
  return null;
}

async function getNewDeliveries(offset = 0) {
  const rows = await getDeliveryRows();
  return rows.slice(offset);
}

async function getDeliveryRowCount() {
  const rows = await getDeliveryRows();
  return rows.length;
}

async function getSupplierRows() {
  const doc = await getSupplierDoc();
  if (!doc) return [];
  const sheet = doc.sheetsByIndex[0];
  if (!sheet) return [];
  const rows = await sheet.getRows();
  return rows.map(r => ({
    Id: r.get('Id'),
    Issuer: r.get('Issuer'),
    'Issuance Date': r.get('Issuance Date'),
    Proof: r.get('Proof'),
    supplier_id: r.get('supplier_id'),
    wallet_destino: r.get('wallet_destino'),
    contacto: r.get('contacto'),
    ubicacion: r.get('ubicacion'),
    activo: r.get('activo') === 'TRUE' || r.get('activo') === 'true',
    codigo_corto: r.get('codigo_corto') || r.get('codigo') || r.get('short') || '',
    _rowNumber: r.rowNumber
  }));
}

async function addOrUpdateSupplierRow(supplierData) {
  const doc = await getSupplierDoc();
  if (!doc) return null;
  const sheet = doc.sheetsByIndex[0];
  if (!sheet) return null;

  try {
    const rows = await sheet.getRows();
    const existing = rows.find(r => r.get('Id') === supplierData.id || r.get('supplier_id') === supplierData.nombre);
    
    if (existing) {
      existing.set('Id', supplierData.id || existing.get('Id'));
      existing.set('supplier_id', supplierData.nombre || existing.get('supplier_id'));
      existing.set('wallet_destino', supplierData.wallet || existing.get('wallet_destino'));
      existing.set('activo', 'TRUE'); // mark active
      
      // Assign code if missing
      if (!existing.get('codigo_corto') && !existing.get('codigo') && !existing.get('short')) {
         let nextCodeInt = rows.length + 1;
         let newCode = `P${String(nextCodeInt).padStart(2, '0')}`;
         while(rows.find(r => (r.get('codigo_corto') || r.get('codigo') || r.get('short')) === newCode)) {
           nextCodeInt++;
           newCode = `P${String(nextCodeInt).padStart(2, '0')}`;
         }
         existing.set('codigo_corto', newCode);
      }
      
      await existing.save();
      return existing;
    } else {
      let nextCodeInt = rows.length + 1;
      let newCode = `P${String(nextCodeInt).padStart(2, '0')}`;
      while(rows.find(r => (r.get('codigo_corto') || r.get('codigo') || r.get('short')) === newCode)) {
        nextCodeInt++;
        newCode = `P${String(nextCodeInt).padStart(2, '0')}`;
      }

      const row = await sheet.addRow({
        Id: supplierData.id,
        Issuer: 'Guardian',
        'Issuance Date': new Date().toISOString(),
        Proof: 'VC',
        supplier_id: supplierData.nombre,
        wallet_destino: supplierData.wallet,
        contacto: '',
        ubicacion: '',
        activo: 'TRUE',
        codigo_corto: newCode
      });
      return row;
    }
  } catch (err) {
    logger.error(`Error adding/updating supplier row: ${err.message}`);
    throw err;
  }
}

module.exports = {
  getDoc,
  getSupplierDoc,
  getDeliveryRows,
  addDeliveryRow,
  updateDeliveryRow,
  getDeliveryRowCount,
  getNewDeliveries,
  getSupplierRows,
  addOrUpdateSupplierRow
};
