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

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { type, details, count } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const message = `
⚠️ *ALERTA DE SEGURANÇA: ${type}*

🛑 *Ação Suspeita Detectada*
🔢 *Tentativas:* ${count || 'N/A'}
📝 *Detalhes:* ${details || 'Sem detalhes'}
🌐 *IP Origem:* \`${Array.isArray(ip) ? ip[0] : ip}\`
📅 *Data:* ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

_O sistema bloqueou ou limitou esta ação._
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    res.status(200).json({ status: 'alert_sent' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: String(error) });
  }
}
