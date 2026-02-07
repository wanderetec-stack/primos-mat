import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Allow simple GET for testing or POST
  const { message, type } = req.query; // or body
  const text = message || req.body?.message || 'No message provided';
  const alertType = type || req.body?.type || 'INFO';

  const TG_TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
  const TG_CHAT = '7620121995';

  let emoji = 'ℹ️';
  if (alertType === 'SECURITY') emoji = '🚨';
  if (alertType === 'HEARTBEAT') emoji = '💓';
  if (alertType === 'INDEX') emoji = '🚀';

  const formattedMessage = `${emoji} *SYSTEM ALERT: ${alertType}*%0A%0A${text}`;

  const tgOptions = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT}&text=${encodeURIComponent(formattedMessage)}&parse_mode=Markdown`,
    method: 'GET'
  };

  const tgReq = https.request(tgOptions, (tgRes) => {
    res.status(200).json({ status: 'Notification sent' });
  });

  tgReq.on('error', (e) => {
    res.status(500).json({ error: 'Failed to send notification' });
  });

  tgReq.end();
}
