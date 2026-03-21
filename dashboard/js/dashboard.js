// Eggologic Dashboard — Screen 4 (index.html) Data Binding
// Loads: hero metrics (global, no login), wallet balance + transactions (user-specific)

/**
 * Load global metrics — visible to ALL visitors (no login required).
 * Sources: Guardian cache (local JSON) + Hedera Mirror Node (public API).
 */
async function loadGlobalMetrics() {
  ['metric-waste', 'metric-co2', 'metric-eggs'].forEach(id => UI.showLoading(id));

  try {
    const deliveryData = await GuardianAPI.getBlockData(CONFIG.BLOCKS.VVB_DELIVERY);
    const docs = extractDocuments(deliveryData);
    const deliveries = docs.filter(d => d.document?.credentialSubject);

    let totalKgIngreso = 0;
    let totalKgAjustados = 0;

    deliveries.forEach(d => {
      const cs = Array.isArray(d.document.credentialSubject)
        ? d.document.credentialSubject[0]
        : d.document.credentialSubject;
      if (cs) {
        totalKgIngreso += parseFloat(cs.kg_ingreso || cs.field8) || 0;
        totalKgAjustados += parseFloat(cs.kg_ajustados || cs.field12) || 0;
      }
    });

    // Hero metrics
    if (totalKgIngreso > 0) {
      const wasteT = totalKgIngreso / 1000;
      UI.setText('metric-waste', wasteT >= 1 ? `${wasteT.toFixed(1)}t` : `${UI.fmt(totalKgIngreso)}kg`);
    } else {
      UI.setText('metric-waste', '1.8t');
    }

    const co2Kg = (totalKgAjustados || 1227.1) * 0.70;
    const co2T = co2Kg / 1000;
    UI.setText('metric-co2', co2T >= 1 ? `${co2T.toFixed(1)}t` : `${co2Kg.toFixed(0)}kg`);
    UI.setText('metric-eggs', '1,020');

    // Store delivery count for form ID generation
    window._deliveryCount = deliveries.length;

  } catch (e) {
    console.error('Guardian data error:', e);
    UI.setText('metric-waste', '1.8t');
    UI.setText('metric-co2', '859kg');
    UI.setText('metric-eggs', '1,020');
    window._deliveryCount = 0;
  }
}

/**
 * Load user-specific data — wallet balance, transactions, recent activity.
 * Requires login (needs a specific Hedera account ID).
 */
async function loadUserData() {
  if (!GuardianAPI.isLoggedIn()) return;

  const user = GuardianAPI.currentUser();
  UI.showLoading('wallet-balance');
  UI.showSkeletonRows('wallet-tx-list', 3);
  UI.showSkeletonRows('recent-activity', 3);

  try {
    const balance = await HederaMirror.getEggocoinBalance(user.hedera);
    UI.setText('wallet-balance', `${UI.fmt(balance)} $EGGO`);
    UI.setText('wallet-hedera-id', user.hedera);
    loadWalletWidget(user.hedera);
    loadRecentActivity(user.hedera);
  } catch (e) {
    console.error('Hedera data error:', e);
    UI.setText('wallet-balance', 'Error');
  }
}

/**
 * Extract VC documents from Guardian block response (handles various formats).
 */
function extractDocuments(blockData) {
  if (!blockData) return [];
  // Could be { data: [...] } or { documents: [...] } or array directly
  if (Array.isArray(blockData)) return blockData;
  if (blockData.data && Array.isArray(blockData.data)) return blockData.data;
  if (blockData.documents && Array.isArray(blockData.documents)) return blockData.documents;
  // Single document wrapper
  if (blockData.document) return [blockData];
  return [];
}

/**
 * Populate the wallet transaction widget (3 most recent).
 */
