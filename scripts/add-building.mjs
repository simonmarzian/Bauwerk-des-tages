// Wird alle 12h per GitHub Actions ausgeführt (siehe .github/workflows/auto-add-building.yml).
// 1. Nimmt den nächsten Eintrag aus data/queue.json
// 2. Sucht ein frei lizenziertes Bild auf Wikimedia Commons
// 3. Lässt Claude (Anthropic API) einen kurzen Artikel dazu schreiben
// 4. Hängt das Ergebnis an data/buildings.json an und aktualisiert queue.json
//
// Benötigt: Node.js 18+ (globales fetch), Umgebungsvariable ANTHROPIC_API_KEY

import { readFile, writeFile } from 'node:fs/promises';

const QUEUE_PATH = new URL('../data/queue.json', import.meta.url);
const BUILDINGS_PATH = new URL('../data/buildings.json', import.meta.url);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function findCommonsImage(query) {
  const searchUrl =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search' +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5` +
    '&prop=imageinfo&iiprop=url|extmetadata|mime&format=json&origin=*';

  const res = await fetch(searchUrl);
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];

  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info || !/^image\/(jpeg|png)$/.test(info.mime || '')) continue;
    const filename = page.title.replace(/^File:/, '');
    const licenseShort =
      info.extmetadata?.LicenseShortName?.value || 'Wikimedia Commons';
    const artist = (info.extmetadata?.Artist?.value || '')
      .replace(/<[^>]+>/g, '')
      .trim();
    const credit = artist
      ? `Foto: ${artist} / Wikimedia Commons, ${licenseShort}`
      : `Foto: Wikimedia Commons, ${licenseShort}`;
    return { filename, credit };
  }
  return null;
}

async function writeArticle({ name, architect, location }) {
  const prompt = `Schreibe einen kurzen deutschsprachigen Architektur-Artikel über das Gebäude "${name}"` +
    (architect ? ` von ${architect}` : '') +
    (location ? ` in ${location}` : '') +
    `.

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt (keine Markdown-Codeblöcke, kein Fließtext davor oder danach) mit genau diesen Feldern:
{
  "architect": "Architekt·in, kurz",
  "year": "Baujahr bzw. Bauzeitraum, kurz",
  "location": "Stadt, Land",
  "style": "Architekturstil, 2-4 Wörter",
  "teaser": "Ein einzelner prägnanter Satz, max. 20 Wörter",
  "text": ["Absatz 1", "Absatz 2", "Absatz 3"]
}

Die drei Absätze in "text" sollen wie in einem Architekturmagazin geschrieben sein: Absatz 1 Entstehungsgeschichte/Kontext, Absatz 2 ein konstruktives oder gestalterisches Detail, Absatz 3 architekturhistorische Einordnung. Jeder Absatz 2-4 Sätze. Eigenständig formuliert, keine wörtlichen Zitate aus anderen Quellen.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) {
    throw new Error(`Anthropic API Fehler: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const textBlock = data.content.find((b) => b.type === 'text');
  const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

async function main() {
  const queue = JSON.parse(await readFile(QUEUE_PATH, 'utf8'));
  if (queue.length === 0) {
    console.log('Warteschlange ist leer — nichts zu tun. Bitte data/queue.json auffüllen.');
    return;
  }

  const candidate = queue[0];
  console.log('Nächstes Gebäude:', candidate.name);

  const image = await findCommonsImage(candidate.name + ' building');
  if (!image) {
    console.log('Kein passendes Bild gefunden, überspringe und entferne aus der Warteschlange.');
    await writeFile(QUEUE_PATH, JSON.stringify(queue.slice(1), null, 2) + '\n');
    return;
  }

  const article = await writeArticle(candidate);

  const buildings = JSON.parse(await readFile(BUILDINGS_PATH, 'utf8'));
  buildings.push({
    id: slugify(candidate.name),
    name: candidate.name,
    architect: article.architect || candidate.architect || 'unbekannt',
    year: article.year || 'unbekannt',
    location: article.location || candidate.location || 'unbekannt',
    style: article.style || 'unbekannt',
    image: image.filename,
    credit: image.credit,
    teaser: article.teaser,
    text: article.text
  });

  await writeFile(BUILDINGS_PATH, JSON.stringify(buildings, null, 2) + '\n');
  await writeFile(QUEUE_PATH, JSON.stringify(queue.slice(1), null, 2) + '\n');
  console.log('Hinzugefügt:', candidate.name);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
