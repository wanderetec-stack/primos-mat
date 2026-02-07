import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

// Simple in-memory store (will reset on cold starts, but good enough for now)
// For persistence, we would need Vercel KV or a database.
// This is a "Stateless Heartbeat" that just notifies on every visit for now (as requested "Contagem de usuários" is hard without DB)
// or we can just send a "Pulse".

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { page } = req.query;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Rate limiting logic could go here to avoid spamming telegram
  // For now, we'll just log it silently or send a "Pulse" if it's a new session.
  
  const TG_TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
  const TG_CHAT = '7620121995';

  // Only notify for Home page to reduce noise, or if explicitly requested
  const message = `💓 *USER HEARTBEAT*%0A%0ANew Session Active%0A- Page: ${page || 'Home'}%0A- IP: ${ip || 'Unknown'}`;

  const tgOptions = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT}&text=${message}&parse_mode=Markdown`,
    method: 'GET'
  };

  const tgReq = https.request(tgOptions, (tgRes) => {
    res.status(200).json({ status: 'recorded' });
  });
  
  tgReq.on('error', () => {
    res.status(200).json({ status: 'recorded' }); // Don't fail the client
  });

  tgReq.end();
}
