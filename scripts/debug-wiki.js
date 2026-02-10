
import axios from 'axios';

const ENDPOINT = 'https://pt.wikipedia.org/w/api.php';
const TARGET = 'primos.mat.br';

const strategies = [
    {
        name: 'Strict Bot Policy',
        headers: { 'User-Agent': 'PrimosMatBot/1.0 (https://primos.mat.br; contato@primos.mat.br)' }
    },
    {
        name: 'Generic Browser (Chrome Windows)',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    },
    {
        name: 'Empty User-Agent',
        headers: { 'User-Agent': '' }
    },
    {
        name: 'Api-User-Agent Header',
        headers: { 
            'User-Agent': 'PrimosMatBot/1.0',
            'Api-User-Agent': 'PrimosMatBot/1.0 (https://primos.mat.br; contato@primos.mat.br)'
        }
    }
];

async function testStrategies() {
    console.log('--- Debugging Wikipedia Connection ---');
    
    for (const strat of strategies) {
        console.log(`\nTesting: ${strat.name}`);
        try {
            const response = await axios.get(ENDPOINT, {
                params: {
                    action: 'query',
                    list: 'search',
                    srsearch: `"${TARGET}"`,
                    format: 'json'
                },
                headers: strat.headers
            });
            
            console.log(`✅ SUCCESS! Status: ${response.status}`);
            console.log(`   Results found: ${response.data.query?.search?.length || 0}`);
        } catch (error) {
            console.log(`❌ FAILED. Status: ${error.response?.status || error.message}`);
            if (error.response?.data) {
                console.log(`   Reason: ${JSON.stringify(error.response.data)}`);
            }
        }
    }
}

testStrategies();
