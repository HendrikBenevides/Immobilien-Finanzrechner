/**
 * Liniendiagramm: Kaufpreis-Spielraum nach monatlicher Rate
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SzenarioErgebnis } from '../utils/finanzberechnungen';
import { formatCurrency } from '../utils/formatierung';

interface ChartKaufpreisSpielraumProps {
  szenarien: SzenarioErgebnis[];
}

export default function ChartKaufpreisSpielraum({ szenarien }: ChartKaufpreisSpielraumProps) {
  // Bereite Daten für Recharts vor
  const chartData = szenarien.map(s => ({
    rate: s.rate,
    kaufpreis: s.kaufpreis,
    gesamtkostenErwerb: s.gesamtkostenErwerb,
    rateFormatted: `${s.rate}€`
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">
            Rate: {formatCurrency(payload[0].payload.rate)}/Monat
          </p>
          <p className="text-sm text-green-600">
            Kaufpreis: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-amber-600">
            Gesamtkosten: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Differenz (Nebenkosten): {formatCurrency(payload[1].value - payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Kaufpreis-Spielraum nach monatlicher Rate
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Zeigt, welcher Kaufpreis bei verschiedenen monatlichen Raten finanzierbar ist
        </p>
      </div>

      <div id="chart-kaufpreis" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="rate" 
              label={{ value: 'Monatliche Rate (€)', position: 'insideBottom', offset: -5 }}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}€`}
            />
            <YAxis 
              label={{ value: 'Betrag (€)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="kaufpreis" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Kaufpreis"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="gesamtkostenErwerb" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Gesamtkosten (inkl. Nebenkosten)"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Interpretation:</strong> Die grüne Linie zeigt den reinen Kaufpreis. 
            Die gestrichelte orangene Linie inkludiert zusätzlich alle Nebenkosten (Makler, Notar, Grunderwerbsteuer).
          </span>
        </p>
      </div>
    </div>
  );
}
