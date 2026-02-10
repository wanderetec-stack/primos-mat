import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const EXTERNAL_FINDINGS = [
  {
    url: '/50mi.html', // The target on our site
    title: 'Cálculo de números primos: colocações iniciais', // Title of the referring page
    source: 'Universidade Federal do Rio Grande do Sul (UFRGS)', // Who is linking
    scan_data: JSON.stringify({
      referrer_url: 'http://www.mat.ufrgs.br/~portosil/pqprimo.html',
      context: 'Referência acadêmica em página de teoria dos números.',
      authority: 'High (Educational)'
    })
  },
  {
    url: '/Ate100G.html', // Target
    title: 'Número primo - Ligações Externas',
    source: 'Wikipedia (PT)',
    scan_data: JSON.stringify({
      referrer_url: 'https://pt.wikipedia.org/wiki/N%C3%BAmero_primo',
      context: 'Citado na seção de referências e links externos.',
      authority: 'High (Wiki)'
    })
  }
];

async function feedExternalData() {
  console.log('📡 Feeding External Radar Data...');
  await client.connect();

  try {
    let count = 0;
    for (const item of EXTERNAL_FINDINGS) {
      // Manual Upsert
      const check = await client.query('SELECT id FROM scanned_urls WHERE url = $1', [item.url]);
      
      if (check.rows.length > 0) {
        // Update existing
        await client.query(`
          UPDATE scanned_urls 
          SET title = $1, source = $2, status = 'referência_externa', scan_data = $3
          WHERE url = $4
        `, [item.title, item.source, item.scan_data, item.url]);
        console.log(`🔄 Updated info for ${item.url}`);
      } else {
        // Insert new
        await client.query(`
          INSERT INTO scanned_urls (url, title, source, status, scan_data, created_at)
          VALUES ($1, $2, $3, 'referência_externa', $4, NOW())
        `, [item.url, item.title, item.source, item.scan_data]);
        console.log(`✨ Inserted new reference for ${item.url}`);
      }
      count++;
    }

    console.log(`✅ Processed ${count} external references.`);

  } catch (err) {
    console.error('❌ Error feeding external data:', err);
  } finally {
    await client.end();
  }
}

feedExternalData();
