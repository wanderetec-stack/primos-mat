import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const path = req.url || 'unknown';

  const TG_TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
  const TG_CHAT = '7620121995';

  const message = `🚨 *SECURITY ALERT*%0A%0AUnauthorized Access Attempt Detected!%0A%0A- Path: \`${path}\`%0A- IP: \`${ip}\`%0A- User-Agent: \`${req.headers['user-agent']}\`%0A%0AAction: BLOCKED`;

  const tgOptions = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT}&text=${message}&parse_mode=Markdown`,
    method: 'GET'
  };

  const tgReq = https.request(tgOptions, () => {
     // Return a fake 404 or 403 to the attacker
    res.status(404).send('Not Found');
  });

  tgReq.on('error', () => {
    res.status(404).send('Not Found');
  });

  tgReq.end();
}
