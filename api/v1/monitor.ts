import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
const CHAT_ID = '7620121995';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST or GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, ip, userAgent, path, title, duration, videoUrl } = req.body || req.query;

  let message = '';
  const clientIP = ip || req.headers['x-forwarded-for'] || 'Unknown';
  const ua = userAgent || req.headers['user-agent'] || 'Unknown';

  if (type === 'heartbeat') {
    return res.status(200).json({ status: 'alive', timestamp: Date.now() });
  } 
  
  switch (type) {
    case 'video_published':
      message = `🎬 *NOVO VÍDEO RENDERIZADO* %0A%0A` +
                `📺 Título: \`${title || 'Vídeo Didático'}\`%0A` +
                `⏱️ Duração: \`${duration || 'Unknown'}\`%0A` +
                `🔗 Arquivo: \`${videoUrl || 'N/A'}\`%0A` +
                `✅ Status: Enviado para Deploy`;
      break;

    case 'deploy_success':
      message = `🚀 *DEPLOY CONCLUÍDO* %0A%0A` +
                `✅ O site foi atualizado com sucesso.%0A` +
                `🌐 URL: https://primos.mat.br%0A` +
                `📅 Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
      break;

    case 'honeypot':
      message = `🚨 *ALERTA DE SEGURANÇA (HONEYPOT)* %0A%0A` +
                `📍 Path: \`${path || 'Unknown'}\`%0A` +
                `🕵️ IP: \`${clientIP}\`%0A` +
                `🤖 User-Agent: \`${ua}\`%0A` +
                `⚠️ Ação: Bloqueio Recomendado`;
      break;

    case 'alert': {
      const { alertType, detail, count } = req.body || req.query;
      message = `🛡️ *AVISO DE SEGURANÇA* %0A%0A` +
                `⚠️ Tipo: \`${alertType || 'General'}\`%0A` +
                `📝 Detalhe: ${detail || 'No details'}%0A` +
                `🔢 Ocorrências: ${count || 1}%0A` +
                `🕵️ IP: \`${clientIP}\``;
      break;
    }

    default: // Generic Visit
      message = `👤 *NOVO VISITANTE* %0A%0A` +
                `📍 Página: \`${path || 'Home'}\`%0A` +
                `🕵️ IP: \`${clientIP}\`%0A` +
                `🕒 Hora: ${new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
      break;
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
