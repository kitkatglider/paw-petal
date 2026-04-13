import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function openDb() {
  if (!db) {
    db = await open({
      filename: './paws_and_petals.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
}