import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
const CHAT_ID = '7620121995';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get IP and Geo data (Vercel provides these headers)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const city = req.headers['x-vercel-ip-city'] || 'Desconhecida';
  const country = req.headers['x-vercel-ip-country'] || 'Desconhecido';
  const region = req.headers['x-vercel-ip-region'] || '?';
  const userAgent = req.headers['user-agent'] || 'Unknown Device';
  const referer = req.headers['referer'] || 'Direto';

  const message = `
🔔 *NOVO ACESSO AO SISTEMA*

📍 *Local:* ${city}, ${region} - ${country}
🌐 *IP:* \`${Array.isArray(ip) ? ip[0] : ip}\`
🔗 *Origem:* ${referer}
📱 *Device:* ${userAgent}
📅 *Data:* ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    res.status(200).json({ status: 'sent', data });
  } catch (error) {
    console.error('Telegram Error:', error);
    res.status(500).json({ status: 'error', error: String(error) });
  }
}
