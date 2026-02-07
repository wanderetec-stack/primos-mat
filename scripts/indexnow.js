import https from 'https';

const HOST = 'primos.mat.br';
const KEY = 'f8a92b23c4d5e6f7a8b9c0d1e2f3a4b5'; // Match the file created
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urlList = [
  `https://${HOST}/`,
  `https://${HOST}/sobre.html`,
  `https://${HOST}/privacidade.html`,
  `https://${HOST}/termos.html`
];

const data = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`IndexNow Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
console.log('🚀 IndexNow submission initiated...');

// Telegram Notification
const TG_TOKEN = '8205366262:AAEiaUGX8aZ7xjMwhEEdPIcJfBaBaFRQoxw';
const TG_CHAT = '7620121995';
const tgMessage = `🚀 *SEO INDEXING ALERT*%0A%0AIndexNow Pings Sent:%0A${urlList.map(u => `- ${u}`).join('%0A')}%0A%0AStatus: PENDING CONFIRMATION`;

const tgOptions = {
  hostname: 'api.telegram.org',
  port: 443,
  path: `/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT}&text=${tgMessage}&parse_mode=Markdown`,
  method: 'GET'
};

const tgReq = https.request(tgOptions, (res) => {
    // Silent
});
tgReq.end();

