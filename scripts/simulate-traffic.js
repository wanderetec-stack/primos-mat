
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup Env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL });

async function simulateTraffic() {
  try {
    await client.connect();
    console.log('🤖 [SIMULATOR] Connecting to Database...');

    const fakeUrl = '/teoria-dos-numeros-perdida-v1';
    
    // Insert Fake 404
    await client.query(`
      INSERT INTO traffic_logs (url, referrer, user_agent, ip, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [
      fakeUrl,
      'https://pt.wikipedia.org/wiki/Primos',
      'Mozilla/5.0 (Simulation Bot)',
      '127.0.0.1'
    ]);

    console.log(`✅ [SIMULATOR] Injected fake 404 visit to: ${fakeUrl}`);
    console.log('   Now run the archaeologist script to see if it picks it up!');

  } catch (err) {
    console.error('Simulation Error:', err);
  } finally {
    await client.end();
  }
}

simulateTraffic();
