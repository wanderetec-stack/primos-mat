const URL = "https://web.archive.org/cdx/search/cdx?url=primos.mat.br/*&output=json&limit=5";

async function check() {
  console.log('Testing CDX with User-Agent...');
  try {
    const res = await fetch(URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Data length:', text.length);
    console.log('First 100 chars:', text.substring(0, 100));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
