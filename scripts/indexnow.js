import https from 'https';

const HOST = 'primos.mat.br';
const KEY = '250FA0136F31D550EEC7BCF623ECC0BB'; // Updated Key
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
const tgMessage = `🚀 *SEO INDEXING ALERT*

IndexNow Pings Sent:
${urlList.map(u => `- ${u}`).join('\n')}

Status: PENDING CONFIRMATION`;

const tgPath = `/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT}&text=${encodeURIComponent(tgMessage)}&parse_mode=Markdown`;

const tgOptions = {
  hostname: 'api.telegram.org',
  port: 443,
  path: tgPath,
  method: 'GET'
};

const tgReq = https.request(tgOptions, (res) => {
    // Silent
});
tgReq.on('error', (e) => console.error('Telegram Error:', e));
tgReq.end();
