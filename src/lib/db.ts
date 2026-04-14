// lib/tursoDb.ts
import { Client, createClient } from '@libsql/client';

type RunResult = { lastID?: number; changes: number };
type Row = Record<string, any>;

let client: Client | null = null;

function getClient() {
  if (!client) {
    const url = process.env.TURSO_URL  ?? "file:paws_and_petals.sqlite";
    const token = process.env.TURSO_TOKEN;
    // if (!url || !token) throw new Error('TURSO_URL and TURSO_TOKEN must be set in env');
    client = createClient({ url, authToken: token });
  }
  return client;
}

export async function openDb() {
  const c = getClient();

  return {
    // Executes a statement and returns a result similar to sqlite3.run
    async run(sql: string, params?: any[] | Record<string, any>): Promise<RunResult> {
      const res = await c.execute(sql, params);
      // libSQL returns metadata in res.metadata (may vary); use res.rowsAffected if present
      const changes = Number(res.rowsAffected || 0);
      // libSQL doesn't expose lastInsertRowid over HTTP; try to extract from rows if RETURNING used
      let lastID: number | undefined = undefined;
      if (res?.rows && res.rows.length > 0) {
        const r0 = res.rows[0] as Row;
        if (r0.id || r0.last_insert_rowid || r0.lastInsertRowid) {
          lastID = Number(r0.id ?? r0.last_insert_rowid ?? r0.lastInsertRowid);
        }
      }
      return { lastID, changes };
    },

    // Returns first row or undefined
    async get<T = Row>(sql: string, params?: any[] | Record<string, any>): Promise<T | undefined> {
      const res = await c.execute(sql, params);
      return (res.rows && res.rows.length > 0) ? (res.rows[0] as T) : undefined;
    },

    // Returns all rows
    async all<T = Row>(sql: string, params?: any[] | Record<string, any>): Promise<T[]> {
      const res = await c.execute(sql, params);
      return (res.rows ?? []) as T[];
    },

    // Execute one or more statements; returns void to match sqlite's exec
    async exec(sql: string): Promise<void> {
      // libSQL execute can handle a single statement; for multiple statements split by ";".
      // This split is simple and assumes no semicolons inside strings.
      const stmts = sql.split(';').map(s => s.trim()).filter(Boolean);
      for (const s of stmts) {
        await c.execute(s);
      }
    },

    // close is a no-op for HTTP client but keep for compatibility
    async close(): Promise<void> {
      // no persistent connection to close for the HTTP client
      client = null;
    }
  };
}

async function setup() {
  const db = await openDb()

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      description TEXT,
      image_url TEXT,
      badge TEXT,
      flavor TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT 
    );

   CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT,
      total REAL,
      date TEXT,
      items TEXT
    );
  `);

  // Insert two pre-existing users
  await db.run(`INSERT OR IGNORE INTO users (email, password) VALUES 
    ('alex@tailored.com', 'password123'),
    ('sam@petals.com', 'password456')
  `);

  // Insert mock products if empty
  const count = await db.get('SELECT COUNT(*) as count FROM products');
  if (count.count === 0) {
    await db.run(`INSERT INTO products (name, price, description, image_url, badge, flavor) VALUES 
      ('Wilderness Blend: Pacific Salmon', 42.00, 'Grain-free holistic recipe with wild-caught salmon and prebiotic fiber for sensitive digestion.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7IFbxlz5dbSaWGetOp3dgygy1ccNjPYfQzmPFUkfbH5xZCYud8rhoYwX0fqwquZ0J4ci6njwmhws1LBi4kUROck_IsCMi8GC0uLwW3UrPoNB2H655vdODC1wckhkdmWmHrlPKM5wMR-u5ixqu2QMnCdJe8wx8JxoBZ-4hSvCs-vCVCrwpFmk7y2nyn3GAxHjklMOGzSj4J28AbTLZCoH3FbgAL6juWF-NixMa6nPQzswuyw1R_Qd7IMWxeJgC-T6LruwoPvjyR4e8', 'New Arrival', 'Wild Salmon'),
      ('Heritage Grain: Pasture Beef', 38.50, 'Slow-roasted grass-fed beef with ancient grains and farm-fresh spinach.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdUoR0QNEygzOVBK4rjMyomSqgUZT4pBVS6RM_UctuOGApfmbcfnXQinS6c4fJSzUURh-4QBxQr4-6TU_Y21yeRV5OhjBeSekpPSLdzmzQEyQ9H8HXMp-xObJuCUJ7URabvwihCH-kM45lre0shlL5U5WdzBZUin3aFgBLR0DRtKJQMj-CESf1FzNsnOS46oQmgXlnYpLcj_6stkvdPnWrVh-Je1m6wk_KtaCGsshRe6yOpuGr0FZX_RsEK7480p59Mvh6Zl5gTDuS', NULL, 'Grass-Fed Beef'),
      ('Vitality Plus: Senior Wellness', 45.00, 'Enhanced with glucosamine and chondroitin for joint health and mobility in aging dogs.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmWDLZ5dgseZrqL39gE40YCQYLnONi6B8fQk-klwzA7qNXjr6gkF3JWaupO3t5kuDJdgO5w5CXSgUgKi2cngsYErS8xcj4aewgX_YG_m4hemM0RPasn73gpauUK7DVBlrSigvesebHMgIc74MDKGjaxGZOua6TAUTu4uX_H8flD4I1sMPcFTnJbkGM0UfnuWbKQGSaXlX1z4qPjkPKszX8Bl7RMAlifWmLnSvCbQz2xIuf6l4cy1JTjkv5x_DDnIPzKUfdryyoM7O0', 'Bestseller', 'Mixed'),
      ('Petite Plate: Free-Range Chicken', 29.99, 'Small kibble size perfect for petite jaws, packed with protein and antioxidants.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuM9BGU6Xj4rnJbyFuluw1vr9H0KNbOSwFGpnanO_ksIvioasyqquoiaQeL9hNv60pU4o5CXVrFmYE8Um0-GBSQllaJAnaj1_8nn17TZZNXs28E99yonzM5d3Y22hBPZqVeZg6LulFYL2FKBaH0NCyecuA6kRB0tb0lTBLlJEg8pxiquGN4pA_AN6hboV0eUMqoVdKsGb5cVza_vb3-ujWwmugn7HuSDY3cOPVo3OL_87hiwfgz89nCTDki6i9R56H-b3jnTDNyHot', NULL, 'Free-Range Chicken')
    `);
  }
  console.log('Database seeded!');
}
await setup()