
import puppeteer from 'puppeteer';

(async () => {
  const PORT = 5174;
  console.log(`Starting diagnostic check for http://localhost:${PORT}/ ...`);
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Capture console logs
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`BROWSER ${msg.type().toUpperCase()}:`, msg.text());
      }
    });

    page.on('pageerror', error => {
      console.log('BROWSER PAGE CRASH:', error.message);
    });

    page.on('requestfailed', request => {
      console.log(`FAILED REQUEST: ${request.url()} - ${request.failure().errorText}`);
    });

    console.log('Navigating to page...');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 10000 });
    
    const title = await page.title();
    console.log('Page Title:', title);
    
    // Check for root element content
    const rootContent = await page.$eval('#root', el => el.innerHTML);
    if (!rootContent || rootContent.trim() === '') {
      console.error('CRITICAL: #root element is empty! (White Screen of Death)');
    } else {
      console.log('Root element has content. UI seems to have rendered.');
    }

    // Check specifically for Acervo section
    const acervoSection = await page.$('text/Acervos Digital');
    if (acervoSection) {
        console.log('SUCCESS: "Acervos Digital" section found on page.');
    } else {
        console.warn('WARNING: "Acervos Digital" section NOT found on page.');
    }

    await browser.close();
    console.log('Diagnostic check complete.');
    
  } catch (error) {
    console.error('DIAGNOSTIC FAILED:', error.message);
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.error('CAUSE: Server is likely not running. Please start the server.');
    }
  }
})();
