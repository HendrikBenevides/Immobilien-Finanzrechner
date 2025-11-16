/**
 * Haupt-App-Komponente mit State-Management
 */

import { useState, useRef } from 'react';
import Header from './components/Header';
import EingabeFormular from './components/EingabeFormular';
import FinanzierungsTabelle from './components/FinanzierungsTabelle';
import ChartKaufpreisSpielraum from './components/ChartKaufpreisSpielraum';
import ChartKostenstruktur from './components/ChartKostenstruktur';
import PDFExportButton from './components/PDFExportButton';
import { BerechnungsInput, SzenarioErgebnis, generiereAlleKombinationen } from './utils/finanzberechnungen';
import { checkEigenkapitalQuote } from './utils/validierung';

function App() {
  const [szenarien, setSzenarien] = useState<SzenarioErgebnis[] | null>(null);
  const [eingaben, setEingaben] = useState<BerechnungsInput | null>(null);
  const [bundesland, setBundesland] = useState<string>('');
  const [schrittweite] = useState<number>(50);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (input: BerechnungsInput, bundeslandName: string) => {
    // Generiere Szenarien für Raten-Range 500€ - 2500€
    const generierte = generiereAlleKombinationen(500, 2500, schrittweite, {
      zinssatz: input.zinssatz,
      tilgung: input.tilgung,
      eigenkapital: input.eigenkapital,
      maklerProvision: input.maklerProvision,
      notarKosten: input.notarKosten,
      grunderwerbSteuer: input.grunderwerbSteuer
    });

    setSzenarien(generierte);
    setEingaben(input);
    setBundesland(bundeslandName);

    // Scroll zu Ergebnissen
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main>
        {/* Eingabeformular */}
        <EingabeFormular onCalculate={handleCalculate} />

        {/* Ergebnisse (nur nach Berechnung sichtbar) */}
        {szenarien && eingaben && (
          <div ref={resultsRef} className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            
            {/* Zusammenfassung & PDF-Export */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-2xl font-bold mb-2">✅ Berechnung abgeschlossen</h2>
                  <p className="text-primary-100">
                    {szenarien.length} Szenarien wurden generiert (Raten von 500€ bis 2.500€)
                  </p>
                  
                  {/* Eigenkapital-Hinweis */}
                  {(() => {
                    const mittleresSzenario = szenarien[Math.floor(szenarien.length / 2)];
                    const ekCheck = checkEigenkapitalQuote(
                      eingaben.eigenkapital,
                      mittleresSzenario.kaufpreis
                    );
                    
                    return (
                      <div className="mt-3 inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {ekCheck.message}
                      </div>
                    );
                  })()}
                </div>
                
                <div>
                  <PDFExportButton 
                    eingaben={eingaben} 
                    szenarien={szenarien} 
                    bundesland={bundesland} 
                  />
                </div>
              </div>
            </div>

            {/* Tabelle */}
            <div className="mb-8 animate-slide-up">
              <FinanzierungsTabelle szenarien={szenarien} />
            </div>

            {/* Charts */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <ChartKaufpreisSpielraum szenarien={szenarien} />
              <ChartKostenstruktur szenarien={szenarien} />
            </div>

            {/* Handlungsempfehlungen */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Nächste Schritte & Empfehlungen
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Optimales Szenario */}
                {(() => {
                  const optimaleSzenarien = szenarien.filter(s => s.beleihungsauslauf <= 80);
                  
                  if (optimaleSzenarien.length > 0) {
                    const bestes = optimaleSzenarien[optimaleSzenarien.length - 1];
                    
                    return (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          ⭐ Ihr optimales Szenario
                        </h3>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p><strong>Rate:</strong> {bestes.rate}€/Monat</p>
                          <p><strong>Kaufpreis:</strong> {bestes.kaufpreis.toLocaleString('de-DE')}€</p>
                          <p><strong>Beleihungsauslauf:</strong> {bestes.beleihungsauslauf}%</p>
                          <p><strong>Laufzeit:</strong> {bestes.laufzeitJahre.toFixed(1)} Jahre</p>
                        </div>
                        <p className="text-xs text-green-700 mt-2">
                          ✓ Beste Konditionen durch LTV ≤ 80%
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          ⚠️ Kein optimales Szenario
                        </h3>
                        <p className="text-sm text-amber-700">
                          Alle Szenarien haben einen Beleihungsauslauf über 80%. 
                          Erwägen Sie, mehr Eigenkapital einzusetzen oder eine niedrigere Rate zu wählen.
                        </p>
                      </div>
                    );
                  }
                })()}

                {/* Allgemeine Tipps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    💡 Wichtige Hinweise
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Vergleichen Sie mehrere Bankangebote</li>
                    <li>Achten Sie auf Sondertilgungsrechte</li>
                    <li>Nebenkosten müssen sofort verfügbar sein</li>
                    <li>Eigenkapital &gt;20% = bessere Konditionen</li>
                    <li>Planen Sie finanziellen Puffer ein</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Zurück nach oben */}
            <div className="mt-8 text-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md transition-all duration-300 border border-gray-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Zurück zum Formular
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-2">Immobilienfinanzierungs-Rechner</h3>
              <p className="text-gray-400 text-sm">
                Professionelle Finanzierungsberatung für Ihre Traumimmobilie
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Rechtlicher Hinweis</h3>
              <p className="text-gray-400 text-sm">
                Diese Berechnungen dienen ausschließlich zur Orientierung. 
                Für verbindliche Angebote konsultieren Sie bitte einen Finanzberater.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Powered by</h3>
              <p className="text-gray-400 text-sm">
                Hendrik Benevides KI Beratung<br />
                © 2025 Alle Rechte vorbehalten
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>Entwickelt mit React, TypeScript & Cloudflare Pages</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
