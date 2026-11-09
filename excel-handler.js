// Excel Bulk Import and Export Module

function handleExcelUpload(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let workbook = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
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

async function handleDeptExcelUpload(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = async function(e) {
        let workbook = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
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
        await saveToCloud();
        populateDepartmentDropdown();
        renderDepartmentManager();
        alert(`${count} new departments imported to Cloud Database!`);
    };
    reader.readAsArrayBuffer(file);
}

async function handleSerialExcelUpload(e) {
    let file = e.target.files[0];
    if (!file) return;
    let compIdx = document.getElementById('serialManagerCompSelect').value;
    let comp = companies[compIdx];

    let reader = new FileReader();
    reader.onload = async function(e) {
        let workbook = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
        let json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1});
        
        let newBills = [];
        let newSt = [];
        for(let i = 0; i < json.length; i++) {
            let row = json[i];
            if(row[0] && !isNaN(row[0])) newBills.push(parseInt(row[0]));
            if(row[1] && !isNaN(row[1])) newSt.push(parseInt(row[1]));
        }

        if(newBills.length > 0) comp.billsPool = newBills;
        if(newSt.length > 0) comp.stPool = newSt;
        await saveToCloud();
        populateCompanyDropdowns();
        renderSerialManager();
        renderAll();
        alert(`Bill and Serial numbers pool updated on Cloud for ${comp.name}!`);
    };
    reader.readAsArrayBuffer(file);
}

function exportHistoryToExcel() {
    if(invoiceHistory.length === 0) {
        alert("Export karne ke liye koi history record mojood nahi hai!");
        return;
    }
    let dataToExport = invoiceHistory.map(h => ({
        "Date": h.date,
        "Quarter": h.quarter,
        "Bill #": h.billNo,
        "ST Serial #": h.stSerial,
        "Company Name": h.company,
        "Department": h.dept,
        "Total Amount (Rs.)": h.amount
    }));

    let worksheet = XLSX.utils.json_to_sheet(dataToExport);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Billing History");
    XLSX.writeFile(workbook, "Billing_History_Report.xlsx");
}
