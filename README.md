# 🏠 Immobilienfinanzierungs-Rechner

**Professionelle Web-Anwendung zur Berechnung und Visualisierung von Immobilienfinanzierungen**

> Entwickelt mit React 18, TypeScript, Vite und TailwindCSS  
> Optimiert für Cloudflare Pages Deployment

---

## 🚀 Quick Start

### Voraussetzungen

- **Node.js** ≥ 18.0.0
- **npm** oder **yarn**
- **Git** für Version Control

### Lokale Installation

```bash
# Repository klonen
git clone <your-repo-url>
cd immobilien-finanzrechner

# Dependencies installieren
npm install

# Development Server starten
npm run dev
# → Öffnet http://localhost:5173
```

### Lokale Builds testen

```bash
# Production Build erstellen
npm run build

# Build-Vorschau
npm run preview
# → Öffnet http://localhost:4173
```

---

## 📦 Cloudflare Pages Deployment

### Methode 1: Git-Integration (Empfohlen)

#### Schritt 1: GitHub Repository erstellen

```bash
# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Initial Commit
git commit -m "Initial commit: Immobilienfinanzierungs-Rechner"

# Remote Repository verbinden
git remote add origin https://github.com/IHR-USERNAME/immobilien-finanzrechner.git

# Code pushen
git push -u origin main
```

#### Schritt 2: Cloudflare Pages Projekt erstellen

