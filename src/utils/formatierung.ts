/**
 * Formatierungs-Utilities für deutsches Zahlenformat
 */

/**
 * Formatiert Währungsbeträge im deutschen Format
 * Beispiel: 250000 → "250.000,00 €"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formatiert Währungsbeträge mit exakten Cent-Angaben
 * Beispiel: 250000.50 → "250.000,50 €"
 */
export function formatCurrencyExact(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formatiert Prozentwerte
 * Beispiel: 3.5 → "3,50 %"
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value) + ' %';
}

/**
 * Formatiert Jahreszahlen
 * Beispiel: 23.456 → "23,5 Jahre"
 */
export function formatYears(value: number): string {
  if (value === Infinity) return '∞ Jahre (nicht finanzierbar)';
  
  return new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value) + ' Jahre';
}

/**
 * Formatiert große Zahlen ohne Währungssymbol
 * Beispiel: 250000 → "250.000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formatiert Datum im deutschen Format
 * Beispiel: new Date() → "15. Januar 2025"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Kompakte Währungsformatierung für Charts
 * Beispiel: 250000 → "250k €"
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k €`;
  } else {
    return `${value.toFixed(0)} €`;
  }
}

/**
 * Truncate lange Strings für Tabellen
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}
