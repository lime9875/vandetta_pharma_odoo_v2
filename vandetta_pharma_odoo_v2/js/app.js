// Vandetta Pharma ERP Core Engine
let pharmaDatabase = [
    { id: 101, name: "Ozempic (Semaglutide 2mg)", company: "Novo Nordisk", country: "الدنمارك 🇩🇰", type: "حقن", batch: "NN-88219", qty: 14200, price: 920.00, exp: "2028-06-30" },
    { id: 102, name: "Mounjaro (Tirzepatide 10mg)", company: "Eli Lilly", country: "الولايات المتحدة 🇺🇸", type: "حقن", batch: "EL-55102", qty: 9800, price: 1050.00, exp: "2027-11-15" },
    { id: 103, name: "Keytruda (Pembrolizumab 100mg)", company: "Merck & Co.", country: "الولايات المتحدة 🇺🇸", type: "حقن", batch: "MK-99120", qty: 4500, price: 4800.00, exp: "2027-04-20" },
    { id: 104, name: "Paxlovid (Nirmatrelvir/Ritonavir)", company: "Pfizer", country: "الولايات المتحدة 🇺🇸", type: "أقراص", batch: "PZ-33211", qty: 25000, price: 530.00, exp: "2026-12-31" },
    { id: 105, name: "Entresto (Sacubitril/Valsartan)", company: "Novartis", country: "سويسرا 🇨🇭", type: "أقراص", batch: "NV-10293", qty: 18500, price: 380.00, exp: "2028-01-10" },
    { id: 106, name: "Humira (Adalimumab 40mg)", company: "AbbVie", country: "الولايات المتحدة 🇺🇸", type: "حقن", batch: "AB-77410", qty: 6200, price: 2900.00, exp: "2027-08-18" },
    { id: 107, name: "Ocrevus (Ocrelizumab 300mg)", company: "Roche", country: "سويسرا 🇨🇭", type: "حقن", batch: "RC-44109", qty: 3100, price: 6500.00, exp: "2027-09-05" },
    { id: 108, name: "Stelara (Ustekinumab 90mg)", company: "Johnson & Johnson", country: "الولايات المتحدة 🇺🇸", type: "حقن", batch: "JJ-66182", qty: 5400, price: 3400.00, exp: "2028-03-25" },
    { id: 109, name: "Dupixent (Dupilumab 300mg)", company: "Sanofi", country: "فرنسا 🇫🇷", type: "حقن", batch: "SN-90123", qty: 11200, price: 1800.00, exp: "2027-10-12" },
    { id: 110, name: "Tagrisso (Osimertinib 80mg)", company: "AstraZeneca", country: "المملكة المتحدة 🇬🇧", type: "أقراص", batch: "AZ-11029", qty: 4900, price: 4200.00, exp: "2028-05-30" },
    { id: 111, name: "Shingrix (Herpes Zoster Vaccine)", company: "GSK", country: "المملكة المتحدة 🇬🇧", type: "حقن", batch: "GS-44910", qty: 15600, price: 210.00, exp: "2026-10-15" },
    { id: 112, name: "Xarelto (Rivaroxaban 20mg)", company: "Bayer", country: "ألمانيا 🇩🇪", type: "أقراص", batch: "BY-88301", qty: 32000, price: 160.00, exp: "2028-12-01" },
    { id: 113, name: "Jardiance (Empagliflozin 10mg)", company: "Boehringer Ingelheim", country: "ألمانيا 🇩🇪", type: "أقراص", batch: "BI-22109", qty: 28000, price: 240.00, exp: "2028-02-14" },
    { id: 114, name: "Opdivo (Nivolumab 100mg)", company: "Bristol Myers Squibb", country: "الولايات المتحدة 🇺🇸", type: "حقن", batch: "BM-55192", qty: 3800, price: 3100.00, exp: "2027-07-22" },
    { id: 115, name: "Entyvio (Vedolizumab 300mg)", company: "Takeda", country: "اليابان 🇯🇵", type: "حقن", batch: "TK-99012", qty: 4100, price: 2700.00, exp: "2027-12-10" }
];

let stockChartObj = null;
let categoryChartObj = null;

document.addEventListener("DOMContentLoaded", () => {
    initCompanyDropdowns();
    renderTable();
    renderCompanyCards();
    updateStats();
    initCharts();
});

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'font-bold');
        btn.classList.add('text-slate-300', 'font-medium');
    });

    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`btn-${tabId}`);
    activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'font-bold');
    activeBtn.classList.remove('text-slate-300', 'font-medium');

    if (tabId === 'dashboard') {
        updateCharts();
    }
}

// Company Dropdowns Populate
function initCompanyDropdowns() {
    const companies = [...new Set(pharmaDatabase.map(item => item.company))].sort();
    const filterSelect = document.getElementById('companyFilter');
    const modalSelect = document.getElementById('m_company');

    filterSelect.innerHTML = '<option value="">جميع الشركات العالمية</option>';
    modalSelect.innerHTML = '';

    companies.forEach(comp => {
        filterSelect.innerHTML += `<option value="${comp}">${comp}</option>`;
        modalSelect.innerHTML += `<option value="${comp}">${comp}</option>`;
    });
}

