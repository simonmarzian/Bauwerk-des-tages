# BAUWERK online stellen — Anleitung für Einsteiger:innen

Diese Anleitung braucht **kein Vorwissen** und **keine Kommandozeile**. Du
arbeitest nur mit der Maus im Browser und kopierst an ein paar Stellen Text
hinein. Rechne mit ca. 25–30 Minuten.

## Was kostet das?

| Was | Kosten |
|---|---|
| Seite hosten (GitHub Pages) | 0 € |
| Automatisierung, die alle 12h läuft (GitHub Actions) | 0 € |
| Formular für Vorschläge (Formspree) | 0 € (bis 50 Einsendungen/Monat) |
| Anthropic-API (schreibt die neuen Artikel) | ca. 0,50–2 € pro Monat |

Die einzigen echten Kosten sind die API-Aufrufe für die automatisch
generierten Artikel. Ich habe das Skript bereits auf das güns­tigste
verfügbare Modell (**Claude Haiku**) eingestellt — das reicht für diese Texte
völlig aus und kostet nur einen Bruchteil der teureren Modelle.

---

## Schritt 1 — ZIP-Datei entpacken

Du hast von mir die Datei `bauwerk-des-tages.zip` bekommen.

1. Lade sie herunter (falls noch nicht geschehen).
2. Doppelklick auf die ZIP-Datei → sie wird zu einem Ordner
   `bauwerk-des-tages` entpackt (bei Windows ggf. „Alle extrahieren"
   klicken).
