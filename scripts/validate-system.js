import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendTelegramMessage } from './notify-telegram.js';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

async function validateSystem() {
  const report = [];
  let status = 'SUCCESS';

  console.log('🚀 Iniciando Auto-Teste de Integridade (V12)...');

  // 1. Check Analytics & SEO Tags (Static Analysis)
  try {
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
    
    if (indexHtml.includes('G-DPQTFNGLBT')) {
      report.push('✅ Google Analytics: Ativo');
    } else {
      report.push('❌ Google Analytics: AUSENTE');
      status = 'ALERT';
    }

    if (indexHtml.includes('250FA0136F31D550EEC7BCF623ECC0BB')) {
      report.push('✅ Bing Validation: Ativo');
    } else {
      report.push('❌ Bing Validation: AUSENTE');
      status = 'ALERT';
    }
  } catch (e) {
    report.push(`❌ Erro ao ler index.html: ${e.message}`);
    status = 'ALERT';
  }

  // 2. Check Recon System Integrity
  try {
    // Check fallback DB presence
    const reconPath = path.join(ROOT_DIR, 'public/data/recon_results.json');
    if (fs.existsSync(reconPath)) {
      const data = JSON.parse(fs.readFileSync(reconPath, 'utf-8'));
      report.push(`✅ Recon Database: Online (${data.totalLinks || 0} links)`);
      report.push(`✅ Status Recon: ${data.status}`);
    } else {
      report.push('⚠️ Recon Database: Arquivo local não encontrado (Pode ser normal se Supabase for primário)');
    }

    // Check Dashboard Route Protection code
    const nginxConf = fs.readFileSync(path.join(ROOT_DIR, 'nginx.conf'), 'utf-8');
    if (nginxConf.includes('/dashboard-recon-2026-x') && nginxConf.includes('auth_basic')) {
      report.push('✅ Nginx Security: Rota Dashboard Blindada');
    } else {
      report.push('❌ Nginx Security: Rota Dashboard VULNERÁVEL ou não configurada');
      status = 'ALERT';
    }

  } catch (e) {
    report.push(`⚠️ Erro na verificação Recon: ${e.message}`);
  }

  // 3. Check App Routes
  try {
    const appTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/App.tsx'), 'utf-8');
    if (appTsx.includes('/dashboard-recon-2026-x')) {
      report.push('✅ React Router: Rota Dashboard configurada');
    } else {
      report.push('❌ React Router: Rota Dashboard incorreta');
      status = 'ALERT';
    }
  } catch (e) {
    report.push(`❌ Erro ao ler App.tsx: ${e.message}`);
    status = 'ALERT';
  }

  // Final Report Construction
  const timestamp = new Date().toISOString();
  const finalMessage = `
*RELATÓRIO DE INTEGRIDADE - V12*
📅 ${timestamp}
----------------------------------
${report.join('\n')}
----------------------------------
STATUS FINAL: *${status === 'SUCCESS' ? 'OPERACIONAL 🟢' : 'ATENÇÃO NECESSÁRIA 🔴'}*

_Sistema pronto para vigilância perpétua._
`;

  console.log(report.join('\n'));
  
  // Send to Telegram
  console.log('📡 Enviando relatório para o Comando...');
  await sendTelegramMessage(finalMessage, status);
  console.log('✅ Relatório enviado com sucesso.');
}

validateSystem();
