# BAUWERK — Anleitung

Diese Anleitung erklärt drei Dinge:

1. Wie du die Seite kostenlos online stellst
2. Wie automatisch alle 12 Stunden ein neues Gebäude dazukommt
3. Wie Besucher:innen Gebäude vorschlagen können

## Projektstruktur

```
bauwerk-des-tages/
├── index.html                        ← die eigentliche Seite
├── data/
│   ├── buildings.json                ← alle veröffentlichten Gebäude
│   └── queue.json                    ← Warteliste für die Automatisierung
├── scripts/
│   └── add-building.mjs              ← generiert automatisch ein neues Gebäude
└── .github/workflows/
    └── auto-add-building.yml         ← führt das Skript alle 12h aus
```

Wichtig: `index.html` lädt die Gebäude per `fetch('data/buildings.json')`. Das
funktioniert **nur**, wenn die Seite über einen echten Webserver ausgeliefert
wird — nicht, wenn du die Datei per Doppelklick im Browser öffnest. Für lokale
Tests reicht z. B. `npx serve` im Projektordner.

## 1. Seite online stellen (kostenlos via GitHub Pages)

1. Erstelle einen kostenlosen Account auf [github.com](https://github.com),
   falls du noch keinen hast.
2. Lege ein neues, leeres Repository an, z. B. `bauwerk-des-tages`.
3. Lade den kompletten Ordnerinhalt hoch (im Browser per Drag & Drop über
   „Add file → Upload files“, oder lokal mit Git):
   ```
   git init
   git add .
   git commit -m "Erste Version"
   git branch -M main
   git remote add origin https://github.com/DEIN-NUTZERNAME/bauwerk-des-tages.git
   git push -u origin main
   ```
4. Im Repository: **Settings → Pages → Source** auf „Deploy from a branch“
   stellen, Branch `main`, Ordner `/ (root)` auswählen, speichern.
5. Nach ein bis zwei Minuten ist die Seite erreichbar unter:
   `https://DEIN-NUTZERNAME.github.io/bauwerk-des-tages/`

Alternativen mit ähnlich einfachem Ablauf: **Netlify** oder **Vercel**
(Repository verbinden, „Deploy“ klicken — beide unterstützen auch eigene
Domains, falls du später `bauwerk.de` o. Ä. verwenden möchtest).

## 2. Automatisch alle 12h ein neues Gebäude

Das übernimmt der GitHub-Actions-Workflow
`.github/workflows/auto-add-building.yml`. Er läuft zweimal täglich, nimmt den
nächsten Eintrag aus `data/queue.json`, lässt Claude (über die Anthropic-API)
einen Artikel dazu schreiben, sucht ein passendes freies Bild auf Wikimedia
Commons und schreibt das Ergebnis in `data/buildings.json`. GitHub Pages
aktualisiert die Live-Seite danach automatisch beim nächsten Zugriff.

Einrichtung:

1. Erstelle einen API-Key auf [console.anthropic.com](https://console.anthropic.com).
   Die Nutzung kostet etwas pro generiertem Artikel (im Cent-Bereich), da es
   sich um reale API-Aufrufe handelt.
2. Im Repository: **Settings → Secrets and variables → Actions → New
   repository secret**, Name `ANTHROPIC_API_KEY`, Wert = dein Key.
3. Fertig — der Workflow läuft automatisch nach dem in der Datei hinterlegten
   Zeitplan (`cron: '0 6,18 * * *'`, also 06:00 und 18:00 UTC). Du kannst ihn
   auch manuell testen: Tab **Actions → Neues Gebäude hinzufügen → Run
   workflow**.
4. `data/queue.json` ist die Warteliste zukünftiger Gebäude. Sie ist mit 25
   bekannten Bauwerken vorbefüllt. Trage einfach weitere Namen ein (Name,
   Architekt, Standort reichen), wenn die Liste zur Neige geht — oder füge dort
   auch angenommene Vorschläge aus Abschnitt 3 ein.

Wenn die Warteliste leer ist, beendet sich das Skript einfach ohne etwas zu
tun (statt einen Fehler zu werfen) — die Seite bleibt dann bei der letzten
Anzahl Gebäude stehen, bis du neue Namen in `queue.json` einträgst.

## 3. Gebäude-Vorschläge von Besucher:innen entgegennehmen

Die Seite hat einen Button „+ Gebäude vorschlagen“ mit einem Formular. Da
GitHub Pages nur statische Dateien ausliefert (kein eigener Server), braucht
das Formular einen externen Formular-Dienst, der die Einsendungen für dich
sammelt:

1. Erstelle einen kostenlosen Account auf [formspree.io](https://formspree.io).
2. Lege dort ein neues Formular an und kopiere die Formular-ID (sieht aus wie
   `xayzabcd`).
3. Öffne `index.html`, suche die Zeile:
   ```js
   const SUGGEST_ENDPOINT = 'https://formspree.io/f/DEIN_FORM_ID';
   ```
   und ersetze `DEIN_FORM_ID` durch deine echte ID.
4. Ab jetzt landen alle Einsendungen in deinem Formspree-Postfach (bzw. an die
   E-Mail-Adresse, die du dort hinterlegt hast).

**Moderation / Übernahme auf die Seite:** Es gibt bewusst keine vollautomatische
Übernahme — Vorschläge sollen erst geprüft werden (Qualität, Bildrechte,
Relevanz). Findest du einen Vorschlag interessant, trägst du ihn einfach in
`data/queue.json` ein (Name, Architekt, Standort); die Automatisierung aus
Abschnitt 2 erledigt beim nächsten Lauf den Rest — Text und Bild werden dann
automatisch erzeugt.

Wenn dir Formspree zu wenig ist und du auch will, dass „interessante“
Vorschläge automatisch (statt nach manueller Sichtung) übernommen werden,
bräuchtest du zusätzlich eine eigene Prüf-Logik (z. B. eine weitere Anthropic-
API-Abfrage, die Einsendungen automatisch bewertet). Das ist mit vertretbarem
Aufwand nachrüstbar, sobald die Grundversion läuft — sag einfach Bescheid,
falls du das als nächsten Schritt willst.

## Rechtliches, kurz

- Der Name „STRUKTUR“ wurde zu „BAUWERK“ geändert, um Verwechslungsrisiken mit
  bestehenden Marken/Magazinen zu vermeiden. Prüfe vor einer echten
  Veröffentlichung trotzdem kurz, ob „BAUWERK“ (oder ein anderer Name deiner
  Wahl) in deinem Land/deiner Branche bereits als Marke eingetragen ist, z. B.
  über das Register des DPMA (dpma.de) — das ist keine Rechtsberatung, nur ein
  praktischer Hinweis.
- Alle Bilder stammen von Wikimedia Commons unter freien Lizenzen; die
  automatische Bildsuche berücksichtigt das, aber wirf bei neuen Einträgen
  trotzdem einen kurzen Blick auf die Lizenzangabe, bevor du sie langfristig
  online lässt.
- Die generierten Artikeltexte sind KI-generierte Eigenformulierungen, keine
  Kopien aus anderen Quellen — trotzdem empfiehlt sich ein kurzer Faktencheck
  vor Veröffentlichung, gerade bei Baujahr und Architekt·in.
