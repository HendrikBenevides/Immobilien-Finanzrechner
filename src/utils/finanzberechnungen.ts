/**
 * Kern-Berechnungslogik für Immobilienfinanzierung
 * Basiert auf Annuitätenformel nach deutschem Finanzierungsstandard
 */

export interface BerechnungsInput {
  rate: number;              // Monatliche Rate in €
  zinssatz: number;          // Jahreszins in %
  tilgung: number;           // Anfangstilgung in %
  eigenkapital: number;      // In €
  maklerProvision: number;   // In %
  notarKosten: number;       // In %
  grunderwerbSteuer: number; // In %
}

export interface Nebenkosten {
  makler: number;
  notar: number;
  grunderwerbsteuer: number;
  gesamt: number;
}

export interface SzenarioErgebnis {
  rate: number;
  darlehenssumme: number;
  eigenkapital: number;
  kaufpreis: number;
  nebenkosten: Nebenkosten;
  gesamtkostenErwerb: number;  // Kaufpreis + Nebenkosten
  beleihungsauslauf: number;   // LTV (Loan-to-Value) in %
  laufzeitJahre: number;
  gesamtaufwand: number;       // Summe aller Raten
  zinskostenGesamt: number;    // Gesamtaufwand - Darlehenssumme
  effektiverZins: number;      // Inkl. Nebenkosten-Amortisation
}

/**
 * Berechnet ein komplettes Finanzierungsszenario
 * 
 * Formeln:
 * 1. Darlehenssumme: D = (R × 12) / (Zins + Tilgung) × 100
 * 2. Kaufpreis: KP = D + Eigenkapital
 * 3. Nebenkosten: NK = KP × (Makler% + Notar% + Grunderwerbsteuer%)
 * 4. Laufzeit: n = ln(R / (R - D × i)) / ln(1 + i)  [i = Monatszins]
 * 5. Gesamtaufwand: GA = R × n
 * 6. Zinskosten: Z = GA - D
 * 7. Effektiver Zins: eff = (Z + NK) / D / Laufzeit_Jahre × 100
 */
export function berechneSzenario(input: BerechnungsInput): SzenarioErgebnis {
  const { rate, zinssatz, tilgung, eigenkapital, maklerProvision, notarKosten, grunderwerbSteuer } = input;
  
  // 1. DARLEHENSSUMME (vereinfachte Annuitätenformel)
  // Bei konstanter monatlicher Rate ergibt sich die Darlehenssumme aus:
  // Rate = Darlehenssumme × (Zinssatz + Tilgung) / 1200
  const darlehenssumme = (rate * 12) / (zinssatz + tilgung) * 100;
  
  // 2. KAUFPREIS (maximal finanzierbarer Immobilienwert)
  const kaufpreis = darlehenssumme + eigenkapital;
  
  // 3. NEBENKOSTEN (vom Kaufpreis berechnet)
  const makler = kaufpreis * (maklerProvision / 100);
  const notar = kaufpreis * (notarKosten / 100);
  const grunderwerbsteuer = kaufpreis * (grunderwerbSteuer / 100);
  const nebenkostenGesamt = makler + notar + grunderwerbsteuer;
  
  // 4. GESAMTKOSTEN ERWERB
  const gesamtkostenErwerb = kaufpreis + nebenkostenGesamt;
  
  // 5. BELEIHUNGSAUSLAUF (Loan-to-Value Ratio)
  // Wichtige Kennzahl für Banken: <80% = optimal, >90% = kritisch
  const beleihungsauslauf = (darlehenssumme / kaufpreis) * 100;
  
  // 6. LAUFZEIT (präzise Berechnung mit logarithmischer Annuitätenformel)
  const monatszins = zinssatz / 12 / 100;
  
  let laufzeitMonate: number;
  if (monatszins === 0) {
    // Sonderfall: Zinssatz = 0% (theoretisch)
    laufzeitMonate = darlehenssumme / rate;
  } else {
    // Standardformel: n = ln(R / (R - D × i)) / ln(1 + i)
    const zaehler = rate;
    const nenner = rate - (darlehenssumme * monatszins);
    
    if (nenner <= 0) {
      // Rate reicht nicht für Zinszahlung (unmögliche Finanzierung)
      laufzeitMonate = Infinity;
    } else {
      laufzeitMonate = Math.log(zaehler / nenner) / Math.log(1 + monatszins);
    }
  }
  
  const laufzeitJahre = laufzeitMonate / 12;
  
  // 7. GESAMTAUFWAND & ZINSKOSTEN
  const gesamtaufwand = rate * laufzeitMonate;
  const zinskostenGesamt = gesamtaufwand - darlehenssumme;
  
  // 8. EFFEKTIVER ZINS (inkl. Nebenkosten-Berücksichtigung)
  // Realistischere Gesamtkosten-Betrachtung
  const effektiverZins = laufzeitJahre > 0 
    ? ((zinskostenGesamt + nebenkostenGesamt) / darlehenssumme / laufzeitJahre) * 100
    : 0;
  
  return {
    rate,
    darlehenssumme: Math.round(darlehenssumme),
    eigenkapital,
    kaufpreis: Math.round(kaufpreis),
    nebenkosten: {
      makler: Math.round(makler),
      notar: Math.round(notar),
      grunderwerbsteuer: Math.round(grunderwerbsteuer),
      gesamt: Math.round(nebenkostenGesamt)
    },
    gesamtkostenErwerb: Math.round(gesamtkostenErwerb),
    beleihungsauslauf: Math.round(beleihungsauslauf * 10) / 10,
    laufzeitJahre: Math.round(laufzeitJahre * 10) / 10,
    gesamtaufwand: Math.round(gesamtaufwand),
    zinskostenGesamt: Math.round(zinskostenGesamt),
    effektiverZins: Math.round(effektiverZins * 100) / 100
  };
}

/**
 * Generiert Szenarien für einen kompletten Raten-Range
 * 
 * @param rateStart - Niedrigste monatliche Rate (z.B. 500€)
 * @param rateEnd - Höchste monatliche Rate (z.B. 2500€)
 * @param schrittweite - Abstufung zwischen Raten (z.B. 50€)
 * @param basisInput - Alle anderen Parameter (Zinssatz, Tilgung, etc.)
 * @returns Array mit allen berechneten Szenarien
 */
export function generiereAlleKombinationen(
  rateStart: number,
  rateEnd: number,
  schrittweite: number,
  basisInput: Omit<BerechnungsInput, 'rate'>
): SzenarioErgebnis[] {
  const szenarien: SzenarioErgebnis[] = [];
  
  for (let rate = rateStart; rate <= rateEnd; rate += schrittweite) {
    szenarien.push(berechneSzenario({ ...basisInput, rate }));
  }
  
  return szenarien;
}

/**
 * Findet das optimale Szenario basierend auf Beleihungsauslauf
 * (Ziel: LTV < 80% für beste Konditionen)
 */
export function findeOptimalesSzenario(szenarien: SzenarioErgebnis[]): SzenarioErgebnis | null {
  const optimale = szenarien.filter(s => s.beleihungsauslauf <= 80);
  
  if (optimale.length === 0) return null;
  
  // Höchste Rate mit LTV ≤ 80% → maximaler Kaufpreis bei guten Konditionen
  return optimale[optimale.length - 1];
}
