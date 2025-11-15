/**
 * Interaktives Eingabeformular mit Echtzeit-Validierung
 */

import { useState, useEffect } from 'react';
import { bundeslaender, getBundeslandByName } from '../data/bundeslaender';
import { BerechnungsInput } from '../utils/finanzberechnungen';
import { validiereEingaben, ValidationResult } from '../utils/validierung';

interface EingabeFormularProps {
  onCalculate: (input: BerechnungsInput, bundeslandName: string) => void;
}

export default function EingabeFormular({ onCalculate }: EingabeFormularProps) {
  // State für Eingaben
  const [rate, setRate] = useState<number>(1000);
  const [schrittweite, setSchrittweite] = useState<number>(50);
  const [zinssatz, setZinssatz] = useState<number>(3.5);
  const [tilgung, setTilgung] = useState<number>(2.0);
  const [eigenkapital, setEigenkapital] = useState<number>(50000);
  const [bundesland, setBundesland] = useState<string>('Bayern');
  const [maklerProvision, setMaklerProvision] = useState<number>(3.57);
  const [notarKosten, setNotarKosten] = useState<number>(2.0);
  
  const [validation, setValidation] = useState<ValidationResult>({ 
    isValid: true, 
    errors: [], 
    warnings: [] 
  });

  // Echtzeit-Validierung
  useEffect(() => {
    const bundeslandData = getBundeslandByName(bundesland);
    const input: BerechnungsInput = {
      rate,
      zinssatz,
      tilgung,
      eigenkapital,
      maklerProvision,
      notarKosten,
      grunderwerbSteuer: bundeslandData?.grunderwerbsteuer || 3.5
    };
    
    setValidation(validiereEingaben(input));
  }, [rate, zinssatz, tilgung, eigenkapital, maklerProvision, notarKosten, bundesland]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.isValid) {
      alert('Bitte korrigieren Sie die Eingabefehler.');
      return;
    }

    const bundeslandData = getBundeslandByName(bundesland);
    const input: BerechnungsInput = {
      rate,
      zinssatz,
      tilgung,
      eigenkapital,
      maklerProvision,
      notarKosten,
      grunderwerbSteuer: bundeslandData?.grunderwerbsteuer || 3.5
    };

    onCalculate(input, bundesland);
  };

  const grunderwerbsteuer = getBundeslandByName(bundesland)?.grunderwerbsteuer || 3.5;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* KARTE 1: Finanzierungs-Parameter */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Finanzierung
            </h2>

            {/* Monatliche Rate mit Slider */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monatliche Rate (€)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="500"
                  max="2500"
                  step={schrittweite}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>500€</span>
                <div className="flex items-center space-x-2">
                  <span>Schrittweite:</span>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    step="10"
                    value={schrittweite}
                    onChange={(e) => setSchrittweite(Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <span>€</span>
                </div>
                <span>2500€</span>
              </div>
            </div>

            {/* Zinssatz */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                Zinssatz (% p.a.)
                <Tooltip text="Aktueller Sollzins Ihrer Bank (Stand: 2025 ca. 3-4%)" />
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="15"
                value={zinssatz}
                onChange={(e) => setZinssatz(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Tilgung */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                Tilgung (% p.a.)
                <Tooltip text="Anfänglicher Tilgungssatz pro Jahr. Mindestens 1%, empfohlen 2-3%" />
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={tilgung}
                onChange={(e) => setTilgung(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Eigenkapital */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                Eigenkapital (€)
                <Tooltip text="Ihr verfügbares Kapital. Mindestens 10-20% des Kaufpreises empfohlen" />
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={eigenkapital}
                onChange={(e) => setEigenkapital(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* KARTE 2: Nebenkosten & Standort */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Nebenkosten & Standort
            </h2>

            {/* Bundesland */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bundesland
              </label>
              <select
                value={bundesland}
                onChange={(e) => setBundesland(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                {bundeslaender.map((bl) => (
                  <option key={bl.name} value={bl.name}>
                    {bl.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-600 flex items-center">
                <svg className="w-4 h-4 mr-1 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                → Grunderwerbsteuer: {grunderwerbsteuer.toFixed(1)}%
              </p>
            </div>

            {/* Maklerprovision */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maklerprovision (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={maklerProvision}
                onChange={(e) => setMaklerProvision(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Notarkosten */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notarkosten (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={notarKosten}
                onChange={(e) => setNotarKosten(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Info-Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800 flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Nebenkosten werden vom Kaufpreis berechnet und können üblicherweise nicht finanziert werden.
              </p>
            </div>
          </div>
        </div>

        {/* Validierungs-Meldungen */}
        {(validation.errors.length > 0 || validation.warnings.length > 0) && (
          <div className="mt-6 space-y-3">
            {validation.errors.map((error, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            ))}
            
            {validation.warnings.map((warning, idx) => (
              <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-amber-800">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={!validation.isValid}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>BERECHNEN & VISUALISIEREN</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// Tooltip-Komponente
function Tooltip({ text }: { text: string }) {
  return (
    <div className="relative group ml-2">
      <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded-lg p-2 z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
