function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Colours
    const accentColor = [0, 102, 204];   // blauw
    const lightGray = [240, 240, 240];   // achtergrond

    // Header bar
    doc.setFillColor(...accentColor);
    doc.rect(14, 5, 182, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Inzicht in Energie- en Onderhoudsbesparingen", 105, 13, { align: "center" });
    // Reset colour
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let y = 30;

    // Section: Customer data
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text("Ingevoerde gegevens", 14, y);
    y += 4;

    // Line under the headline
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.2);
    doc.line(14, y, 196, y);
    y += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    function addSection(title, values) {
    // Subsection title with light background
    doc.setFillColor(...lightGray);
    doc.rect(14, y - 4, 182, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.text(title, 16, y + 2);
    y += 8;

    doc.setFont("helvetica", "normal");
    values.forEach(([label, val]) => {
        // Check if this is a total line → then draw the addition line
        const isTotaal =
            label.toLowerCase().includes("totaal elektriciteit") ||
            label.toLowerCase().includes("totaal gas") ||
            label.toLowerCase().includes("totaal besparingspotentieel");

        if (isTotaal) {
            // Addition line above the line
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.2);
            doc.line(160, y - 4, 196, y - 4); // Addition line above amount
            doc.setFont("helvetica", "bold");
        } else {
            doc.setFont("helvetica", "normal");
        }

        doc.text(label, 18, y);
        doc.text(val, 192, y, { align: "right" });
        y += 6;
    });

    doc.setDrawColor(...accentColor)
    y += 4;
}

    // ======= Customer entered data =======
    addSection("Elektriciteit", [
        ["Totaal volume (kWh)", document.getElementById("param_elec_vol").textContent],
        ["Factuur Elektriciteit", document.getElementById("param_elec_inv").textContent],
        ["Factuur Transport", document.getElementById("param_elec_tr").textContent],
        ["Totaal Elektriciteit", document.getElementById("elec_total").textContent]
    ]);

    addSection("Gas", [
        ["Totaal volume (m³)", document.getElementById("param_gas_vol").textContent],
        ["Factuur Gas", document.getElementById("param_gas_inv").textContent],
        ["Factuur Transport", document.getElementById("param_gas_tr").textContent],
        ["Totaal Gas", document.getElementById("gas_total").textContent]
    ]);

    addSection("Onderhoud", [
        ["Onderhoudskosten", document.getElementById("param_maint_cost").textContent]
    ]);

    addSection("Productievolume", [
        ["Totaal volume (t)", document.getElementById("param_prod_vol").textContent]
    ]);

    const param_elec = document.getElementById("param_elec").textContent;
    const param_gas =  document.getElementById("param_gas").textContent;
    const param_maint = document.getElementById("param_maint").textContent;

    addSection("Ingestelde besparingsparameters", [
        ["Elektriciteit", param_elec],
        ["Gas", param_gas],
        ["Onderhoud", param_maint]
    ]);


    // ======= Savings results =======
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text("Besparingsresultaten", 14, y);
    y += 4;
    doc.setLineWidth(0.2);
    doc.line(14, y, 196, y);
    y += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    addSection("Besparingspotentieel", [
        ["Besparing onderhoud", document.getElementById("maint_save").textContent],
        ["Besparing gas", document.getElementById("gas_save").textContent],
        ["Besparing elektriciteit", document.getElementById("elec_save").textContent],
        ["Totaal besparingspotentieel", document.getElementById("grand_total").textContent]
    ]);

    // ======= KPI comparison =======
    y += 6;
    const col1X = 14;
    const col2X = 115;

    const kpiOud = [
        ["Onderhoudskosten / ton", document.getElementById("maint_now").textContent],
        ["Gas / ton", document.getElementById("gas_now").textContent],
        ["Electra / ton", document.getElementById("elec_now").textContent],
        ["Totaal Energie / ton", document.getElementById("energy_now").textContent],
        ["m³ gas / ton ", document.getElementById("m3_now").textContent],
        ["kWh / ton ", document.getElementById("kwh_now").textContent]
    ];

    const kpiNieuw = [
        ["Onderhoudskosten / ton", document.getElementById("maint_new").textContent],
        ["Gas / ton", document.getElementById("gas_new").textContent],
        ["Electra / ton", document.getElementById("elec_new").textContent],
        ["Totaal Energie / ton", document.getElementById("energy_new").textContent],
        ["m³ gas / ton ", document.getElementById("m3_new").textContent],
        ["kWh / ton ", document.getElementById("kwh_new").textContent]
    ];

    // Column titles
    doc.setFont("helvetica", "bold");
    doc.text("Huidige KPI's", col1X, y);
    doc.text("Nieuwe KPI's", col2X, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    for (let i = 0; i < 6; i++) {
        doc.text(kpiOud[i][0], col1X, y);
        doc.text(kpiOud[i][1], col1X + 80, y, { align: "right" });

        doc.text(kpiNieuw[i][0], col2X, y);
        doc.text(kpiNieuw[i][1], col2X + 80, y, { align: "right" });

        y += 6;
    }

    // Footer
    y += 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Besparingsrapport – " + new Date().toLocaleDateString("nl-NL"), 105, y, { align: "center" });
    doc.text("(c) van Mourik Group", 14, y, { align: "left" });
    doc.text("pagina 1", 192, y, { align: "right" });

    doc.save("Energie_Kosten_Rapport.pdf");
}
