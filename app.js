// Pre-loaded Company Profiles & Tax Rules
let companies = [
    { name: "Al-Madina Enterprises", vendorNo: "30368984", ntn: "2128115-7", stn: "1700212811518", phone: "0300-2216873", address: "B-26, 4th Floor Faraz Avenue, Block-20 Gulistan-e-Jauhar, Karachi", billSeq: 12489, taxType: "GST", taxRate: 18 },
    { name: "Shaheen Enterprises", vendorNo: "40912841", ntn: "3182941-2", stn: "1700318294119", phone: "0300-1234567", address: "Karachi", billSeq: 5001, taxType: "GST", taxRate: 18 },
    { name: "HAYAH ENTERPRISES", vendorNo: "51092834", ntn: "4192834-5", stn: "1700419283411", phone: "0321-9876543", address: "Karachi", billSeq: 3001, taxType: "SST", taxRate: 15 },
    { name: "Comzon", vendorNo: "61209384", ntn: "5129384-6", stn: "1700512938412", phone: "0333-1122334", address: "Karachi", billSeq: 1001, taxType: "GST", taxRate: 18 },
    { name: "Al Noor", vendorNo: "71829304", ntn: "6182930-7", stn: "1700618293013", phone: "0345-5566778", address: "Karachi", billSeq: 2001, taxType: "GST", taxRate: 18 },
    { name: "Al Mehran", vendorNo: "81920394", ntn: "7192039-8", stn: "1700719203914", phone: "0312-4455667", address: "Karachi", billSeq: 4001, taxType: "GST", taxRate: 18 },
    { name: "Rizwan Autoes", vendorNo: "91029384", ntn: "8102938-9", stn: "1700810293815", phone: "0301-7788990", address: "Karachi", billSeq: 6001, taxType: "SST", taxRate: 15 },
    { name: "Asra Traders", vendorNo: "10928374", ntn: "9092837-0", stn: "1700909283716", phone: "0302-3344556", address: "Karachi", billSeq: 7001, taxType: "GST", taxRate: 18 }
];

let selectedCompany = companies[0];
let items = [
    { desc: "LPG Gas Filled for the Month of September-2026", qty: 17, rate: 520 }
];

let activeTab = "dashboard";

function init() {
    populateCompanySelect();
    renderCompanyManager();
    renderAll();

    // Event Listeners
    document.getElementById('companySelect').addEventListener('change', (e) => {
        selectedCompany = companies[e.target.value];
        renderAll();
    });

    document.getElementById('deptInput').addEventListener('input', renderAll);
    document.getElementById('stampGap').addEventListener('input', (e) => {
        document.getElementById('gapVal').innerText = e.target.value;
        document.querySelectorAll('.stamp-space').forEach(el => el.style.height = e.target.value + 'px');
    });

    // Excel Reader
    document.getElementById('excelFile').addEventListener('change', handleExcelUpload);
}

function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-print'));
    
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    document.getElementById('tab-' + tabId).classList.add('active-print');

    document.querySelectorAll('nav button').forEach(el => el.classList.remove('active-tab'));
    document.getElementById('nav-' + tabId).classList.add('active-tab');

    const titles = {
        'dashboard': 'Portal Overview',
        'bill-memo': 'Bill / Cash Memo',
        'delivery-challan': 'Delivery Challan (Work Completion)',
        'sales-tax': 'Sales Tax Invoice',
        'companies': 'Company Settings'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];
}

function populateCompanySelect() {
    const sel = document.getElementById('companySelect');
    sel.innerHTML = '';
    companies.forEach((c, idx) => {
        sel.innerHTML += `<option value="${idx}">${c.name}</option>`;
    });
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

    // Sales Tax Updates
    document.getElementById('stSerial').innerText = selectedCompany.billSeq;
    document.getElementById('stDate').innerText = new Date().toLocaleDateString('en-GB');
    document.getElementById('stSupplierAddr').innerText = selectedCompany.address;
    document.getElementById('stSupplierPhone').innerText = selectedCompany.phone;
    document.getElementById('stSupplierSTN').innerText = selectedCompany.stn;
    document.getElementById('stBuyerName').innerText = dept;

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
            alert("Excel data read successfully!");
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
            <div class="flex flex-wrap items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-2">
                <div>
                    <h4 class="font-bold text-sm text-slate-800">${c.name}</h4>
                    <p class="text-xs text-slate-500">NTN: ${c.ntn} | Tax: ${c.taxRate}% ${c.taxType}</p>
                </div>
                <div class="flex items-center gap-3">
                    <label class="text-xs font-bold text-slate-600">Next Bill #:</label>
                    <input type="number" value="${c.billSeq}" onchange="companies[${idx}].billSeq = parseInt(this.value); renderAll();" class="w-24 border border-slate-300 rounded-lg p-1 text-xs text-center font-bold">
                </div>
            </div>
        `;
    });
}

// Initialize application
window.onload = init;
