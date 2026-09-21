import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'portfolio.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance and concurrency
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS publications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    citations INTEGER DEFAULT 0,
    year INTEGER,
    authors TEXT,
    venue TEXT,
    abstract TEXT,
    scholar_link TEXT,
    links TEXT,
    bibtex TEXT,
    apa TEXT,
    ieee TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    institution TEXT,
    topic TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Set default admin PIN if not set
const getPin = db.prepare('SELECT value FROM settings WHERE key = ?');
if (!getPin.get('admin_pin')) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('admin_pin', 'admin123');
}

// Seed Profile if empty
const getProfile = db.prepare('SELECT data FROM profile WHERE id = 1');
const currentProfile = getProfile.get();

if (!currentProfile) {
  const profileJsonPath = path.join(__dirname, '..', 'src', 'data', 'profile.json');
  if (fs.existsSync(profileJsonPath)) {
    const rawData = fs.readFileSync(profileJsonPath, 'utf-8');
    db.prepare('INSERT INTO profile (id, data) VALUES (1, ?)').run(rawData);
    console.log('Seeded profile data into SQLite database from profile.json');
  }
}

// Seed Publications if empty
const countPubs = db.prepare('SELECT COUNT(*) as count FROM publications').get();
if (countPubs.count === 0) {
  const pubsJsonPath = path.join(__dirname, '..', 'src', 'data', 'publications.json');
  if (fs.existsSync(pubsJsonPath)) {
    const rawPubs = JSON.parse(fs.readFileSync(pubsJsonPath, 'utf-8'));
    const insertPub = db.prepare(`
      INSERT INTO publications (id, title, category, citations, year, authors, venue, abstract, scholar_link, links, bibtex, apa, ieee)
      VALUES (@id, @title, @category, @citations, @year, @authors, @venue, @abstract, @scholar_link, @links, @bibtex, @apa, @ieee)
    `);

    const insertMany = db.transaction((pubs) => {
      for (const p of pubs) {
        insertPub.run({
          id: p.id,
          title: p.title,
          category: p.category || 'biomedical',
          citations: p.citations || 0,
          year: p.year || 2024,
          authors: p.authors || '',
          venue: p.venue || '',
          abstract: p.abstract || '',
          scholar_link: p.scholarLink || '',
          links: JSON.stringify(p.links || {}),
          bibtex: p.bibtex || '',
          apa: p.apa || '',
          ieee: p.ieee || ''
        });
      }
    });

    insertMany(rawPubs);
    console.log(`Seeded ${rawPubs.length} publications into SQLite database from publications.json`);
  }
}

/**
 * DB Access Methods
 */
export function getProfileData() {
  const row = db.prepare('SELECT data FROM profile WHERE id = 1').get();
  if (row && row.data) {
    return JSON.parse(row.data);
  }
  return null;
}

export function saveProfileData(profileObj) {
  const serialized = JSON.stringify(profileObj, null, 2);
  db.prepare(`
    INSERT INTO profile (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
  `).run(serialized);

  // Also sync back to src/data/profile.json as static backup
  try {
    const profileJsonPath = path.join(__dirname, '..', 'src', 'data', 'profile.json');
    fs.writeFileSync(profileJsonPath, serialized, 'utf-8');
  } catch (err) {
    console.error('Error syncing profile.json:', err);
  }

  return profileObj;
}

export function getPublicationsData() {
  const rows = db.prepare('SELECT * FROM publications ORDER BY citations DESC, year DESC').all();
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    category: r.category,
    citations: r.citations,
    year: r.year,
    authors: r.authors,
    venue: r.venue,
    abstract: r.abstract,
    scholarLink: r.scholar_link,
    links: r.links ? JSON.parse(r.links) : {},
    bibtex: r.bibtex,
    apa: r.apa,
    ieee: r.ieee
  }));
}

export function replaceAllPublications(pubs) {
  const clear = db.prepare('DELETE FROM publications');
  const insert = db.prepare(`
    INSERT INTO publications (id, title, category, citations, year, authors, venue, abstract, scholar_link, links, bibtex, apa, ieee)
    VALUES (@id, @title, @category, @citations, @year, @authors, @venue, @abstract, @scholar_link, @links, @bibtex, @apa, @ieee)
  `);

  const tx = db.transaction((list) => {
    clear.run();
    for (const p of list) {
      insert.run({
        id: p.id,
        title: p.title,
        category: p.category || 'biomedical',
        citations: p.citations || 0,
        year: p.year || 2024,
        authors: p.authors || '',
        venue: p.venue || '',
        abstract: p.abstract || '',
        scholar_link: p.scholarLink || '',
        links: JSON.stringify(p.links || {}),
        bibtex: p.bibtex || '',
        apa: p.apa || '',
        ieee: p.ieee || ''
      });
    }
  });

  tx(pubs);

  // Sync to src/data/publications.json
  try {
    const pubsJsonPath = path.join(__dirname, '..', 'src', 'data', 'publications.json');
    fs.writeFileSync(pubsJsonPath, JSON.stringify(pubs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error syncing publications.json:', err);
  }

  return pubs;
}

export function verifyAdminPin(pin) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_pin');
  return row ? row.value === pin : pin === 'admin123';
}

export function updateAdminPin(newPin) {
  db.prepare(`
    INSERT INTO settings (key, value) VALUES ('admin_pin', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(newPin);
  return true;
}

/**
 * Inquiries Database Functions
 */
export function getInquiries() {
  const rows = db.prepare('SELECT * FROM inquiries ORDER BY datetime(created_at) DESC').all();
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    institution: r.institution || '',
    topic: r.topic || '',
    message: r.message,
    status: r.status || 'unread',
    createdAt: r.created_at
  }));
}

export function addInquiry(inquiry) {
  const id = inquiry.id || `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = inquiry.createdAt || new Date().toISOString();
  db.prepare(`
    INSERT INTO inquiries (id, name, email, institution, topic, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    inquiry.name,
    inquiry.email,
    inquiry.institution || '',
    inquiry.topic || 'General Academic Inquiry',
    inquiry.message,
    inquiry.status || 'unread',
    now
  );

  return {
    id,
    name: inquiry.name,
    email: inquiry.email,
    institution: inquiry.institution || '',
    topic: inquiry.topic || 'General Academic Inquiry',
    message: inquiry.message,
    status: inquiry.status || 'unread',
    createdAt: now
  };
}

export function updateInquiryStatus(id, status) {
  db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
  return { success: true, id, status };
}

export function deleteInquiry(id) {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
  return { success: true, id };
}

export default db;

