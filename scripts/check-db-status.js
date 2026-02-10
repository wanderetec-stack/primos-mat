
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

async function checkDb() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is missing.');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Conexão com Supabase estabelecida.');

    // Check scanned_urls (Dossiês Matemáticos)
    const res1 = await client.query('SELECT COUNT(*) FROM scanned_urls');
    console.log(`\n📊 Tabela 'scanned_urls' (Dossiês): ${res1.rows[0].count} registros.`);
    
    // Check recon_scans (Dashboard Recon)
    const res2 = await client.query('SELECT COUNT(*) FROM recon_scans');
    console.log(`📊 Tabela 'recon_scans' (Recon): ${res2.rows[0].count} registros.`);

    // Check last recon entry
    if (parseInt(res2.rows[0].count) > 0) {
      const lastRecon = await client.query('SELECT created_at, total_links, status FROM recon_scans ORDER BY created_at DESC LIMIT 1');
      console.log(`\n🕒 Último Recon: ${lastRecon.rows[0].created_at}`);
      console.log(`🔗 Total de Links: ${lastRecon.rows[0].total_links}`);
      console.log(`🟢 Status: ${lastRecon.rows[0].status}`);
    }

  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
  } finally {
    await client.end();
  }
}

checkDb();
