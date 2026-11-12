let defaultCompanies = [
    { id: "al-madina", name: "Al-Madina Enterprises", vendorType: "AGPR", vendorNo: "30368984", ntn: "2128115-7", stn: "1700212811518", srb: "S1700212811518", phone: "0300-2216873", address: "B-26, 4th Floor Faraz Avenue, Block-20 Gulistan-e-Jauhar, Karachi", accountNo: "1234567890", iban: "PK36MEZN0001234567890", email: "almadina@example.com", cnic: "42101-1234567-1", taxType: "GST", taxRate: 18, allowTaxToggle: true, billsPool: [12489, 12490, 12491], stPool: [6819, 6820, 6821], usedBills: [], usedSt: [] },
    { id: "shaheen", name: "Shaheen Enterprises", vendorType: "AGPR", vendorNo: "40912841", ntn: "3182941-2", stn: "1700318294119", srb: "S1700318294119", phone: "0300-1234567", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", taxType: "SST", taxRate: 15, allowTaxToggle: false, billsPool: [5001, 5002], stPool: [501, 502], usedBills: [], usedSt: [] },
    { id: "hayah", name: "HAYAH ENTERPRISES", vendorType: "AGPR", vendorNo: "51092834", ntn: "4192834-5", stn: "1700419283411", srb: "S1700419283411", phone: "0321-9876543", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", taxType: "SST", taxRate: 15, allowTaxToggle: false, billsPool: [3001, 3002], stPool: [301, 302], usedBills: [], usedSt: [] },
    { id: "comzon", name: "Comzon", vendorType: "AGPR", vendorNo: "61209384", ntn: "5129384-6", stn: "1700512938412", srb: "S1700512938412", phone: "0333-1122334", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", taxType: "GST", taxRate: 18, allowTaxToggle: false, billsPool: [1001, 1002], stPool: [101, 102], usedBills: [], usedSt: [] },
    { id: "al-noor", name: "Al Noor", vendorType: "AGPR", vendorNo: "71829304", ntn: "6182930-7", stn: "1700618293013", srb: "S1700618293013", phone: "0345-5566778", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", taxType: "SST", taxRate: 15, allowTaxToggle: false, billsPool: [2001, 2002], stPool: [201, 202], usedBills: [], usedSt: [] },
    { id: "al-mehran", name: "Al Mehran", vendorType: "AGPR", vendorNo: "81920394", ntn: "7192039-8", stn: "1700719203914", srb: "S1700719203914", phone: "0312-4455667", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", taxType: "SST", taxRate: 15, allowTaxToggle: false, billsPool: [4001, 4002], stPool: [401, 402], usedBills: [], usedSt: [] },
    { id: "rizwan", name: "Rizwan Autoes", vendorType: "AGPR", vendorNo: "91029384", ntn: "8102938-9", stn: "1700810293815", srb: "S1700810293815", phone: "0301-7788990", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", taxType: "SST", taxRate: 15, allowTaxToggle: false, billsPool: [6001, 6002], stPool: [601, 602], usedBills: [], usedSt: [] },
    { id: "asra", name: "Asra Traders", vendorType: "AGPR", vendorNo: "10928374", ntn: "9092837-0", stn: "1700909283716", srb: "S1700909283716", phone: "0302-3344556", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", taxType: "SST", taxRate: 15, allowTaxToggle: false, billsPool: [7001, 7002], stPool: [701, 702], usedBills: [], usedSt: [] }
];

let defaultDepartments = [
    { code: "KA3371", name: "Port Health Establishments Port Bin, Karachi." },
    { code: "GPO", name: "Office of the New Town GPO,\nKarachi." },
    { code: "MOT", name: "Office of the Additional IGP,\nMotorway Police,Karachi." }
];

let companies = JSON.parse(JSON.stringify(defaultCompanies));
let departments = JSON.parse(JSON.stringify(defaultDepartments));
let invoiceHistory = [];

let selectedCompany = companies[0];
let currentQuarter = "1st Qtr";
let items = [
    { desc: "LPG Gas Filled for the Month of September-2026", qty: 17, rate: 520 }
];

async function init() {
    await loadFromCloud();

    populateCompanyDropdowns();
    populateDepartmentDropdown();
    renderDepartmentManager();
    renderCompanyManager();
    renderSerialManager();
    renderHistory();
    renderAll();

    document.getElementById('companySelect').addEventListener('change', (e) => {
        selectedCompany = companies[e.target.value];
        renderAll();
    });

    // Dropdown change hone par filtered serial status table render hoga
    document.getElementById('serialManagerCompSelect').addEventListener('change', () => {
        renderSerialManager();
    });

    document.getElementById('quarterSelect').addEventListener('change', (e) => {
        currentQuarter = e.target.value;
        document.getElementById('activeQuarterBadge').innerText = `${currentQuarter} Active`;
        renderAll();
    });

    document.getElementById('subjectSelect').addEventListener('change', (e) => {
        let val = e.target.value;
        let customInput = document.getElementById('customSubjectInput');
        if(val === 'CUSTOM') {
            customInput.classList.remove('hidden');
        } else {
            customInput.classList.add('hidden');
        }
        renderAll();
    });

    document.getElementById('customSubjectInput').addEventListener('input', renderAll);

    document.getElementById('deptCodeInput').addEventListener('input', (e) => {
        let code = e.target.value.trim().toUpperCase();
        let found = departments.find(d => d.code === code);
        if(found) {
            document.getElementById('deptInput').value = found.name;
            renderAll();
        }
    });

    document.getElementById('deptSelect').addEventListener('change', (e) => {
        if(e.target.value !== "") {
            let dept = departments[e.target.value];
            document.getElementById('deptCodeInput').value = dept.code;
            document.getElementById('deptInput').value = dept.name;
            renderAll();
        }
    });

    document.getElementById('deptInput').addEventListener('input', renderAll);
    document.getElementById('stampGap').addEventListener('input', (e) => {
        document.getElementById('gapVal').innerText = e.target.value;
        document.querySelectorAll('.stamp-space').forEach(el => el.style.height = e.target.value + 'px');
    });

    document.getElementById('excelFile').addEventListener('change', handleExcelUpload);
    document.getElementById('deptExcelFile').addEventListener('change', handleDeptExcelUpload);
    document.getElementById('serialExcelFile').addEventListener('change', handleSerialExcelUpload);
}

// Cloud Database Sync Functions
async function saveToCloud() {
    try {
        await db.collection("portalData").doc("mainStore").set({
            companies: companies,
            departments: departments,
            invoiceHistory: invoiceHistory
        });
    } catch (err) {
        console.error("Cloud save error:", err);
    }
}

async function loadFromCloud() {
    try {
        let doc = await db.collection("portalData").doc("mainStore").get();
        if (doc.exists) {
            let data = doc.data();
            if (data.companies) companies = data.companies;
            if (data.departments) departments = data.departments;
            if (data.invoiceHistory) invoiceHistory = data.invoiceHistory;
            selectedCompany = companies[0];
        } else {
            await saveToCloud();
        }
    } catch (err) {
        console.error("Cloud load error:", err);
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-print'));
    
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    document.getElementById('tab-' + tabId).classList.add('active-print');

    document.querySelectorAll('nav button').forEach(el => el.classList.remove('active-tab'));
    document.getElementById('nav-' + tabId).classList.add('active-tab');

    const printAction = document.getElementById('headerPrintAction');
    if(tabId === 'bill-memo') {
        printAction.classList.remove('hidden');
        printAction.classList.add('flex');
    } else {
        printAction.classList.remove('flex');
        printAction.classList.add('hidden');
    }

    const titles = {
        'dashboard': 'Portal Overview',
        'bill-memo': 'Bill / Cash Memo Generator',
        'delivery-challan': 'Delivery Challan (Work Completion)',
        'sales-tax': 'Sales Tax Invoice',
        'history': 'Billing History Database',
        'serial-manager': 'Invoices & Serial Numbers Pool',
        'departments': 'Department Manager',
        'companies': 'Company Settings'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];
}

function populateCompanyDropdowns() {
    const sel1 = document.getElementById('companySelect');
    const sel2 = document.getElementById('serialManagerCompSelect');
    sel1.innerHTML = '';
    if(sel2) sel2.innerHTML = '';
    companies.forEach((c, idx) => {
        let nextBill = c.billsPool.find(b => !c.usedBills.includes(b)) || 'N/A';
        sel1.innerHTML += `<option value="${idx}">${c.name} (Next Bill #: ${nextBill})</option>`;
        if(sel2) sel2.innerHTML += `<option value="${idx}">${c.name}</option>`;
    });
}

function populateDepartmentDropdown() {
    const sel = document.getElementById('deptSelect');
    sel.innerHTML = '<option value="">Select Saved Department...</option>';
    departments.forEach((d, idx) => {
        sel.innerHTML += `<option value="${idx}">${d.code} - ${d.name.split('\n')[0]}</option>`;
    });
}

async function addDepartment() {
    let code = document.getElementById('newDeptCode').value.trim().toUpperCase();
    let name = document.getElementById('newDeptName').value.trim();
    if(code && name) {
        departments.push({ code, name });
        await saveToCloud();
        populateDepartmentDropdown();
        renderDepartmentManager();
        document.getElementById('newDeptCode').value = '';
        document.getElementById('newDeptName').value = '';
        alert("Department successfully saved to Cloud Database!");
    }
}

// Company filter ke sath purane style mein serials render karne wala function
function renderSerialManager() {
    const tbody = document.getElementById('serialStatusTableBody');
    tbody.innerHTML = '';
    
    const selectedCompIdx = document.getElementById('serialManagerCompSelect').value;

    companies.forEach((c, idx) => {
        // Agar dropdown se specific company select hai, toh baki companies ko skip kar dein
        if (selectedCompIdx !== "" && idx.toString() !== selectedCompIdx) {
            return;
        }

        let billsHtml = c.billsPool.map(b => c.usedBills.includes(b) ? `<span class="text-slate-400 line-through bg-slate-100 px-1.5 py-0.5 rounded m-0.5 inline-block">${b}</span>` : `<span class="font-bold text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded m-0.5 inline-block">${b}</span>`).join(' ');
        let stHtml = c.stPool.map(s => c.usedSt.includes(s) ? `<span class="text-slate-400 line-through bg-slate-100 px-1.5 py-0.5 rounded m-0.5 inline-block">${s}</span>` : `<span class="font-bold text-slate-900 bg-emerald-100 px-1.5 py-0.5 rounded m-0.5 inline-block">${s}</span>`).join(' ');
        
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50">
                <td class="p-3 font-bold">${c.name}</td>
                <td class="p-3">${billsHtml || '<span class="text-slate-400">No pool uploaded</span>'}</td>
                <td class="p-3">${stHtml || '<span class="text-slate-400">No pool uploaded</span>'}</td>
            </tr>
        `;
    });
}

function renderDepartmentManager() {
    const container = document.getElementById('departmentList');
    container.innerHTML = '';
    departments.forEach((d, idx) => {
        container.innerHTML += `
            <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                    <span class="font-bold text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded mr-2">${d.code}</span>
                    <span class="text-xs font-medium text-slate-800">${d.name.replace('\n', ' ')}</span>
                </div>
                <button onclick="removeDepartment(${idx})" class="text-rose-600 font-bold text-xs hover:underline">Remove</button>
            </div>
        `;
    });
}

async function removeDepartment(idx) {
    departments.splice(idx, 1);
    await saveToCloud();
    populateDepartmentDropdown();
    renderDepartmentManager();
}

async function triggerPrintAndSave() {
    const dept = document.getElementById('deptInput').value;
    let nextBill = selectedCompany.billsPool.find(b => !selectedCompany.usedBills.includes(b)) || selectedCompany.billsPool[0] || 1000;
    let nextSt = selectedCompany.stPool.find(s => !selectedCompany.usedSt.includes(s)) || selectedCompany.stPool[0] || 100;

    selectedCompany.usedBills.push(nextBill);
    selectedCompany.usedSt.push(nextSt);

    let subtotal = 0;
    items.forEach(i => subtotal += (i.qty * i.rate));
    let taxAmount = subtotal * (selectedCompany.taxRate / 100);
    let grandTotal = subtotal + taxAmount;

    invoiceHistory.unshift({
        date: new Date().toLocaleDateString('en-GB'),
        quarter: currentQuarter,
        billNo: nextBill,
        stSerial: nextSt,
        company: selectedCompany.name,
        dept: dept.split('\n')[0],
        amount: Math.round(grandTotal)
    });

    await saveToCloud();
    populateCompanyDropdowns();
    renderSerialManager();
    renderHistory();
    renderAll();

    window.print();
}

function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';
    if(invoiceHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-400">No invoice records saved on cloud yet.</td></tr>`;
        return;
    }
    invoiceHistory.forEach(h => {
        tbody.innerHTML += `
            <tr class="hover:bg-amber-50/50">
                <td class="p-3 font-mono">${h.date}</td>
                <td class="p-3 font-bold text-amber-800">${h.quarter}</td>
                <td class="p-3 font-mono font-bold">${h.billNo}</td>
                <td class="p-3 font-mono font-bold">${h.stSerial}</td>
                <td class="p-3">${h.company}</td>
                <td class="p-3">${h.dept}</td>
                <td class="p-3 text-right font-mono font-bold">Rs. ${h.amount.toLocaleString()}</td>
            </tr>
        `;
    });
}

async function clearHistory() {
    if(confirm("Kya aap cloud se saari billing history clear karna chahte hain?")) {
        invoiceHistory = [];
        await saveToCloud();
        renderHistory();
    }
}

function renderAll() {
    const dept = document.getElementById('deptInput').value;
    
    let subVal = document.getElementById('subjectSelect').value;
    let finalSubject = subVal === 'CUSTOM' ? (document.getElementById('customSubjectInput').value || 'CUSTOM') : subVal;
    document.getElementById('memoSubjectDisplay').innerText = finalSubject;

    let nextBill = selectedCompany.billsPool.find(b => !selectedCompany.usedBills.includes(b)) || selectedCompany.billsPool[0] || 1000;
    let nextSt = selectedCompany.stPool.find(s => !selectedCompany.usedSt.includes(s)) || selectedCompany.stPool[0] || 100;

    let subtotal = 0;
    let totalQty = 0;
    items.forEach(i => {
        subtotal += (i.qty * i.rate);
        totalQty += i.qty;
    });

    let taxAmount = subtotal * (selectedCompany.taxRate / 100);
    let grandTotal = subtotal + taxAmount;

    document.getElementById('statSubtotal').innerText = 'Rs. ' + subtotal.toLocaleString();
    document.getElementById('statItems').innerText = totalQty;
    document.getElementById('statGrandTotal').innerText = 'Rs. ' + Math.round(grandTotal).toLocaleString();

    document.getElementById('memoDept').innerText = dept;
    document.getElementById('memoBillNo').innerText = nextBill;
    document.getElementById('memoVendorLabel').innerText = (selectedCompany.vendorType === 'AGPR' ? 'Vender #:' : 'AG Sindh #:');
    document.getElementById('memoVendorNo').innerText = selectedCompany.vendorNo;
    document.getElementById('memoNTN').innerText = selectedCompany.ntn;
    document.getElementById('memoSTN').innerText = selectedCompany.stn;
    document.querySelectorAll('.memoCompName').forEach(el => el.innerText = selectedCompany.name);

    document.getElementById('memoTaxLabel').innerText = `${selectedCompany.taxRate}% ${selectedCompany.taxType}`;
    document.getElementById('memoSubtotal').innerText = subtotal.toLocaleString();
    document.getElementById('memoTaxTotal').innerText = Math.round(taxAmount).toLocaleString();
    document.getElementById('memoGrandTotal').innerText = Math.round(grandTotal).toLocaleString();

    const memoBody = document.getElementById('memoTableBody');
    memoBody.innerHTML = '';
    items.forEach((item, idx) => {
        memoBody.innerHTML += `
            <tr class="border-b border-dashed border-slate-300">
                <td class="py-1 px-2 text-center border-x border-black font-mono">${idx + 1}</td>
                <td class="py-1 px-3 border-x border-black">${item.desc}</td>
                <td class="py-1 px-2 text-center border-x border-black">${item.qty}</td>
                <td class="py-1 px-2 text-right border-x border-black">${item.rate.toLocaleString()}</td>
                <td class="py-1 px-2 text-right border-x border-black font-mono">${(item.qty * item.rate).toLocaleString()}</td>
            </tr>
        `;
    });

    document.getElementById('challanDept').innerText = dept;
    const challanBody = document.getElementById('challanTableBody');
    challanBody.innerHTML = '';
    items.forEach((item, idx) => {
        challanBody.innerHTML += `
            <tr class="border-b border-black">
                <td class="py-3 px-2 text-center border-r border-black font-bold">${idx + 1}</td>
                <td class="py-3 px-4 border-r border-black">${item.desc}</td>
                <td class="py-3 px-3 text-center font-bold">${item.qty}</td>
            </tr>
        `;
    });

    document.getElementById('stSerial').innerText = nextSt;
    document.getElementById('stDate').innerText = new Date().toLocaleDateString('en-GB');
    document.getElementById('stSupplierAddr').innerText = selectedCompany.address;
    document.getElementById('stSupplierPhone').innerText = selectedCompany.phone;
    document.getElementById('stSupplierSTN').innerText = selectedCompany.stn;
    document.getElementById('stBuyerName').innerText = dept;

    const mainTitle = document.getElementById('stMainTitle');
    const thExcl = document.getElementById('thColExcl');
    const thRate = document.getElementById('thColRate');
    const thTax = document.getElementById('thColTax');
    const thIncl = document.getElementById('thColIncl');

    if(selectedCompany.taxType === 'SST') {
        mainTitle.innerText = `${selectedCompany.taxRate}% SINDH SALES TAX INVOICE`;
        thExcl.innerText = `Value Excluding Sindh Sales Tax`;
        thRate.innerText = `Rate of Sindh Sales Tax`;
        thTax.innerText = `Total Sindh Sales Tax Payable`;
        thIncl.innerText = `Value including Sindh Sales Tax`;
    } else {
        mainTitle.innerText = `${selectedCompany.taxRate}% SALES TAX INVOICE`;
        thExcl.innerText = `Value Excl.`;
        thRate.innerText = `Rate`;
        thTax.innerText = `Total Sales Tax`;
        thIncl.innerText = `Value Incl.`;
    }

    const stBody = document.getElementById('stTableBody');
    stBody.innerHTML = '';
    items.forEach((item) => {
        let amt = item.qty * item.rate;
        let tax = amt * (selectedCompany.taxRate / 100);
        let incl = amt + tax;
        stBody.innerHTML += `
            <tr class="border-b border-black text-center">
                <td class="p-1 border-r border-black font-bold">${item.qty}</td>
                <td class="p-1 border-r border-black text-left">${item.desc}</td>
                <td class="p-1 border-r border-black">${item.rate}</td>
                <td class="p-1 border-r border-black font-mono">${amt.toLocaleString()}</td>
                <td class="p-1 border-r border-black font-mono">${amt.toLocaleString()}</td>
                <td class="p-1 border-r border-black font-bold">${selectedCompany.taxRate}%</td>
                <td class="p-1 border-r border-black font-mono">${Math.round(tax).toLocaleString()}</td>
                <td class="p-1 font-mono font-bold">${Math.round(incl).toLocaleString()}</td>
            </tr>
        `;
    });
}

function renderCompanyManager() {
    const container = document.getElementById('companyList');
    container.innerHTML = '';
    companies.forEach((c, idx) => {
        container.innerHTML += `
            <div class="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                    <h4 class="font-bold text-base text-slate-900">${c.name}</h4>
                    <span class="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">Managed via Invoices & Serials Tab</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Vendor Type</label>
                        <select onchange="updateCompVendor(${idx}, this.value)" class="w-full border border-slate-300 rounded-lg p-1.5 font-bold bg-white">
                            <option value="AGPR" ${c.vendorType === 'AGPR' ? 'selected' : ''}>AGPR Number</option>
                            <option value="AG Sindh" ${c.vendorType === 'AG Sindh' ? 'selected' : ''}>AG Sindh Number</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Vendor / AG #</label>
                        <input type="text" value="${c.vendorNo}" oninput="updateCompField(${idx}, 'vendorNo', this.value)" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">NTN #</label>
                        <input type="text" value="${c.ntn}" oninput="updateCompField(${idx}, 'ntn', this.value)" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">STN / Sale Tax #</label>
                        <input type="text" value="${c.stn}" oninput="updateCompField(${idx}, 'stn', this.value)" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                </div>
            </div>
        `;
    });
}

async function updateCompVendor(idx, val) {
    companies[idx].vendorType = val;
    await saveToCloud();
    renderAll();
}

async function updateCompField(idx, field, val) {
    companies[idx][field] = val;
    await saveToCloud();
    renderAll();
}

window.onload = init;
