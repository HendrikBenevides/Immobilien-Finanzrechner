/**
 * Gestapeltes Balkendiagramm: Kostenstruktur-Aufschlüsselung
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SzenarioErgebnis } from '../utils/finanzberechnungen';
import { formatCurrency } from '../utils/formatierung';

interface ChartKostenstrukturProps {
  szenarien: SzenarioErgebnis[];
}

export default function ChartKostenstruktur({ szenarien }: ChartKostenstrukturProps) {
  // Bereite Daten für Recharts vor
  const chartData = szenarien.map(s => ({
    rate: s.rate,
    eigenkapital: s.eigenkapital,
    darlehenssumme: s.darlehenssumme,
    nebenkosten: s.nebenkosten.gesamt,
    rateFormatted: `${s.rate}€`
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const gesamt = data.eigenkapital + data.darlehenssumme + data.nebenkosten;
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">
            Rate: {formatCurrency(data.rate)}/Monat
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600">
              Eigenkapital: {formatCurrency(data.eigenkapital)} 
              <span className="text-gray-500 ml-1">
                ({((data.eigenkapital / gesamt) * 100).toFixed(1)}%)
              </span>
            </p>
            <p className="text-blue-600">
              Darlehen: {formatCurrency(data.darlehenssumme)}
              <span className="text-gray-500 ml-1">
                ({((data.darlehenssumme / gesamt) * 100).toFixed(1)}%)
              </span>
            </p>
            <p className="text-amber-600">
              Nebenkosten: {formatCurrency(data.nebenkosten)}
              <span className="text-gray-500 ml-1">
                ({((data.nebenkosten / gesamt) * 100).toFixed(1)}%)
              </span>
            </p>
            <p className="font-semibold text-gray-800 pt-1 border-t border-gray-200">
              Gesamt: {formatCurrency(gesamt)}
            </p>
          </div>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Kostenstruktur-Aufschlüsselung
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Zeigt die Zusammensetzung der Gesamtkosten nach Eigenkapital, Darlehen und Nebenkosten
        </p>
      </div>

      <div id="chart-kostenstruktur" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
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
            <Bar 
              dataKey="eigenkapital" 
              stackId="a" 
              fill="#10b981" 
              name="Eigenkapital"
            />
            <Bar 
              dataKey="darlehenssumme" 
              stackId="a" 
              fill="#3b82f6" 
              name="Darlehen"
            />
            <Bar 
              dataKey="nebenkosten" 
              stackId="a" 
              fill="#f59e0b" 
              name="Nebenkosten"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-800 flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Tipp:</strong> Achten Sie auf einen hohen Eigenkapital-Anteil (grün). 
            Je höher dieser ist, desto bessere Konditionen erhalten Sie von der Bank.
          </span>
        </p>
      </div>
    </div>
  );
}
