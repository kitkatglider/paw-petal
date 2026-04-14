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