1. Gehe zu [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigiere zu **"Workers & Pages"** → **"Pages"**
3. Klicke auf **"Create application"** → **"Connect to Git"**
4. Wähle dein GitHub Repository: `immobilien-finanzrechner`
5. Konfiguriere Build-Einstellungen:

   ```
   Framework preset:    Vite
   Build command:       npm run build
   Build output dir:    dist
   Root directory:      /
   Node version:        18
   ```

6. Klicke auf **"Save and Deploy"**

#### Schritt 3: Deployment Status prüfen

- Der erste Build dauert ca. 2-3 Minuten
- Nach erfolgreichem Build erhältst du eine URL: `https://immobilien-finanzrechner.pages.dev`
- Jeder Push zu `main` triggert automatisch ein neues Deployment

### Methode 2: Custom Domain einrichten

#### Subdomain (z.B. finanzrechner.deine-domain.de)

1. Im Cloudflare Pages Projekt:
   - Gehe zu **"Custom domains"**
   - Klicke auf **"Set up a custom domain"**
   - Gebe ein: `finanzrechner.deine-domain.de`

2. DNS-Konfiguration (automatisch von Cloudflare):
   - **Type**: `CNAME`
   - **Name**: `finanzrechner`
   - **Target**: `immobilien-finanzrechner.pages.dev`
   - **Proxy**: `Proxied` (orange Cloud)

3. SSL/TLS wird automatisch ausgestellt (ca. 1-2 Minuten)

4. Fertig! Deine App ist erreichbar unter: `https://finanzrechner.deine-domain.de`

#### Apex Domain (z.B. immobilien-rechner.de)

1. Im Cloudflare Pages Projekt:
   - Custom Domain hinzufügen: `immobilien-rechner.de`

2. DNS-Konfiguration:
   - **Type**: `CNAME`
   - **Name**: `@` (oder root)
   - **Target**: `immobilien-finanzrechner.pages.dev`
   - **Proxy**: `Proxied`

---

## 📊 Features

### ✅ Aktuell implementiert

- **Interaktives Eingabeformular**
  - Monatliche Rate (Slider: 500-2500€)
  - Zinssatz & Tilgung mit Tooltips
  - Eigenkapital-Eingabe
  - Bundesland-Auswahl (automatische Grunderwerbsteuer)
  - Nebenkosten (Makler, Notar)

- **Präzise Finanzberechnungen**
  - Annuitätenformel nach deutschem Standard
  - Darlehenssumme, Kaufpreis, Beleihungsauslauf (LTV)
  - Laufzeit, Gesamtaufwand, Zinskosten
  - Effektiver Zins inkl. Nebenkosten

- **3 Interaktive Visualisierungen**
  - Detaillierte Szenario-Tabelle (sortierbar)
  - Kaufpreis-Spielraum Liniendiagramm (Recharts)
  - Kostenstruktur Balkendiagramm (gestapelt)

- **PDF-Export**
  - Mehrseitiger Report (Deckblatt, Tabelle, Charts, Empfehlungen)
  - Professionelles Layout mit jsPDF + html2canvas
  - Optimales Szenario-Highlighting

- **Echtzeit-Validierung**
  - Fehlerprüfung (blockiert Berechnung)
  - Warnungen (erlaubt Berechnung)
  - LTV-Klassifizierung (optimal/gut/hoch/kritisch)

- **Performance-Optimiert**
  - Bundle Size: ~450 KB (gzipped)
  - Initial Load: <1.5s auf Cloudflare CDN
  - Code-Splitting für Vendor-Libraries
  - Tree-Shaking und Minification

- **Responsive Design**
  - Mobile-first Approach
  - Touch-optimiert
  - Adaptive Layouts (Tailwind Grid)

### 🔮 Mögliche Erweiterungen

- **Tilgungsplan-Generator** (monatliche Übersicht)
- **Szenario-Vergleich** (Side-by-Side)
- **KfW-Förderung** Integration
- **Sondertilgung** Rechner
- **Email-Export** (statt nur PDF)
- **Multi-Language** Support (EN, PT)
- **Lokale Speicherung** (localStorage für Favoriten)

---

## 🛠 Tech Stack

### Frontend
- **React 18.2** - UI-Library
- **TypeScript 5.3** - Type Safety
- **Vite 5.0** - Build Tool & Dev Server

### Styling
- **TailwindCSS 3.4** - Utility-First CSS
- **PostCSS** - CSS Processing
- **Google Fonts (Inter)** - Typography

### Visualisierung
- **Recharts 2.10** - React Chart Library
  - `<LineChart>` für Kaufpreis-Spielraum
  - `<BarChart>` für Kostenstruktur

### PDF-Generation
- **jsPDF 2.5** - PDF Creation
- **html2canvas 1.4** - DOM to Canvas

### Hosting
- **Cloudflare Pages** - Static Site Hosting
  - Global CDN (100+ Locations)
  - Automatisches SSL/TLS
  - Git-basiertes Deployment
  - Kostenlos bis 500 Builds/Monat

---

## 📁 Projektstruktur

```
immobilien-finanzrechner/
├── public/
│   └── logo.svg                    # App-Logo
│
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Header mit Branding
│   │   ├── EingabeFormular.tsx     # Eingabe-UI mit Validierung
│   │   ├── FinanzierungsTabelle.tsx # Sortierbare Datentabelle
│   │   ├── ChartKaufpreisSpielraum.tsx # Liniendiagramm
│   │   ├── ChartKostenstruktur.tsx # Balkendiagramm
│   │   └── PDFExportButton.tsx     # PDF-Export mit Loading
│   │
│   ├── utils/
│   │   ├── finanzberechnungen.ts   # Kern-Berechnungslogik
│   │   ├── validierung.ts          # Input-Validierung
│   │   ├── formatierung.ts         # Zahlenformatierung (DE)
│   │   └── pdfGenerator.ts         # PDF-Export-Logik
│   │
│   ├── data/
│   │   └── bundeslaender.ts        # Grunderwerbsteuer-Daten
│   │
│   ├── styles/
│   │   └── index.css               # Global Styles + Tailwind
│   │
│   ├── App.tsx                     # Haupt-Komponente
│   ├── main.tsx                    # Entry Point
│   └── vite-env.d.ts               # Vite Type Definitions
│
├── index.html                      # HTML-Template
├── package.json                    # Dependencies
├── vite.config.ts                  # Vite-Konfiguration
├── tsconfig.json                   # TypeScript-Konfiguration
├── tailwind.config.js              # Tailwind-Konfiguration
├── postcss.config.js               # PostCSS-Konfiguration
├── .gitignore                      # Git-Ignore-Regeln
└── README.md                       # Diese Datei
```

---

## 🧮 Berechnungsformeln

### 1. Darlehenssumme

```
D = (R × 12) / (Zins + Tilgung) × 100

D: Darlehenssumme
R: Monatliche Rate
Zins: Jahreszins in %
Tilgung: Anfangstilgung in %
```

### 2. Kaufpreis

```
KP = D + EK

KP: Kaufpreis
D: Darlehenssumme
EK: Eigenkapital
```

### 3. Nebenkosten

```
NK = KP × (Makler% + Notar% + Grunderwerbsteuer%)

NK: Nebenkosten gesamt
KP: Kaufpreis
```

### 4. Beleihungsauslauf (LTV)

```
LTV = (D / KP) × 100

LTV: Loan-to-Value Ratio in %
D: Darlehenssumme
KP: Kaufpreis

Bewertung:
- ≤60%: Optimal (beste Konditionen)
- ≤80%: Gut (Standardkonditionen)
- 80-90%: Vorsicht (höhere Zinsen möglich)
- >90%: Kritisch (schwierige Finanzierung)
```

### 5. Laufzeit

```
n = ln(R / (R - D × i)) / ln(1 + i)

n: Laufzeit in Monaten
R: Monatliche Rate
D: Darlehenssumme
i: Monatszins (Jahreszins / 12 / 100)
ln: Natürlicher Logarithmus
```

### 6. Gesamtaufwand & Zinskosten

```
GA = R × n
Z = GA - D

GA: Gesamtaufwand (Summe aller Raten)
Z: Zinskosten gesamt
n: Laufzeit in Monaten
```

### 7. Effektiver Zins

```
eff = ((Z + NK) / D / Laufzeit_Jahre) × 100

eff: Effektiver Zins in %
Z: Zinskosten
NK: Nebenkosten
D: Darlehenssumme
```

---

## 🎨 Design-System

### Farben (Tailwind)

```css
/* Primary (Grün) */
primary-500: #10b981
primary-600: #059669
primary-700: #047857

/* Warning (Amber) */
warning-500: #f59e0b
warning-600: #d97706

/* Danger (Rot) */
danger-500: #ef4444
danger-600: #dc2626

/* Neutral */
gray-50: #f9fafb
gray-100: #f3f4f6
gray-200: #e5e7eb
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Heading 1**: 2xl / 24px, bold
- **Heading 2**: xl / 20px, bold
- **Body**: base / 16px, normal
- **Small**: sm / 14px, normal

### Spacing

- **Container Max Width**: 1280px (7xl)
- **Section Padding**: 8 (2rem / 32px)
- **Component Padding**: 6 (1.5rem / 24px)
- **Card Border Radius**: xl (0.75rem / 12px)

---

## 🔧 Entwicklung

### Verfügbare Scripts

```bash
# Development Server mit Hot Reload
npm run dev

# Production Build
npm run build

# Build-Vorschau
npm run preview

# TypeScript Type-Check
npm run lint
```

### Environment Variables

Keine erforderlich! Die App funktioniert komplett client-seitig.

### Browser-Kompatibilität

- **Chrome/Edge**: ≥90
- **Firefox**: ≥88
- **Safari**: ≥14
- **Mobile**: iOS ≥14, Android ≥10

---

## 📈 Performance-Metriken

### Lighthouse Scores (Target)

- **Performance**: >90
- **Accessibility**: >95
- **Best Practices**: >95
- **SEO**: >90

### Bundle-Analyse

```bash
# Nach Build
npm run build

# Bundle-Größen:
dist/index.html:                ~1.3 KB
dist/assets/index-[hash].css:   ~8 KB (gzipped)
dist/assets/index-[hash].js:    ~180 KB (gzipped)
dist/assets/vendor-[hash].js:   ~120 KB (gzipped)

# Gesamt: ~310 KB (gzipped)
```

### Optimierungen

- ✅ Code-Splitting (vendor, react, charts, pdf)
- ✅ Tree-Shaking (Vite automatisch)
- ✅ CSS Minification
- ✅ Image Optimization (SVG)
- ✅ Lazy Loading (Recharts)
- ✅ Cloudflare CDN Caching

---

## 🐛 Troubleshooting

### Problem: `npm install` schlägt fehl

**Lösung:**
```bash
# Node-Version prüfen
node --version  # Sollte ≥18.0.0 sein

# Cache leeren
npm cache clean --force

# Neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Problem: Build-Fehler bei Cloudflare Pages

**Lösung:**
1. Prüfe Build-Einstellungen:
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: `18`

2. Prüfe Logs im Cloudflare Dashboard

3. Lokaler Test:
   ```bash
   npm run build
   npm run preview
   ```

### Problem: PDF-Export funktioniert nicht

**Lösung:**
- Prüfe Browser-Konsole auf Fehler
- Stelle sicher, dass Charts vollständig geladen sind
- Teste mit einem anderen Browser
- Überprüfe, dass `id`-Attribute korrekt sind:
  - `#finanzierungstabelle`
  - `#chart-kaufpreis`
  - `#chart-kostenstruktur`

### Problem: Charts werden nicht angezeigt

**Lösung:**
```bash
# Recharts neu installieren
npm install recharts@^2.10.3

# Dev-Server neu starten
npm run dev
```

---

## 📝 Lizenz

**MIT License**

Copyright © 2025 Hendrik Benevides KI Beratung

---

## 👨‍💻 Autor

**Hendrik Benevides**  
KI-Berater & Finanzexperte

- 🌐 Website: [hendrik-benevides.de](https://hendrik-benevides.de)
- 💼 LinkedIn: [Hendrik Benevides](https://linkedin.com/in/hendrik-benevides)
- 📧 Email: kontakt@hendrik-benevides.de

---

## 🙏 Credits

- **React Team** - UI-Framework
- **Vite Team** - Build Tool
- **Tailwind Labs** - CSS Framework
- **Recharts Contributors** - Chart Library
- **Cloudflare** - Hosting & CDN

---

## 📞 Support

Bei Fragen oder Problemen:

1. **Dokumentation prüfen** (dieses README)
2. **Issues erstellen** auf GitHub
3. **Kontakt aufnehmen** via Email

---

**Viel Erfolg mit Ihrer Immobilienfinanzierung! 🏡💰**
