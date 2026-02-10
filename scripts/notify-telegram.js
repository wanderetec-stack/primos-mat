import https from 'https';

// Credentials provided by operator Wander Santos
const TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
const CHAT_ID = '7620121995';

// Helper to send message
export const sendTelegramMessage = (message, type = 'INFO') => {
  const icon = type === 'ALERT' ? '🚨' : (type === 'SUCCESS' ? '✅' : 'ℹ️');
  const formattedMessage = `${icon} *SYSTEM NOTIFICATION*\n\n${message}`;
  
  const path = `/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(formattedMessage)}&parse_mode=Markdown`;

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: path,
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
};

// If run directly via node
if (process.argv[1] === import.meta.url || process.argv[1].endsWith('notify-telegram.js')) {
  const msg = process.argv[2] || 'Teste de notificação manual.';
  const type = process.argv[3] || 'INFO';
  sendTelegramMessage(msg, type)
    .then(() => console.log('Message sent.'))
    .catch(err => console.error('Failed:', err));
}
