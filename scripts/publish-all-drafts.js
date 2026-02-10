import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function publishAllDrafts() {
  console.log('🚀 Publishing ALL reconstructed drafts...');
  
  try {
    await client.connect();

    // 1. Check count of drafts
    const resCount = await client.query('SELECT COUNT(*) FROM draft_articles');
    console.log(`📝 Total Drafts Found: ${resCount.rows[0].count}`);

    // 2. Update all to 'published'
    const resUpdate = await client.query(`
      UPDATE draft_articles 
      SET status = 'published', updated_at = NOW()
      WHERE status != 'published'
    `);

    console.log(`✅ Successfully published ${resUpdate.rowCount} articles.`);
    
  } catch (err) {
    console.error('❌ Error publishing drafts:', err);
  } finally {
    await client.end();
  }
}

publishAllDrafts();
