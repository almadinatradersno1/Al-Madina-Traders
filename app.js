let defaultCompanies = [
    { id: "al-madina", name: "Al-Madina Enterprises", vendorType: "AGPR", vendorNo: "30368984", ntn: "2128115-7", stn: "1700212811518", srb: "S1700212811518", phone: "0300-2216873", address: "B-26, 4th Floor Faraz Avenue, Block-20 Gulistan-e-Jauhar, Karachi", accountNo: "1234567890", iban: "PK36MEZN0001234567890", email: "almadina@example.com", cnic: "42101-1234567-1", billSeq: 12489, taxType: "GST", taxRate: 18, allowTaxToggle: true },
    { id: "shaheen", name: "Shaheen Enterprises", vendorType: "AGPR", vendorNo: "40912841", ntn: "3182941-2", stn: "1700318294119", srb: "S1700318294119", phone: "0300-1234567", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", billSeq: 5001, taxType: "SST", taxRate: 15, allowTaxToggle: false },
    { id: "hayah", name: "HAYAH ENTERPRISES", vendorType: "AGPR", vendorNo: "51092834", ntn: "4192834-5", stn: "1700419283411", srb: "S1700419283411", phone: "0321-9876543", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", billSeq: 3001, taxType: "SST", taxRate: 15, allowTaxToggle: false },
    { id: "comzon", name: "Comzon", vendorType: "AGPR", vendorNo: "61209384", ntn: "5129384-6", stn: "1700512938412", srb: "S1700512938412", phone: "0333-1122334", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", billSeq: 1001, taxType: "GST", taxRate: 18, allowTaxToggle: false },
    { id: "al-noor", name: "Al Noor", vendorType: "AGPR", vendorNo: "71829304", ntn: "6182930-7", stn: "1700618293013", srb: "S1700618293013", phone: "0345-5566778", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", billSeq: 2001, taxType: "SST", taxRate: 15, allowTaxToggle: false },
    { id: "al-mehran", name: "Al Mehran", vendorType: "AGPR", vendorNo: "81920394", ntn: "7192039-8", stn: "1700719203914", srb: "S1700719203914", phone: "0312-4455667", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", billSeq: 4001, taxType: "SST", taxRate: 15, allowTaxToggle: false },
    { id: "rizwan", name: "Rizwan Autoes", vendorType: "AGPR", vendorNo: "91029384", ntn: "8102938-9", stn: "1700810293815", srb: "S1700810293815", phone: "0301-7788990", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", billSeq: 6001, taxType: "SST", taxRate: 15, allowTaxToggle: false },
    { id: "asra", name: "Asra Traders", vendorType: "AGPR", vendorNo: "10928374", ntn: "9092837-0", stn: "1700909283716", srb: "S1700909283716", phone: "0302-3344556", address: "Karachi", accountNo: "", iban: "", email: "", cnic: "", billSeq: 7001, taxType: "SST", taxRate: 15, allowTaxToggle: false }
];

let defaultDepartments = [
    { code: "KA3371", name: "Port Health Establishments Port Bin, Karachi." },
    { code: "GPO", name: "Office of the New Town GPO,\nKarachi." },
    { code: "MOT", name: "Office of the Additional IGP,\nMotorway Police,Karachi." }
];

// Persistent Local Storage Loaders
let companies = JSON.parse(localStorage.getItem('portal_companies')) || defaultCompanies;
let departments = JSON.parse(localStorage.getItem('portal_departments')) || defaultDepartments;
let invoiceHistory = JSON.parse(localStorage.getItem('portal_history')) || [];

let selectedCompany = companies[0];
let currentQuarter = "1st Qtr";
let items = [
    { desc: "LPG Gas Filled for the Month of September-2026", qty: 17, rate: 520 }
];

function init() {
    populateCompanyDropdowns();
    populateDepartmentDropdown();
    renderDepartmentManager();
    renderCompanyManager();
    renderHistory();
    renderAll();

    document.getElementById('companySelect').addEventListener('change', (e) => {
        selectedCompany = companies[e.target.value];
        renderAll();
    });

    document.getElementById('quarterSelect').addEventListener('change', (e) => {
        currentQuarter = e.target.value;
        document.getElementById('activeQuarterBadge').innerText = `${currentQuarter} Active`;
        renderAll();
    });

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
}

function saveDepartmentsToStorage() {
    localStorage.setItem('portal_departments', JSON.stringify(departments));
}

function saveCompaniesToStorage() {
    localStorage.setItem('portal_companies', JSON.stringify(companies));
}

function saveHistoryToStorage() {
    localStorage.setItem('portal_history', JSON.stringify(invoiceHistory));
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-print'));
    
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    document.getElementById('tab-' + tabId).classList.add('active-print');

    document.querySelectorAll('nav button').forEach(el => el.classList.remove('active-tab'));
    document.getElementById('nav-' + tabId).classList.add('active-tab');

    const titles = {
        'dashboard': 'Portal Overview',
        'bill-memo': 'Bill / Cash Memo Generator',
        'delivery-challan': 'Delivery Challan (Work Completion)',
        'sales-tax': 'Sales Tax Invoice',
        'history': 'Billing History Database',
        'departments': 'Department Manager',
        'companies': 'Company Settings'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];
}

function populateCompanyDropdowns() {
    const sel1 = document.getElementById('companySelect');
    sel1.innerHTML = '';
    companies.forEach((c, idx) => {
        sel1.innerHTML += `<option value="${idx}">${c.name} (Next Bill #: ${c.billSeq})</option>`;
    });
}

function populateDepartmentDropdown() {
    const sel = document.getElementById('deptSelect');
    sel.innerHTML = '<option value="">Select Saved Department...</option>';
    departments.forEach((d, idx) => {
        sel.innerHTML += `<option value="${idx}">${d.code} - ${d.name.split('\n')[0]}</option>`;
    });
}

function addDepartment() {
    let code = document.getElementById('newDeptCode').value.trim().toUpperCase();
    let name = document.getElementById('newDeptName').value.trim();
    if(code && name) {
        departments.push({ code, name });
        saveDepartmentsToStorage();
        populateDepartmentDropdown();
        renderDepartmentManager();
        document.getElementById('newDeptCode').value = '';
        document.getElementById('newDeptName').value = '';
        alert("Department successfully saved permanently!");
    }
}

function handleDeptExcelUpload(e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1});

        let count = 0;
        for(let i = 0; i < json.length; i++) {
            let row = json[i];
            if(row.length >= 2 && row[0] && row[1]) {
                let code = String(row[0]).trim().toUpperCase();
                let name = String(row[1]).trim();
                if(!departments.some(d => d.code === code)) {
                    departments.push({ code, name });
                    count++;
                }
            }
        }
        saveDepartmentsToStorage();
        populateDepartmentDropdown();
        renderDepartmentManager();
        alert(`${count} new departments permanently imported into system!`);
    };
    reader.readAsArrayBuffer(file);
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
                <button onclick="departments.splice(${idx},1); saveDepartmentsToStorage(); populateDepartmentDropdown(); renderDepartmentManager();" class="text-rose-600 font-bold text-xs hover:underline">Remove</button>
            </div>
        `;
    });
}

function triggerPrintAndSave() {
    const dept = document.getElementById('deptInput').value;
    let subtotal = 0;
    items.forEach(i => subtotal += (i.qty * i.rate));
    let taxAmount = subtotal * (selectedCompany.taxRate / 100);
    let grandTotal = subtotal + taxAmount;

    // Save Record
    invoiceHistory.unshift({
        date: new Date().toLocaleDateString('en-GB'),
        quarter: currentQuarter,
        billNo: selectedCompany.billSeq,
        company: selectedCompany.name,
        dept: dept.split('\n')[0],
        amount: Math.round(grandTotal)
    });

    // Auto Increment Bill Sequence
    selectedCompany.billSeq++;
    saveCompaniesToStorage();
    saveHistoryToStorage();
    populateCompanyDropdowns();
    renderHistory();
    renderAll();

    // Trigger Print Window
    window.print();
}

function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';
    if(invoiceHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">No invoice records saved yet.</td></tr>`;
        return;
    }
    invoiceHistory.forEach(h => {
        tbody.innerHTML += `
            <tr class="hover:bg-amber-50/50">
                <td class="p-3 font-mono">${h.date}</td>
                <td class="p-3 font-bold text-amber-800">${h.quarter}</td>
                <td class="p-3 font-mono font-bold">${h.billNo}</td>
                <td class="p-3">${h.company}</td>
                <td class="p-3">${h.dept}</td>
                <td class="p-3 text-right font-mono font-bold">Rs. ${h.amount.toLocaleString()}</td>
            </tr>
        `;
    });
}

function clearHistory() {
    if(confirm("Kya aap saari billing history clear karna chahte hain?")) {
        invoiceHistory = [];
        saveHistoryToStorage();
        renderHistory();
    }
}

function renderAll() {
    const dept = document.getElementById('deptInput').value;
    let subtotal = 0;
    let totalQty = 0;

    items.forEach(i => {
        subtotal += (i.qty * i.rate);
        totalQty += i.qty;
    });

    let taxAmount = subtotal * (selectedCompany.taxRate / 100);
    let grandTotal = subtotal + taxAmount;

    // Dashboard Stats
    document.getElementById('statSubtotal').innerText = 'Rs. ' + subtotal.toLocaleString();
    document.getElementById('statItems').innerText = totalQty;
    document.getElementById('statGrandTotal').innerText = 'Rs. ' + Math.round(grandTotal).toLocaleString();

    // Bill Memo Updates
    document.getElementById('memoDept').innerText = dept;
    document.getElementById('memoBillNo').innerText = selectedCompany.billSeq;
    document.getElementById('memoVendorLabel').innerText = (selectedCompany.vendorType === 'AGPR' ? 'Vender #:' : 'AG Sindh #:');
    document.getElementById('memoVendorNo').innerText = selectedCompany.vendorNo;
    document.getElementById('memoNTN').innerText = selectedCompany.ntn;
    document.getElementById('memoSTN').innerText = selectedCompany.stn;
    document.querySelectorAll('.memoCompName').forEach(el => el.innerText = selectedCompany.name);

    document.getElementById('memoTaxLabel').innerText = `${selectedCompany.taxRate}% ${selectedCompany.taxType}`;
    document.getElementById('memoSubtotal').innerText = subtotal.toLocaleString();
    document.getElementById('memoTaxTotal').innerText = Math.round(taxAmount).toLocaleString();
    document.getElementById('memoGrandTotal').innerText = Math.round(grandTotal).toLocaleString();

    // Memo Table
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

    // Challan Updates
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

    // Sales Tax Invoice Dynamic Adaptation
    document.getElementById('stSerial').innerText = selectedCompany.billSeq;
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

function handleExcelUpload(e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1});

        let parsed = [];
        for(let i = 0; i < json.length; i++) {
            let row = json[i];
            if(row.length >= 3 && row[0] && !isNaN(parseFloat(row[1])) && !isNaN(parseFloat(row[2]))) {
                parsed.push({ desc: String(row[0]), qty: parseFloat(row[1]), rate: parseFloat(row[2]) });
            }
        }

        if(parsed.length > 0) {
            items = parsed;
            renderAll();
            alert("Excel invoice items loaded successfully!");
        } else {
            alert("Formatting error. Make sure columns are Description, Quantity, Rate.");
        }
    };
    reader.readAsArrayBuffer(file);
}

