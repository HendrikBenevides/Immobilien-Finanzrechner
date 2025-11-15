/**
 * Interaktive Datentabelle mit Sortierung und Highlighting
 */

import { useState } from 'react';
import { SzenarioErgebnis } from '../utils/finanzberechnungen';
import { formatCurrency, formatPercent, formatYears } from '../utils/formatierung';
import { klassifiziereLTV } from '../utils/validierung';

interface FinanzierungsTabelleProps {
  szenarien: SzenarioErgebnis[];
}

type SortKey = keyof SzenarioErgebnis;
type SortDirection = 'asc' | 'desc';

export default function FinanzierungsTabelle({ szenarien }: FinanzierungsTabelleProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedSzenarien = [...szenarien].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    // Handle nested objects (nebenkosten)
    const aVal = typeof aValue === 'object' ? (aValue as any).gesamt : aValue;
    const bVal = typeof bValue === 'object' ? (bValue as any).gesamt : bValue;
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-500">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Detaillierte Szenario-Übersicht
        </h2>
        <p className="text-primary-100 text-sm mt-1">
          Klicken Sie auf Spaltenüberschriften zum Sortieren
        </p>
      </div>

      <div className="overflow-x-auto" id="finanzierungstabelle">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortableHeader 
                label="Rate" 
                sortKey="rate" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <SortableHeader 
                label="Darlehen" 
                sortKey="darlehenssumme" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <SortableHeader 
                label="Eigenkapital" 
                sortKey="eigenkapital" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <SortableHeader 
                label="Kaufpreis" 
                sortKey="kaufpreis" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                Nebenkosten
              </th>
              <SortableHeader 
                label="Gesamtkosten" 
                sortKey="gesamtkostenErwerb" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <SortableHeader 
                label="LTV (%)" 
                sortKey="beleihungsauslauf" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <SortableHeader 
                label="Laufzeit" 
                sortKey="laufzeitJahre" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <SortableHeader 
                label="Gesamtaufwand" 
                sortKey="gesamtaufwand" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
              <SortableHeader 
                label="Zinskosten" 
                sortKey="zinskostenGesamt" 
                currentKey={sortKey} 
                direction={sortDirection} 
                onSort={handleSort} 
              />
            </tr>
          </thead>
          <tbody>
            {sortedSzenarien.map((szenario, idx) => {
              const ltvClass = klassifiziereLTV(szenario.beleihungsauslauf);
              
              return (
                <tr 
                  key={idx} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrency(szenario.rate)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatCurrency(szenario.darlehenssumme)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatCurrency(szenario.eigenkapital)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">
                    {formatCurrency(szenario.kaufpreis)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatCurrency(szenario.nebenkosten.gesamt)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatCurrency(szenario.gesamtkostenErwerb)}
                  </td>
                  <td 
                    className="px-4 py-3 font-bold whitespace-nowrap"
                    style={{ color: ltvClass.color }}
                  >
                    {formatPercent(szenario.beleihungsauslauf, 1)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatYears(szenario.laufzeitJahre)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatCurrency(szenario.gesamtaufwand)}
                  </td>
                  <td className="px-4 py-3 text-red-600 whitespace-nowrap">
                    {formatCurrency(szenario.zinskostenGesamt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legende */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">LTV-Bewertung (Beleihungsauslauf):</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-600">≤ 80%: Optimal (beste Konditionen)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-gray-600">80-90%: Vorsicht (höhere Zinsen möglich)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-600">> 90%: Kritisch (schwierige Finanzierung)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sortierbare Spaltenüberschrift
interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}

function SortableHeader({ label, sortKey, currentKey, direction, onSort }: SortableHeaderProps) {
  const isActive = sortKey === currentKey;
  
  return (
    <th 
      onClick={() => onSort(sortKey)}
      className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap select-none"
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isActive ? 'text-primary-600' : 'text-gray-400'} ${
            isActive && direction === 'desc' ? 'rotate-180' : ''
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </div>
    </th>
  );
}
