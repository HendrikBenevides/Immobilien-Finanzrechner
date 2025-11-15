/**
 * PDF-Export mit jsPDF und html2canvas
 * Erstellt mehrseitigen professionellen Finanzierungsbericht
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BerechnungsInput, SzenarioErgebnis } from './finanzberechnungen';
import { formatCurrency, formatPercent, formatDate, formatYears } from './formatierung';

/**
 * Generiert vollständigen PDF-Report
 */
export async function exportierePDF(
  eingaben: BerechnungsInput,
  szenarien: SzenarioErgebnis[],
  bundesland: string
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210; // A4 Breite in mm
  const pageHeight = 297; // A4 Höhe in mm
  const margin = 20;
  
  // === SEITE 1: DECKBLATT ===
  await generateDeckblatt(pdf, eingaben, bundesland, margin, pageWidth);
  
  // === SEITE 2: TABELLE ===
  pdf.addPage();
  await generateTabellenSeite(pdf, szenarien, margin, pageWidth);
  
  // === SEITE 3: CHARTS ===
  pdf.addPage();
  await generateChartSeite(pdf, margin, pageWidth);
  
  // === SEITE 4: EMPFEHLUNGEN ===
  pdf.addPage();
  generateEmpfehlungen(pdf, szenarien, eingaben, margin, pageWidth, pageHeight);
  
  // Download
  const filename = `Finanzierungsuebersicht_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}

/**
 * SEITE 1: Professionelles Deckblatt
 */
async function generateDeckblatt(
  pdf: jsPDF, 
  eingaben: BerechnungsInput, 
  bundesland: string, 
  margin: number, 
  pageWidth: number
): Promise<void> {
  let yPos = 40;
  
  // Titel
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMMOBILIENFINANZIERUNGS-', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  pdf.text('ÜBERSICHT', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;
  
  // Untertitel
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Ihr professioneller Finanzierungsberater', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 30;
  
  // Datum
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Erstellt am: ${formatDate(new Date())}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 30;
  
  // Trennlinie
  pdf.setDrawColor(16, 185, 129); // primary-500
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 20;
  
  // Parameter-Box
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Ihre Finanzierungsannahmen:', margin, yPos);
  
  yPos += 12;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const parameters = [
    `• Zinssatz: ${formatPercent(eingaben.zinssatz)} p.a.`,
    `• Tilgung: ${formatPercent(eingaben.tilgung)} p.a.`,
    `• Eigenkapital: ${formatCurrency(eingaben.eigenkapital)}`,
    `• Standort: ${bundesland}`,
    `  → Grunderwerbsteuer: ${formatPercent(eingaben.grunderwerbSteuer)}`,
    `• Maklerprovision: ${formatPercent(eingaben.maklerProvision)}`,
    `• Notarkosten: ${formatPercent(eingaben.notarKosten)}`
  ];
  
  parameters.forEach(param => {
    pdf.text(param, margin + 5, yPos);
    yPos += 8;
  });
  
  yPos += 20;
  
  // Hinweis-Box
  pdf.setDrawColor(59, 130, 246); // blue-500
  pdf.setFillColor(239, 246, 255); // blue-50
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'FD');
  
  pdf.setFontSize(10);
  pdf.setTextColor(30, 58, 138); // blue-900
  yPos += 8;
  pdf.text('ℹ️  WICHTIGER HINWEIS', margin + 5, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Diese Übersicht dient ausschließlich zur Orientierung. Die tatsächlichen', margin + 5, yPos);
  yPos += 5;
  pdf.text('Konditionen können je nach Bank und individueller Bonität abweichen.', margin + 5, yPos);
  yPos += 5;
  pdf.text('Für verbindliche Angebote konsultieren Sie bitte einen Finanzberater.', margin + 5, yPos);
}

/**
 * SEITE 2: Szenario-Tabelle als Screenshot
 */
async function generateTabellenSeite(
  pdf: jsPDF,
  szenarien: SzenarioErgebnis[],
  margin: number,
  pageWidth: number
): Promise<void> {
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Szenario-Vergleichstabelle', margin, 20);
  
  const tabelleElement = document.getElementById('finanzierungstabelle');
  
  if (tabelleElement) {
    try {
      const canvas = await html2canvas(tabelleElement, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, 30, imgWidth, Math.min(imgHeight, 250));
    } catch (error) {
      console.error('Fehler beim Erstellen des Tabellen-Screenshots:', error);
      pdf.setFontSize(10);
      pdf.text('⚠️ Tabelle konnte nicht exportiert werden.', margin, 40);
    }
  } else {
    pdf.setFontSize(10);
    pdf.text('⚠️ Tabelle nicht verfügbar.', margin, 40);
  }
}

/**
 * SEITE 3: Visualisierungen
 */
async function generateChartSeite(
  pdf: jsPDF,
  margin: number,
  pageWidth: number
): Promise<void> {
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Visualisierungen', margin, 20);
  
  let yPos = 30;
  
  // Chart 1: Kaufpreis-Spielraum
  const chart1Element = document.getElementById('chart-kaufpreis');
  if (chart1Element) {
    try {
      const canvas1 = await html2canvas(chart1Element, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData1 = canvas1.toDataURL('image/png');
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas1.height * imgWidth) / canvas1.width;
      
      pdf.addImage(imgData1, 'PNG', margin, yPos, imgWidth, Math.min(imgHeight, 110));
      yPos += Math.min(imgHeight, 110) + 10;
    } catch (error) {
      console.error('Fehler beim Chart 1:', error);
    }
  }
  
  // Chart 2: Kostenstruktur
  const chart2Element = document.getElementById('chart-kostenstruktur');
  if (chart2Element) {
    try {
      const canvas2 = await html2canvas(chart2Element, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData2 = canvas2.toDataURL('image/png');
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas2.height * imgWidth) / canvas2.width;
      
      pdf.addImage(imgData2, 'PNG', margin, yPos, imgWidth, Math.min(imgHeight, 110));
    } catch (error) {
      console.error('Fehler beim Chart 2:', error);
    }
  }
}

/**
 * SEITE 4: Empfehlungen und Tipps
 */
function generateEmpfehlungen(
  pdf: jsPDF,
  szenarien: SzenarioErgebnis[],
  eingaben: BerechnungsInput,
  margin: number,
  pageWidth: number,
  pageHeight: number
): void {
  let yPos = 20;
  
  // Titel
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hinweise zur Interpretation', margin, yPos);
  
  yPos += 15;
  
  // LTV-Klassifizierung
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(16, 185, 129); // green-500
  pdf.text('✓ OPTIMAL (LTV <80%):', margin, yPos);
  yPos += 6;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Beste Konditionen, niedriges Ausfallrisiko für Bank', margin + 5, yPos);
  yPos += 5;
  pdf.text('→ Szenarien mit grünem Beleihungsauslauf priorisieren', margin + 5, yPos);
  
  yPos += 10;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(245, 158, 11); // amber-500
  pdf.text('⚠️ VORSICHT (LTV 80-90%):', margin, yPos);
  yPos += 6;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Eventuell höhere Zinsen, Zusatzsicherheiten nötig', margin + 5, yPos);
  
  yPos += 10;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(239, 68, 68); // red-500
  pdf.text('❌ KRITISCH (LTV >90%):', margin, yPos);
  yPos += 6;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Schwierige Finanzierung, hohes Risiko', margin + 5, yPos);
  
  yPos += 15;
  
  // Spar-Tipps
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246); // blue-500
  pdf.text('💡 SPAR-TIPPS:', margin, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  const tipps = [
    '• Höhere Tilgung → kürzere Laufzeit → weniger Zinsen',
    '• Eigenkapital >20% → bessere Konditionen',
    '• Nebenkosten sofort verfügbar halten (nicht finanzierbar)',
    '• Sondertilgungsrechte aushandeln (Flexibilität)',
    '• Mehrere Bankangebote vergleichen (bis zu 1% Zinsunterschied)'
  ];
  
  tipps.forEach(tipp => {
    pdf.text(tipp, margin + 5, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Nächste Schritte
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(16, 185, 129); // green-500
  pdf.text('📞 NÄCHSTE SCHRITTE:', margin, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  const schritte = [
    '1. Passende Rate auswählen (finanzielle Belastbarkeit prüfen)',
    '2. Bank-Vergleich mit LTV-optimiertem Szenario',
    '3. Objektsuche im kalkulierten Preisrahmen',
    '4. Finanzierungsbestätigung von Bank einholen',
    '5. Kaufvertrag mit Finanzierungsvorbehalt'
  ];
  
  schritte.forEach(schritt => {
    pdf.text(schritt, margin + 5, yPos);
    yPos += 6;
  });
  
  yPos += 15;
  
  // Optimales Szenario hervorheben
  const optimaleSzenarien = szenarien.filter(s => s.beleihungsauslauf <= 80);
  if (optimaleSzenarien.length > 0) {
    const bestes = optimaleSzenarien[optimaleSzenarien.length - 1];
    
    pdf.setDrawColor(16, 185, 129);
    pdf.setFillColor(240, 253, 244); // green-50
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'FD');
    
    yPos += 8;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(6, 95, 70); // green-800
    pdf.text('⭐ IHR OPTIMALES SZENARIO:', margin + 5, yPos);
    yPos += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Rate: ${formatCurrency(bestes.rate)}/Monat → Kaufpreis: ${formatCurrency(bestes.kaufpreis)}`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Eigenkapital: ${formatCurrency(bestes.eigenkapital)} (${((bestes.eigenkapital/bestes.kaufpreis)*100).toFixed(1)}%)`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Beleihungsauslauf: ${bestes.beleihungsauslauf}% | Laufzeit: ${formatYears(bestes.laufzeitJahre)}`, margin + 5, yPos);
  }
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('© 2025 Immobilienfinanzierungs-Rechner | Hendrik Benevides KI Beratung', pageWidth / 2, pageHeight - 10, { align: 'center' });
}
