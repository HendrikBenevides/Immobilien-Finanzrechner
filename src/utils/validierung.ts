/**
 * Eingabe-Validierung und Plausibilitätsprüfung
 */

import { BerechnungsInput } from './finanzberechnungen';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validiert alle Eingabeparameter auf Plausibilität
 * 
 * Fehler (❌): Blockieren Berechnung
 * Warnungen (⚠️): Erlauben Berechnung, weisen aber auf Probleme hin
 */
export function validiereEingaben(input: BerechnungsInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // === KRITISCHE FEHLER ===
  
  // Rate muss positiv und realistisch sein
  if (input.rate <= 0) {
    errors.push('❌ Monatliche Rate muss größer als 0€ sein');
  } else if (input.rate < 100) {
    errors.push('❌ Monatliche Rate muss mindestens 100€ betragen');
  } else if (input.rate > 10000) {
    errors.push('❌ Monatliche Rate über 10.000€ ist unrealistisch');
  }
  
  // Zinssatz-Validierung
  if (input.zinssatz <= 0) {
    errors.push('❌ Zinssatz muss größer als 0% sein');
  } else if (input.zinssatz > 15) {
    errors.push('❌ Zinssatz über 15% ist unrealistisch');
  }
  
  // Tilgungssatz-Validierung
  if (input.tilgung <= 0) {
    errors.push('❌ Tilgung muss größer als 0% sein');
  } else if (input.tilgung > 10) {
    errors.push('❌ Tilgung über 10% ist unrealistisch');
  }
  
  // Eigenkapital muss nicht-negativ sein
  if (input.eigenkapital < 0) {
    errors.push('❌ Eigenkapital darf nicht negativ sein');
  }
  
  // Nebenkosten-Validierung
  if (input.maklerProvision < 0 || input.maklerProvision > 10) {
    errors.push('❌ Maklerprovision muss zwischen 0% und 10% liegen');
  }
  if (input.notarKosten < 0 || input.notarKosten > 5) {
    errors.push('❌ Notarkosten müssen zwischen 0% und 5% liegen');
  }
  if (input.grunderwerbSteuer < 0 || input.grunderwerbSteuer > 10) {
    errors.push('❌ Grunderwerbsteuer muss zwischen 0% und 10% liegen');
  }
  
  // === WARNUNGEN ===
  
  // Zins + Tilgung sollte sinnvoll sein
  const gesamtSatz = input.zinssatz + input.tilgung;
  if (gesamtSatz < 2.5) {
    warnings.push('⚠️ Zins + Tilgung unter 2.5% führt zu sehr langer Laufzeit');
  } else if (gesamtSatz > 12) {
    warnings.push('⚠️ Zins + Tilgung über 12% ist sehr hoch');
  }
  
  // Tilgung sollte mindestens 1% sein
  if (input.tilgung < 1) {
    warnings.push('⚠️ Tilgung unter 1% verlängert die Laufzeit erheblich');
  }
  
  // Zinssatz-Plausibilität (Stand 2025)
  if (input.zinssatz < 1.5) {
    warnings.push('⚠️ Zinssatz unter 1.5% ist aktuell unrealistisch niedrig');
  } else if (input.zinssatz > 6) {
    warnings.push('⚠️ Zinssatz über 6% ist sehr hoch');
  }
  
  // Eigenkapital-Empfehlung (wird erst nach Berechnung klar)
  // Wird in separater Funktion geprüft: checkEigenkapitalQuote()
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Prüft Eigenkapitalquote nach Berechnung
 * (Benötigt Kaufpreis, daher separate Funktion)
 */
export function checkEigenkapitalQuote(
  eigenkapital: number,
  kaufpreis: number
): { status: 'optimal' | 'ausreichend' | 'niedrig' | 'kritisch', message: string } {
  const quote = (eigenkapital / kaufpreis) * 100;
  
  if (quote >= 20) {
    return {
      status: 'optimal',
      message: `✅ Eigenkapitalquote ${quote.toFixed(1)}% - Optimal! Beste Konditionen möglich.`
    };
  } else if (quote >= 10) {
    return {
      status: 'ausreichend',
      message: `⚠️ Eigenkapitalquote ${quote.toFixed(1)}% - Ausreichend, aber höheres Eigenkapital verbessert Konditionen.`
    };
  } else if (quote >= 5) {
    return {
      status: 'niedrig',
      message: `⚠️ Eigenkapitalquote ${quote.toFixed(1)}% - Niedrig. Viele Banken verlangen mindestens 10%.`
    };
  } else {
    return {
      status: 'kritisch',
      message: `❌ Eigenkapitalquote ${quote.toFixed(1)}% - Kritisch! Vollfinanzierung ist riskant und teuer.`
    };
  }
}

/**
 * Klassifiziert Beleihungsauslauf (LTV)
 */
export function klassifiziereLTV(ltv: number): { 
  status: 'optimal' | 'gut' | 'hoch' | 'kritisch',
  color: string,
  message: string 
} {
  if (ltv <= 60) {
    return {
      status: 'optimal',
      color: '#10b981', // green-500
      message: 'Hervorragend! Beste Zinskonditionen.'
    };
  } else if (ltv <= 80) {
    return {
      status: 'gut',
      color: '#10b981', // green-500
      message: 'Gut! Standardkonditionen ohne Aufschläge.'
    };
  } else if (ltv <= 90) {
    return {
      status: 'hoch',
      color: '#f59e0b', // amber-500
      message: 'Vorsicht! Eventuell höhere Zinsen.'
    };
  } else {
    return {
      status: 'kritisch',
      color: '#ef4444', // red-500
      message: 'Kritisch! Finanzierung schwierig.'
    };
  }
}
