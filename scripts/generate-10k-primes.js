
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function generatePrimes(count) {
    const primes = [];
    let num = 2;
    while (primes.length < count) {
        if (isPrime(num)) {
            primes.push(num);
        }
        num++;
    }
    return primes;
}

const primes = generatePrimes(10000);
// Format: one prime per line, or space separated? 
// Most scientific datasets use one per line or tab/space.
// Let's use space separated with line breaks every 10 primes for readability, 
// or just pure list. Given the filename 'primeiros_10000_primos.txt', 
// legacy format often was simple columns. 
// Let's make it a clean column list (one per line) which is safest for parsers.
const content = primes.join('\n');

const outputPath = path.resolve(__dirname, '../public/primeiros_10000_primos.txt');

fs.writeFileSync(outputPath, content);
console.log(`Generated ${primes.length} primes at ${outputPath}`);
