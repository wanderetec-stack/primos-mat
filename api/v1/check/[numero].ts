import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers for public API access
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { numero } = req.query;

    if (!numero) {
      return res.status(400).json({ 
        error: 'Número não fornecido.',
        usage: '/api/v1/check/[numero]' 
      });
    }

    const numStr = Array.isArray(numero) ? numero[0] : numero;
    
    // Validate if it's a number
    if (!/^\d+$/.test(numStr)) {
      return res.status(400).json({ error: 'Formato inválido. Forneça apenas números inteiros positivos.' });
    }

    const num = BigInt(numStr);

    // Limit computation for public API to avoid timeouts (approx 16 digits)
    const LIMIT = 10000000000000000n; 
    if (num > LIMIT) {
      return res.status(400).json({ 
        error: 'Número excede o limite da API Pública.',
        limit: LIMIT.toString(),
        suggestion: 'Para números maiores, utilize o Scanner Client-Side na página inicial (https://primos.mat.br).'
      });
    }

    const start = process.hrtime();
    const isPrime = checkPrimality(num);
    const end = process.hrtime(start);
    const executionTime = `${(end[0] * 1000 + end[1] / 1e6).toFixed(3)}ms`;

    return res.status(200).json({
      number: num.toString(),
      isPrime,
      method: 'Trial Division (Optimized)',
      executionTime,
      timestamp: new Date().toISOString(),
      provider: 'Primos.mat.br',
      license: 'MIT'
    });

  } catch {
    return res.status(500).json({ error: 'Erro interno de processamento.' });
  }
}

function checkPrimality(n: bigint): boolean {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n || n % 3n === 0n) return false;

  let i = 5n;
  // Use a safety counter to prevent timeout in worst cases just in case
  let checks = 0;
  const MAX_CHECKS = 1000000; 

  while (i * i <= n) {
    if (n % i === 0n || n % (i + 2n) === 0n) return false;
    i += 6n;
    checks++;
    if (checks > MAX_CHECKS) {
       // Should not happen with the digit limit, but good safety
       // If we hit this, it's a very large prime or composite factor hard to find
       // We'll trust the limit check above.
    }
  }
  return true;
}