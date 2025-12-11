function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Colours
    const accentColor = [0, 102, 204];   // Blue
    const lightGray = [240, 240, 240];   // Background

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
        ["Jaar volume (kWh)", document.getElementById("param_elec_vol").textContent],
        ["Elektriciteit tarief (€/kWh)", document.getElementById("param_elec_inv").textContent],
        ["Totaal Elektriciteit", document.getElementById("elec_total").textContent]
    ]);

    addSection("Gas", [
        ["Jaar volume (m³)", document.getElementById("param_gas_vol").textContent],
        ["Gas tarief (€/m³)", document.getElementById("param_gas_inv").textContent],
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
        ["Besparing gas", document.getElementById("gast_total").textContent],
        ["Besparing elektriciteit", document.getElementById("elect_total").textContent],
        ["Totaal besparingspotentieel", document.getElementById("grand_total").textContent]
    ]);

    // ======= KPI comparison =======
    y += 6;
    const col1X = 14;
    const col2X = 115;

    const kpiOud = [
        ["Onderhoudskosten per ton", document.getElementById("maint_now").textContent],
        ["Energie kosten per ton", document.getElementById("energy_now").textContent],
        ["Gas verbuik (m³/ton) ", document.getElementById("m3_now").textContent],
        ["Electriciteit verbruik (kWh/ton) ", document.getElementById("kwh_now").textContent]
    ];

    const kpiNieuw = [
        ["Onderhoudskosten per ton", document.getElementById("maint_new").textContent],
        ["Energiekosten per ton", document.getElementById("energy_new").textContent],
        ["Gas verbruik (m³/ton) ", document.getElementById("m3_new").textContent],
        ["lectriciteit verbruik (kWh/ton) ", document.getElementById("kwh_new").textContent]
    ];

    // Column titles
    doc.setFont("helvetica", "bold");
    doc.text("Huidige kosten & verbruik", col1X, y);
    doc.text("Nieuwe kosten & verbruik", col2X, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    for (let i = 0; i < 4; i++) {
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

    doc.save("Besparing_Rapport.pdf");
}
