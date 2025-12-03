// Convert a number to a Euro string
function euroBedrag(getal, decimals = 2) {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(getal);
}

// Convert a number to a measure string
function formatMeasure(getal, eenheid = 'kWh', decimals = 2) {
    const formatted = new Intl.NumberFormat('nl-NL', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(getal);

    return `${formatted} ${eenheid}`;
}

function parseTonumber(str) {
    if (!str) return 0;

    // Remove all non-numbers, periods, commas, and minus signs
    let clean = str.replace(/[^\d.,-]/g, '');

    // NL thousands: '.' → remove
    clean = clean.replace(/\./g, '');

    // NL decimal point: ',' → '.'
    clean = clean.replace(',', '.');

    return parseFloat(clean);
}

function updateLabel(param, unitMeasure) {
    const slider = document.getElementById('slider_' + param);
    const label = document.getElementById('param_' + param);
    if (unitMeasure === "€")
        {label.textContent = euroBedrag(slider.value, 0)}
    else
        {label.textContent = formatMeasure(slider.value, unitMeasure, 0)}
    recalc()
}

function recalc(){

    // Electricity block
    const elec_vol = parseTonumber(document.getElementById("param_elec_vol").textContent);
    const elec_inv = parseTonumber(document.getElementById("param_elec_inv").textContent);
    const elec_tr  = parseTonumber(document.getElementById("param_elec_tr").textContent);
    const elec_total = document.getElementById("elec_total");
    elec_total.textContent = euroBedrag(parseFloat(elec_inv) + parseFloat(elec_tr), 0);
    
    // Gas block
    const gas_vol = parseTonumber(document.getElementById("param_gas_vol").textContent);
    const gas_inv = parseTonumber(document.getElementById("param_gas_inv").textContent);
    const gas_tr  = parseTonumber(document.getElementById("param_gas_tr").textContent);
    const gas_total = document.getElementById("gas_total");
    gas_total.textContent = euroBedrag(parseFloat(gas_inv) + parseFloat(gas_tr), 0);

    // Maintenance block
    const maint_cost  = parseTonumber(document.getElementById("param_maint_cost").textContent);
    const maint_total = document.getElementById("maint_total");
    maint_total.textContent = euroBedrag((maint_cost), 0);

    // Production volume block
    const prod_vol  = parseTonumber(document.getElementById("param_prod_vol").textContent);
    const prod_total = document.getElementById("prod_total");
    const prod_volume = prod_vol
    prod_total.textContent = formatMeasure(prod_volume, 'ton', 0);

    // Current KPI block
    const maint_now  = document.getElementById("maint_now");
    const maint_now_ton = maint_cost / prod_vol;
    maint_now.textContent = euroBedrag(maint_now_ton, 2);

    const gas_now  = document.getElementById("gas_now");
    const gas_now_ton = (gas_inv + gas_tr) / prod_vol;
    gas_now.textContent = euroBedrag(gas_now_ton, 2);

    const elec_now  = document.getElementById("elec_now");
    const elec_now_ton = (elec_inv + elec_tr) / prod_vol;
    elec_now.textContent = euroBedrag(elec_now_ton, 2);
    
    const energy_now  = document.getElementById("energy_now");
    const energy_now_ton = gas_now_ton + elec_now_ton
    energy_now.textContent = euroBedrag(energy_now_ton, 2);

    const m3_now  = document.getElementById("m3_now");
    const m3_now_ton = gas_vol / prod_vol;
    m3_now.textContent = formatMeasure(m3_now_ton, 'm³', 2);

    const kwh_now  = document.getElementById("kwh_now");
    const kwh_now_ton = elec_vol / prod_vol;
    kwh_now.textContent = formatMeasure(kwh_now_ton, 'kWh', 2)

    const kwhx10_now  = document.getElementById("kwhx10_now");
    const kwhx_now_ton = kwh_now_ton /10;
    kwhx10_now.textContent = formatMeasure(kwhx_now_ton, 'kWh', 2)

    // New KPI block
    const maint_new  = document.getElementById("maint_new");
    const param_maint = parseTonumber(document.getElementById("param_maint").textContent);
    const maint_new_ton = maint_now_ton * ((100-param_maint)/100);
    maint_new.textContent = euroBedrag(maint_new_ton, 2);

    const gas_new  = document.getElementById("gas_new");
    const param_gas = parseTonumber(document.getElementById("param_gas").textContent);
    const gas_new_ton = gas_now_ton * ((100-param_gas)/100);
    gas_new.textContent = euroBedrag(gas_new_ton, 2);

    const elec_new  = document.getElementById("elec_new");
    const param_elec = parseTonumber(document.getElementById("param_elec").textContent);
    const elec_new_ton = elec_now_ton * ((100-param_elec)/100);
    elec_new.textContent = euroBedrag(elec_new_ton, 2);

    const energy_new  = document.getElementById("energy_new");
    energy_new.textContent = euroBedrag(elec_new_ton + gas_new_ton, 2);

    const m3_new  = document.getElementById("m3_new");
    const m3_new_ton = m3_now_ton * ((100-param_gas)/100);
    m3_new.textContent = formatMeasure(m3_new_ton, 'm³', 2);

    const kwh_new  = document.getElementById("kwh_new");
    const kwh_new_ton = kwh_now_ton * ((100-param_elec)/100);
    kwh_new.textContent = formatMeasure(kwh_new_ton, 'kWh', 2)

    const kwhx10_new  = document.getElementById("kwhx10_new");
    const kwhx_new_ton = kwhx_now_ton * ((100-param_elec)/100)
    kwhx10_new.textContent = formatMeasure(kwhx_new_ton, 'kWh', 2)

    // Savings block (round to 0 decimals)
    const maint_save  = document.getElementById("maint_save");
    const maint_save_euro = (maint_now_ton - maint_new_ton) * prod_volume;
    maint_save.textContent = euroBedrag(maint_save_euro, 0);

    const gas_save  = document.getElementById("gas_save");
    const gas_save_euro = (gas_now_ton - gas_new_ton) * prod_volume;
    gas_save.textContent = euroBedrag(gas_save_euro, 0);

    const elec_save  = document.getElementById("elec_save");
    const elec_save_euro = (elec_now_ton - elec_new_ton) * prod_volume;
    elec_save.textContent = euroBedrag(elec_save_euro, 0);

    const energy_save  = document.getElementById("energy_save");
    const energy_save_euro = gas_save_euro + elec_save_euro;
    energy_save.textContent = euroBedrag(energy_save_euro, 0);

    const m3_save  = document.getElementById("m3_save");
    const m3_save_m3 = (m3_now_ton - m3_new_ton) * prod_volume;
    m3_save.textContent = formatMeasure(m3_save_m3, 'm³', 0);

    const kwh_save  = document.getElementById("kwh_save");
    const kwh_save_kwh = (kwh_now_ton - kwh_new_ton) * prod_volume;
    kwh_save.textContent = formatMeasure(kwh_save_kwh, 'kWh', 0)

    const kwhx10_save  = document.getElementById("kwhx10_save");
    const kwhx_save_kwh = (kwhx_now_ton - kwhx_new_ton) * prod_volume;
    kwhx10_save.textContent = formatMeasure(kwhx_save_kwh, 'kWh', 0)

    // total savings potential (rounded to 0 decimal places)
    const grand_total  = document.getElementById("grand_total");
    const tot_save_euro = energy_save_euro + maint_save_euro;
    grand_total.textContent = euroBedrag(tot_save_euro, 0);

    // drawGauge total savings
    drawGauge(tot_save_euro,'savingGauge');

    // drawGauge electric savings
    const elect_total  = document.getElementById("elect_total");
    elect_total.textContent = euroBedrag(elec_save_euro, 0);
    drawGauge(elec_save_euro,'electricGauge')

    // drawGauge gas savings
    const gast_total  = document.getElementById("gast_total");
    gast_total.textContent = euroBedrag(gas_save_euro, 0);
    drawGauge(gas_save_euro,'gasGauge');

    // drawGauge maintenance savings
    const maintt_total  = document.getElementById("maintt_total");
    maintt_total.textContent = euroBedrag(maint_save_euro, 0);
    drawGauge(maint_save_euro,'maintGauge');
}
    
function drawGauge(value, graphType) {
    const canvas = document.getElementById(graphType);
    const ctx = canvas.getContext('2d');
    const maxSaving = 2000000; 

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height - 20; // iets omhoog gehaald voor ruimte
    const radius = Math.min(width / 2 - 20, height - 40);

    ctx.clearRect(0, 0, width, height);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#ddd';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    //ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Filled arch
    let valuePercent = Math.min(value / maxSaving, 1);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#00c853');
    gradient.addColorStop(1, '#b2ff59');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + valuePercent * Math.PI, false);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Needle
    const angle = Math.PI + valuePercent * Math.PI;
    const needleLength = radius - 10;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + needleLength * Math.cos(angle), centerY + needleLength * Math.sin(angle));
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'red';
    ctx.shadowColor = 'rgba(255,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Needle ball
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

recalc();
