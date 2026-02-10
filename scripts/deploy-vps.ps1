
# ==========================================
# SCRIPT DE DEPLOY AUTOMÁTICO (VPS + DB)
# ==========================================

$VPS_IP = "85.209.2.196"
$USER = "root"
$REPO_URL = "https://github.com/wanderetec-stack/primos-mat.git"
$APP_DIR = "/root/primos_mat"

# Conteúdo do .env
$ENV_CONTENT = "VITE_SUPABASE_URL=https://vnrufmtdzvduqaqommla.supabase.co`nVITE_SUPABASE_ANON_KEY=sb_publishable_5UmdAzhjGiGxMqNKpPEwxA_V4jos5kv`nDATABASE_URL=postgresql://postgres:nAOtxu6uLsaE7q87@db.vnrufmtdzvduqaqommla.supabase.co:5432/postgres"

Write-Host "Iniciando Deploy na VPS ($VPS_IP)..." -ForegroundColor Cyan

# Função wrapper para SSH
function Run-SSH {
    param([string]$RemoteCmd)
    Write-Host "Executando: $RemoteCmd" -ForegroundColor DarkGray
    # Executa ssh direto. Aspas duplas no $RemoteCmd garantem que seja um único argumento.
    ssh -o BatchMode=yes -o StrictHostKeyChecking=no $USER@$VPS_IP "$RemoteCmd"
}

# 1. Instalar dependências do sistema
Write-Host "1. Instalando dependências do sistema..." -ForegroundColor Yellow
Run-SSH "apt-get update -y && apt-get install -y curl git nginx certbot python3-certbot-nginx"
Run-SSH "curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs"

# 2. Clonar ou Atualizar
Write-Host "2. Sincronizando código..." -ForegroundColor Yellow
# Lógica simplificada: remove e clona de novo para garantir estado limpo (ou tenta pull)
# Vamos usar a lógica de verificação de diretório segura
$GIT_CMD = "if [ -d $APP_DIR ]; then cd $APP_DIR && git reset --hard && git pull; else git clone $REPO_URL $APP_DIR; fi"
Run-SSH $GIT_CMD

# 3. Build do Projeto
Write-Host "3. Construindo projeto (npm install & build)..." -ForegroundColor Yellow
Run-SSH "cd $APP_DIR && npm install && npm run build"

# 4. Configurar .env
Write-Host "4. Criando arquivo .env..." -ForegroundColor Yellow
# Usamos printf para garantir quebras de linha corretas
Run-SSH "printf '$ENV_CONTENT' > $APP_DIR/.env"

# 5. Configurar Nginx
Write-Host "5. Configurando Nginx..." -ForegroundColor Yellow
# Upload do arquivo conf
$SCP_DEST = "$USER@${VPS_IP}:/etc/nginx/sites-available/primos"
scp nginx.conf $SCP_DEST
# Links e Restart
Run-SSH "ln -sf /etc/nginx/sites-available/primos /etc/nginx/sites-enabled/"
Run-SSH "rm -f /etc/nginx/sites-enabled/default"
Run-SSH "touch /etc/nginx/.htpasswd"
Run-SSH "nginx -t && systemctl restart nginx"

# 6. Configurar Cron Job
Write-Host "6. Configurando Cron Job..." -ForegroundColor Yellow
$CRON_CMD = "0 9 * * * cd $APP_DIR && /usr/bin/node scripts/push-recon-to-db.js >> /var/log/primos-cron.log 2>&1"
Run-SSH "(crontab -l 2>/dev/null; echo '$CRON_CMD') | sort -u | crontab -"

Write-Host "DEPLOY CONCLUIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "Acesse: https://primos.mat.br"