async function loadWalletWidget(accountId) {
  try {
    const txs = await HederaMirror.getTransactions(accountId, 10);
    const container = document.getElementById('wallet-tx-list');
    if (!container) return;

    if (txs.length === 0) {
      container.innerHTML = '<p class="text-stone-400 text-sm text-center py-6">No EGGOCOIN transactions yet</p>';
      return;
    }

    container.innerHTML = txs.slice(0, 3).map(tx => {
      const amount = tx.eggocoin.amount;
      const isCredit = amount > 0;
      const icon = isCredit ? 'recycling' : 'shopping_cart';
      const iconBg = isCredit ? 'bg-yellow-100/50' : 'bg-[#C1EDC7]/30';
      const iconColor = isCredit ? 'text-yellow-800' : 'text-primary';
      const amountColor = isCredit ? 'text-secondary' : 'text-error';
      const label = isCredit ? 'Token Reward' : 'Token Transfer';
      const txUrl = `${CONFIG.HASHSCAN_URL}/transaction/${tx.txId}`;

      return `
        <a href="${txUrl}" target="_blank" rel="noopener" class="flex items-center justify-between py-2 hover:bg-stone-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 rounded-lg px-2 border-transparent border hover:border-stone-100 no-underline text-inherit">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor}">
              <span class="material-symbols-outlined text-xl">${icon}</span>
            </div>
            <div>
              <p class="text-xs font-bold text-primary">${label}</p>
              <p class="text-[10px] text-stone-400">${UI.timeAgo(tx.date)}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold ${amountColor}">${isCredit ? '+' : ''}${UI.fmt(amount)} $EGGO</p>
            <span class="text-[8px] bg-[#C1EDC7]/40 text-[#10381E] px-2 py-0.5 rounded-full font-bold uppercase">completed</span>
          </div>
        </a>
      `;
    }).join('');
  } catch (e) {
    console.error('Wallet widget error:', e);
  }
}

/**
 * Populate the recent activity section.
 */
async function loadRecentActivity(accountId) {
  try {
    const txs = await HederaMirror.getTransactions(accountId, 10);
    const container = document.getElementById('recent-activity');
    if (!container) return;

    if (txs.length === 0) {
      container.innerHTML = '<p class="text-stone-400 text-sm text-center py-12">No recent activity</p>';
      return;
    }

    container.innerHTML = txs.slice(0, 5).map(tx => {
      const amount = tx.eggocoin.amount;
      const isCredit = amount > 0;
      const icon = isCredit ? 'volunteer_activism' : 'shopping_basket';
      const amountColor = isCredit ? 'text-secondary' : 'text-error';
      const bgClass = isCredit ? 'bg-secondary-fixed-dim' : 'bg-secondary-container';
      const label = isCredit ? 'Impact Reward: EGGOCOIN Mint' : 'Token Transfer';
      const txUrl = `${CONFIG.HASHSCAN_URL}/transaction/${tx.txId}`;

      return `
        <a href="${txUrl}" target="_blank" rel="noopener" class="group flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container-highest transition-all rounded-xl hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-primary/10 duration-300 cursor-pointer no-underline text-inherit">
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 rounded-full ${bgClass} flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-2xl">${icon}</span>
            </div>
            <div>
              <h5 class="font-bold text-primary">${label}</h5>
              <p class="text-sm text-on-surface-variant">${UI.timeAgo(tx.date)} • ${tx.txId.split('-')[0]}</p>
            </div>
          </div>
          <div class="text-right flex items-center gap-2">
            <div>
              <p class="font-headline text-xl ${amountColor}">${isCredit ? '+' : ''}${UI.fmt(amount)} $EGGO</p>
              <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Completed</p>
            </div>
            <span class="material-symbols-outlined text-stone-300 group-hover:text-primary text-sm transition-colors">open_in_new</span>
          </div>
        </a>
      `;
    }).join('');
  } catch (e) {
    console.error('Recent activity error:', e);
  }
}

// ── Delivery Form Logic ──

/**
 * Swap between CTA and form based on login state.
 */
function updateDeliveryCard() {
  const cta = document.getElementById('delivery-cta');
  const form = document.getElementById('delivery-form');
  if (!cta || !form) return;

  if (GuardianAPI.isLoggedIn()) {
    cta.classList.add('hidden');
    form.classList.remove('hidden');
    // Set delivery ID chip
    const count = (window._deliveryCount || 0) + 1;
    const chip = document.getElementById('delivery-id-chip');
    if (chip) chip.textContent = `ENT-${String(count).padStart(3, '0')}`;
  } else {
    cta.classList.remove('hidden');
    form.classList.add('hidden');
  }
}

/**
 * Live preview: compute adjusted kg as user types.
 */
