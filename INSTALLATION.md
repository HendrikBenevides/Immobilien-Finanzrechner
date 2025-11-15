# 🚀 Installations-Anleitung

## Option A: Mit Git CLI (Empfohlen für Entwickler)

### 1. Git installieren
- Windows: https://git-scm.com/download/win
- Mac: `brew install git`
- Linux: `sudo apt-get install git`

### 2. Lokales Projekt erstellen

```bash
# Erstelle Projektordner
mkdir immobilien-finanzrechner
cd immobilien-finanzrechner

# Git initialisieren
git init

# Remote Repository verbinden (ERSETZE mit deiner URL!)
git remote add origin https://github.com/DEIN-USERNAME/immobilien-finanzrechner.git
```

### 3. Alle Dateien von dieser Plattform herunterladen

Du hast 2 Optionen:

**Option 3a: Export-Funktion nutzen** (falls verfügbar)
- Nutze die Export/Download-Funktion dieser Plattform
- Entpacke das ZIP in deinen Projektordner

**Option 3b: Manuell kopieren**
- Erstelle die Ordnerstruktur (siehe README.md)
- Kopiere alle Dateiinhalte aus dieser Plattform

### 4. Zu GitHub pushen

```bash
# Alle Dateien hinzufügen
git add .

# Commit erstellen
git commit -m "Initial commit: Immobilienfinanzierungs-Rechner"

# Zu GitHub pushen
git push -u origin main
```

Falls du einen Fehler bekommst "branch main existiert nicht":
```bash
git branch -M main
git push -u origin main
```

---

## Option B: GitHub Desktop (Einfachste GUI-Methode)

### 1. GitHub Desktop installieren
- Download: https://desktop.github.com/
- Installieren und mit GitHub-Account verbinden

### 2. Repository clonen
- File → Clone Repository
- Gehe zu "URL" Tab
- Eingabe: `https://github.com/DEIN-USERNAME/immobilien-finanzrechner`
- Choose lokalen Pfad
- Click "Clone"

### 3. Dateien hinzufügen
- Kopiere alle Projektdateien in den geclonten Ordner
- GitHub Desktop zeigt automatisch alle neuen Dateien

### 4. Commit & Push
- In GitHub Desktop:
  - Summary: "Initial commit"
  - Description: "Vollständiger Immobilienfinanzierungs-Rechner"
  - Click "Commit to main"
  - Click "Push origin"

---

## Option C: GitHub Web-Interface (Keine Installation nötig)

Siehe Haupt-Anleitung im Chat.

---

## ✅ Erfolgs-Check

Nach dem Upload sollte dein Repository so aussehen:
```
https://github.com/DEIN-USERNAME/immobilien-finanzrechner

📁 public/
📁 src/
📄 package.json
📄 vite.config.ts
📄 tsconfig.json
📄 tailwind.config.js
📄 index.html
📄 README.md
... (weitere Dateien)
```

---

## 🆘 Probleme?

**Problem: "Permission denied (publickey)"**
```bash
# SSH-Key erstellen
ssh-keygen -t ed25519 -C "deine-email@example.com"

# Public Key kopieren
cat ~/.ssh/id_ed25519.pub

# Zu GitHub hinzufügen:
# Settings → SSH and GPG keys → New SSH key
```

**Problem: "Repository not found"**
- Prüfe ob Repository wirklich erstellt wurde
- Prüfe URL-Schreibweise (USERNAME/REPO-NAME)

**Problem: "Failed to push"**
```bash
# Force push (nur beim ersten Mal!)
git push -u origin main --force
```

---

## 📞 Support

Falls du hier feststeckst, zeige mir den Fehler und ich helfe dir weiter!