function renderCompanyManager() {
    const container = document.getElementById('companyList');
    container.innerHTML = '';
    companies.forEach((c, idx) => {
        container.innerHTML += `
            <div class="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div class="flex flex-wrap justify-between items-center border-b pb-2">
                    <h4 class="font-bold text-base text-slate-900">${c.name}</h4>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-600">Next Bill #:</span>
                        <input type="number" value="${c.billSeq}" onchange="companies[${idx}].billSeq = parseInt(this.value); saveCompaniesToStorage(); populateCompanyDropdowns(); renderAll();" class="w-24 border border-slate-300 rounded-lg p-1 text-xs text-center font-bold bg-white">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Vendor Type</label>
                        <select onchange="companies[${idx}].vendorType = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 font-bold bg-white">
                            <option value="AGPR" ${c.vendorType === 'AGPR' ? 'selected' : ''}>AGPR Number</option>
                            <option value="AG Sindh" ${c.vendorType === 'AG Sindh' ? 'selected' : ''}>AG Sindh Number</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Vendor / AG #</label>
                        <input type="text" value="${c.vendorNo}" oninput="companies[${idx}].vendorNo = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">NTN #</label>
                        <input type="text" value="${c.ntn}" oninput="companies[${idx}].ntn = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">STN / Sale Tax #</label>
                        <input type="text" value="${c.stn}" oninput="companies[${idx}].stn = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">SRB #</label>
                        <input type="text" value="${c.srb}" oninput="companies[${idx}].srb = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Mobile #</label>
                        <input type="text" value="${c.phone}" oninput="companies[${idx}].phone = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Tax Rule & Rate</label>
                        ${c.allowTaxToggle ? `
                            <select onchange="companies[${idx}].taxType = this.value; companies[${idx}].taxRate = (this.value==='GST'?18:15); saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 font-bold bg-white text-orange-600">
                                <option value="GST" ${c.taxType === 'GST' ? 'selected' : ''}>18% GST (Sales Tax)</option>
                                <option value="SST" ${c.taxType === 'SST' ? 'selected' : ''}>15% SST (Services)</option>
                            </select>
                        ` : `
                            <input type="text" disabled value="${c.taxRate}% ${c.taxType} (Fixed)" class="w-full border border-slate-200 rounded-lg p-1.5 bg-slate-100 font-bold text-slate-500">
                        `}
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Email Address</label>
                        <input type="text" value="${c.email}" oninput="companies[${idx}].email = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs border-t pt-3">
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">Account #</label>
                        <input type="text" value="${c.accountNo}" oninput="companies[${idx}].accountNo = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">IBAN #</label>
                        <input type="text" value="${c.iban}" oninput="companies[${idx}].iban = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-600 mb-1">CNIC #</label>
                        <input type="text" value="${c.cnic}" oninput="companies[${idx}].cnic = this.value; saveCompaniesToStorage(); renderAll();" class="w-full border border-slate-300 rounded-lg p-1.5 bg-white">
                    </div>
                </div>
            </div>
        `;
    });
}

window.onload = init;