function updateDeliveryPreview() {
  const bruto = parseFloat(document.getElementById('delivery-kg-bruto')?.value) || 0;
  const impropios = parseFloat(document.getElementById('delivery-kg-impropios')?.value) || 0;
  const preview = document.getElementById('delivery-preview');
  const btn = document.getElementById('delivery-submit-btn');
  const catChip = document.getElementById('delivery-category');

  if (bruto <= 0) {
    if (preview) preview.classList.add('hidden');
    if (catChip) catChip.classList.add('hidden');
    if (btn) { btn.disabled = true; btn.textContent = 'Enter weight to submit'; }
    return;
  }

  const netos = bruto - impropios;
  const ajustados = netos * 0.70;
  const eggo = Math.round(ajustados);
  const ratio = (impropios / bruto) * 100;
  const cat = ratio <= 5 ? 'A' : ratio <= 10 ? 'B' : 'C';

  if (preview) {
    preview.classList.remove('hidden');
    document.getElementById('preview-netos').textContent = `${netos.toFixed(1)} kg`;
    document.getElementById('preview-ajustados').textContent = `${ajustados.toFixed(2)} kg`;
    document.getElementById('preview-eggo').textContent = `+${eggo} $EGGO`;
  }

  if (catChip) {
    catChip.textContent = `Cat. ${cat}`;
    catChip.classList.remove('hidden');
    catChip.className = catChip.className.replace(/bg-\[#[^\]]+\]\/\d+|bg-red-100|bg-yellow-100/g, '');
    if (cat === 'C') {
      catChip.classList.add('bg-red-100');
      catChip.classList.remove('bg-[#C1EDC7]/30');
    } else if (cat === 'B') {
      catChip.classList.add('bg-yellow-100');
      catChip.classList.remove('bg-[#C1EDC7]/30');
    } else {
      catChip.classList.add('bg-[#C1EDC7]/30');
    }
  }

  if (btn) {
    if (cat === 'C') {
      btn.disabled = true;
      btn.textContent = 'Contamination too high (Cat. C)';
    } else {
      btn.disabled = false;
      btn.textContent = `Submit Delivery (+${eggo} $EGGO)`;
    }
  }
}

/**
 * Submit the delivery form to Guardian API.
 */
async function submitDeliveryForm() {
  const btn = document.getElementById('delivery-submit-btn');
  const bruto = parseFloat(document.getElementById('delivery-kg-bruto').value) || 0;
  const impropios = parseFloat(document.getElementById('delivery-kg-impropios').value) || 0;
  const wasteType = document.getElementById('delivery-waste-type').value;
  const evidence = document.getElementById('delivery-evidence').value || 'https://evidence.eggologic.com/dashboard';

  if (bruto <= 0) return;

  const netos = bruto - impropios;
  const ajustados = netos * 0.70;
  const ratio = ((impropios / bruto) * 100).toFixed(1);
  const cat = ratio <= 5 ? 'A' : ratio <= 10 ? 'B' : 'C';
  const count = (window._deliveryCount || 0) + 1;
  const deliveryId = `ENT-${String(count).padStart(3, '0')}`;

  btn.disabled = true;
  btn.textContent = 'Submitting to Guardian...';

  try {
    await GuardianAPI.submitDelivery({
      field0: 'EWD-RB',
      field1: '0.3',
      field2: 'v0.3',
      field3: 'v0.3',
      field4: deliveryId,
      field5: 'SUP-001',
      field6: new Date().toISOString(),
      field7: wasteType,
      field8: bruto,
      field9: impropios,
      field10: parseFloat(ratio),
      field11: parseFloat(netos.toFixed(2)),
      field12: parseFloat(ajustados.toFixed(2)),
      field13: cat,
      field14: true,
      field15: [evidence],
      field16: 'Submitted',
      field17: [evidence],
    });

    UI.showToast(`Delivery ${deliveryId} submitted successfully!`);
    window._deliveryCount = count;

    // Reset form
    document.getElementById('delivery-kg-bruto').value = '';
    document.getElementById('delivery-kg-impropios').value = '';
    document.getElementById('delivery-evidence').value = '';
    document.getElementById('delivery-id-chip').textContent = `ENT-${String(count + 1).padStart(3, '0')}`;
    document.getElementById('delivery-preview').classList.add('hidden');
    document.getElementById('delivery-category').classList.add('hidden');
    btn.disabled = true;
    btn.textContent = 'Enter weight to submit';

    // Refresh metrics
    loadGlobalMetrics();
  } catch (e) {
    console.error('Delivery submission error:', e);
    UI.showToast(`Submission failed: ${e.message}`);
    btn.disabled = false;
    btn.textContent = `Submit Delivery`;
  }
}

// Called by UI after successful login
function onLogin() {
  loadUserData();
  updateDeliveryCard();
}

// Always load global metrics; load user data if already logged in
document.addEventListener('DOMContentLoaded', () => {
  loadGlobalMetrics();
  updateDeliveryCard();

  // Live preview listeners
  const brutoInput = document.getElementById('delivery-kg-bruto');
  const impropiosInput = document.getElementById('delivery-kg-impropios');
  if (brutoInput) brutoInput.addEventListener('input', updateDeliveryPreview);
  if (impropiosInput) impropiosInput.addEventListener('input', updateDeliveryPreview);

  if (GuardianAPI.isLoggedIn()) loadUserData();
});
