function setAllVolumes() {

    const choice = document.getElementById("size_choice").value;

    const elec = document.getElementById("slider_elec_vol");
    const gas = document.getElementById("slider_gas_vol");
    const maint = document.getElementById("slider_maint_cost");
    const prod = document.getElementById("slider_prod_vol");

    if (choice === "small") {
        elec.value = 2000000;
        gas.value = 375000;
        maint.value = 250000;
        prod.value = 50000;
    }
    else if (choice === "medium") {
        elec.value = 9008000;
        gas.value = 1204000;
        maint.value = 899000;
        prod.value = 150000;
    }
    else if (choice === "large") {
        elec.value = 25000000;
        gas.value = 3000000;
        maint.value = 3500000;
        prod.value = 400000;
    }

    // bestaande labels updaten
    updateLabel('elec_vol', 'kWh', 0);
    updateLabel('gas_vol', 'm³', 0);
    updateLabel('maint_cost', '€', 0);
    updateLabel('prod_vol', 'ton', 0);
}