3. Merke dir, wo dieser Ordner liegt (z. B. „Downloads").

## Schritt 2 — GitHub-Account erstellen

GitHub ist der Ort, wo deine Seite kostenlos gespeichert und veröffentlicht
wird.

1. Gehe auf **github.com**
2. Klicke oben rechts auf **Sign up**
3. E-Mail-Adresse eingeben, Passwort wählen, Nutzernamen wählen (z. B.
   `deinname123`) → durch die restliche Registrierung klicken

## Schritt 3 — Neues Repository (= Projektordner auf GitHub) anlegen

1. Oben rechts auf das **+** klicken → **New repository**
2. **Repository name:** `bauwerk-des-tages`
3. Sichtbarkeit: **Public** lassen (wichtig — nur so ist GitHub Pages und
   die Automatisierung kostenlos)
4. Sonst nichts ankreuzen, unten auf **Create repository** klicken

## Schritt 4 — Deine Dateien hochladen

1. Du landest auf der leeren Repository-Seite. Klicke auf den Link
   **„uploading an existing file"** (steht mittig auf der Seite)
2. Öffne auf deinem Computer den entpackten Ordner `bauwerk-des-tages`
3. Markiere **alle Dateien und Unterordner darin** (nicht den äußeren
   Ordner selbst, sondern seinen *Inhalt*: `index.html`, den Ordner `data`,
   den Ordner `scripts`, den Ordner `.github`, `ANLEITUNG.md`)
4. Ziehe alles per Drag & Drop in das Upload-Feld im Browser
5. Unten bei „Commit changes" einfach auf den grünen Button
   **Commit changes** klicken

> Falls der Ordner `.github` beim Ziehen nicht mitkommt (manche Browser
> zeigen versteckte Ordner nicht an): Lade ihn einfach in einem zweiten
> Durchgang separat hoch — „Add file → Upload files" → Ordner `.github`
> ziehen → Commit changes.

## Schritt 5 — GitHub Pages aktivieren (macht die Seite live)

1. Oben im Repository auf den Reiter **Settings** klicken
2. Links im Menü auf **Pages** klicken
3. Bei **„Branch"** aus dem Dropdown `main` auswählen, daneben `/ (root)`
   lassen → **Save**
4. Kurz warten (1–2 Minuten), dann oben auf der gleichen Seite die URL
   ansehen, die etwa so aussieht:
   ```
   https://deinname123.github.io/bauwerk-des-tages/
   ```
5. Diese URL aufrufen — deine Seite ist jetzt live! 🎉

---

## Schritt 6 — Anthropic-API-Key besorgen (für die automatischen neuen Gebäude)

1. Gehe auf **console.anthropic.com** und melde dich an / registriere dich
2. Im Menü links auf **API Keys** (oder „Get API Keys")
3. **Create Key** klicken, einen Namen vergeben (z. B. `bauwerk`), Key
   erstellen
4. Kopiere den angezeigten Key sofort (er beginnt mit `sk-ant-...`) — er
   wird danach nicht mehr vollständig angezeigt
5. Falls verlangt: Hinterlege eine kleine Zahlungsmethode für die
   API-Nutzung (Kosten siehe Tabelle oben, du kannst zusätzlich unter
   „Limits" ein monatliches Ausgabenlimit setzen, z. B. 5 €, damit es nie
   mehr kosten kann)

## Schritt 7 — API-Key sicher in GitHub hinterlegen

Wichtig: Der Key kommt **niemals** direkt in eine Datei, sondern in einen
geschützten „Secret"-Speicher.

1. In deinem Repository: **Settings → Secrets and variables → Actions**
2. Grüner Button **New repository secret**
3. **Name:** genau folgendes eintragen:
   ```
   ANTHROPIC_API_KEY
   ```
4. **Secret:** deinen kopierten Key einfügen (der mit `sk-ant-...` beginnt)
5. **Add secret** klicken

## Schritt 8 — Automatisierung einmal von Hand testen

1. Oben im Repository auf den Reiter **Actions** klicken
2. Links auf **„Neues Gebäude hinzufügen"** klicken
3. Rechts den Button **„Run workflow"** → nochmal **„Run workflow"**
   bestätigen
4. Nach ca. 30–60 Sekunden auf Aktualisieren klicken — ein grüner Haken ✅
   bedeutet: es hat geklappt, ein neues Gebäude wurde automatisch erzeugt
   und zur Seite hinzugefügt
5. Danach läuft es von selbst weiter — zweimal täglich, ganz ohne dein
   Zutun

Falls ein rotes Kreuz ❌ erscheint: Klick auf den fehlgeschlagenen Lauf und
dann auf den Schritt „Neues Gebäude generieren", um die Fehlermeldung zu
lesen — meistens liegt es an einem falsch eingefügten API-Key (Schritt 7
wiederholen).

---

## Schritt 9 — Formular für Gebäude-Vorschläge einrichten

1. Gehe auf **formspree.io** und erstelle einen kostenlosen Account
2. Klicke auf **„+ New Form"**, gib ihm einen Namen (z. B. „Bauwerk
   Vorschläge"), **Create Form**
3. Formspree zeigt dir jetzt eine ID, die so aussieht: `xayzabcd`
   (steht auch in der URL des Formulars, nach `/f/`)

Jetzt trägst du diese ID in deiner Seite ein:

4. Gehe in deinem GitHub-Repository zur Datei **`index.html`**
5. Klicke auf das kleine **Stift-Symbol** (✎) oben rechts, um die Datei im
   Browser zu bearbeiten
6. Nutze die Suchfunktion deines Browsers (Strg+F bzw. Cmd+F) und suche nach:
   ```
   DEIN_FORM_ID
   ```
7. Du findest genau diese eine Zeile:
   ```js
   const SUGGEST_ENDPOINT = 'https://formspree.io/f/DEIN_FORM_ID';
   ```
   Ersetze darin **nur** `DEIN_FORM_ID` durch deine echte ID, z. B.:
   ```js
   const SUGGEST_ENDPOINT = 'https://formspree.io/f/xayzabcd';
   ```
8. Unten auf **„Commit changes..."** klicken → nochmal **„Commit
   changes"** bestätigen

Ab jetzt landen alle Vorschläge, die Besucher:innen über den Button
„+ Gebäude vorschlagen" abschicken, direkt in deinem Formspree-Postfach
(bzw. per E-Mail bei dir).

## Schritt 10 — Vorschläge übernehmen

Wenn dir ein eingesendeter Vorschlag gefällt:

1. Gehe zu **`data/queue.json`** in deinem Repository, Stift-Symbol
   klicken
2. Füge vor der letzten `]` einen neuen Eintrag nach diesem Muster ein
   (auf das Komma nach der vorherigen `}` achten):
   ```json
   ,
   { "name": "NAME DES GEBÄUDES", "architect": "ARCHITEKT:IN", "location": "STADT, LAND" }
   ```
3. Commit changes klicken

Beim nächsten automatischen Lauf (spätestens 12h später) wird daraus
automatisch ein fertiger Artikel mit Bild.

---

## Fertig — was jetzt automatisch passiert

- Deine Seite ist dauerhaft und kostenlos erreichbar unter deiner
  `github.io`-Adresse
- Alle 12 Stunden wird automatisch ein neues Gebäude aus der Warteliste
  generiert und veröffentlicht
- Besucher:innen können über das Formular Gebäude vorschlagen, die bei dir
  landen — du entscheidest, was übernommen wird

## Wenn dir was nicht mehr gefällt

- **Seitenname ändern:** Datei `index.html` öffnen (Stift-Symbol), nach
  `BAUWERK` suchen, ersetzen, Commit changes
- **Automatisierung pausieren:** Datei `.github/workflows/auto-add-building.yml`
  löschen (oder umbenennen) — dann läuft nichts mehr automatisch, und es
  entstehen keine weiteren API-Kosten
- **Eigene Domain (z. B. bauwerk-magazin.de) statt github.io:** in
  **Settings → Pages → Custom domain** eintragen (Domain muss separat bei
  einem Anbieter wie Namecheap o. Ä. gekauft werden, ca. 10 €/Jahr — optional,
  nicht nötig)