// Render Inventory Table
function renderTable() {
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const companyVal = document.getElementById('companyFilter').value;
    const typeVal = document.getElementById('typeFilter').value;

    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    const filtered = pharmaDatabase.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchVal) || 
                            item.company.toLowerCase().includes(searchVal) || 
                            item.batch.toLowerCase().includes(searchVal);
        const matchCompany = companyVal === '' || item.company === companyVal;
        const matchType = typeVal === '' || item.type === typeVal;
        return matchSearch && matchCompany && matchType;
    });

    filtered.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/50 transition border-b border-slate-800/60";
        tr.innerHTML = `
            <td class="p-4 font-bold text-white flex items-center space-x-2 space-x-reverse">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>${item.name}</span>
            </td>
            <td class="p-4"><span class="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-indigo-300 font-medium">${item.company}</span></td>
            <td class="p-4 text-slate-300">${item.type}</td>
            <td class="p-4 font-mono text-xs text-amber-300">${item.batch}</td>
            <td class="p-4 font-bold text-slate-100">${item.qty.toLocaleString()} عبوة</td>
            <td class="p-4 font-bold text-emerald-400">$${item.price.toFixed(2)}</td>
            <td class="p-4 text-xs font-mono text-slate-400">${item.exp}</td>
            <td class="p-4 text-center">
                <button onclick="deleteItem(${item.id})" class="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition" title="حذف">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Global Companies Cards
function renderCompanyCards() {
    const container = document.getElementById('companiesGrid');
    container.innerHTML = '';

    const companyMap = {};
    pharmaDatabase.forEach(item => {
        if(!companyMap[item.company]) {
            companyMap[item.company] = {
                name: item.company,
                country: item.country,
                drugs: []
            };
        }
        companyMap[item.company].drugs.push(item.name);
    });

    Object.values(companyMap).forEach(c => {
        const card = document.createElement('div');
        card.className = "glass-card p-5 rounded-xl space-y-3";
        card.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                    <h4 class="font-bold text-white text-base">${c.name}</h4>
                    <p class="text-xs text-slate-400">${c.country}</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black">
                    ${c.name.charAt(0)}
                </div>
            </div>
            <div>
                <p class="text-[11px] text-slate-400 mb-1 font-bold">الأدوية المسجلة بالفانديتا:</p>
                <div class="flex flex-wrap gap-1">
                    ${c.drugs.map(d => `<span class="bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded text-[11px]">${d}</span>`).join('')}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Update Top Bar Indicators
function updateStats() {
    const totalQty = pharmaDatabase.reduce((sum, item) => sum + item.qty, 0);
    const totalValue = pharmaDatabase.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const companiesCount = new Set(pharmaDatabase.map(i => i.company)).size;

    document.getElementById('stat-total-items').innerText = totalQty.toLocaleString() + " عبوة";
    document.getElementById('stat-total-val').innerText = "$" + (totalValue / 1000000).toFixed(2) + " مليون";
    document.getElementById('stat-companies').innerText = companiesCount + " شركة دولية";
}

// Modal Handlers
function openAddModal() { document.getElementById('addModal').classList.remove('hidden'); }
function closeAddModal() { document.getElementById('addModal').classList.add('hidden'); }

function handleAddMedicine(e) {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        name: document.getElementById('m_name').value,
        company: document.getElementById('m_company').value,
        country: "دولية 🌐",
        type: document.getElementById('m_type').value,
        batch: document.getElementById('m_batch').value,
        qty: parseInt(document.getElementById('m_qty').value),
        price: parseFloat(document.getElementById('m_price').value),
        exp: document.getElementById('m_exp').value
    };

    pharmaDatabase.unshift(newItem);
    renderTable();
    renderCompanyCards();
    updateStats();
    updateCharts();
    closeAddModal();
    document.getElementById('addMedicineForm').reset();
}

function deleteItem(id) {
    if(confirm("هل أنت تأكد من إزالة هذا المستحضر الدوائي من المخزون؟")) {
        pharmaDatabase = pharmaDatabase.filter(i => i.id !== id);
        renderTable();
        renderCompanyCards();
        updateStats();
        updateCharts();
    }
}

// Export Database to CSV
function exportCSV() {
    let csv = "ID,Name,Company,Type,Batch,Quantity,Price,ExpiryDate\n";
    pharmaDatabase.forEach(row => {
        csv += `${row.id},"${row.name}","${row.company}","${row.type}","${row.batch}",${row.qty},${row.price},${row.exp}\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Vandetta_Pharma_Inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Chart.js Visualizations
function initCharts() {
    const ctx1 = document.getElementById('stockChart').getContext('2d');
    const ctx2 = document.getElementById('categoryChart').getContext('2d');

    stockChartObj = new Chart(ctx1, {
        type: 'bar',
        data: getStockChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8', font: { family: 'Tajawal' } }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });

    categoryChartObj = new Chart(ctx2, {
        type: 'doughnut',
        data: getCategoryChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { family: 'Tajawal' } } } }
        }
    });
}

function updateCharts() {
    if(!stockChartObj || !categoryChartObj) return;
    stockChartObj.data = getStockChartData();
    stockChartObj.update();
    categoryChartObj.data = getCategoryChartData();
    categoryChartObj.update();
}

function getStockChartData() {
    const companyTotals = {};
    pharmaDatabase.forEach(i => {
        companyTotals[i.company] = (companyTotals[i.company] || 0) + i.qty;
    });

    return {
        labels: Object.keys(companyTotals),
        datasets: [{
            data: Object.values(companyTotals),
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6
        }]
    };
}

function getCategoryChartData() {
    const typeTotals = {};
    pharmaDatabase.forEach(i => {
        typeTotals[i.type] = (typeTotals[i.type] || 0) + i.qty;
    });

    return {
        labels: Object.keys(typeTotals),
        datasets: [{
            data: Object.values(typeTotals),
            backgroundColor: ['#6366f1', '#10b981', '#06b6d4', '#ec4899', '#f59e0b']
        }]
    };
}
