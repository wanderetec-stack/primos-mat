Write-Host "=== DEPLOY AUTOMATIZADO PRIMOS.MAT.BR ==="

Write-Host "1. Executando Build..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Falha no Build"; exit 1 }

$User = "root"
$Ip = "46.225.55.76"
$Dest = "/var/www/primos.mat.br"

Write-Host "2. Limpando diretório temporário na VPS..."
ssh -o BatchMode=yes -o ConnectTimeout=5 $User@$Ip "rm -rf /tmp/primos_dist"
if ($LASTEXITCODE -ne 0) { 
    Write-Warning "Não foi possível conectar via SSH automaticamente (chave pública não configurada?)."
    Write-Warning "Por favor, execute este script manualmente ou configure as chaves SSH."
    exit 1
}

Write-Host "3. Enviando arquivos para /tmp..."
scp -r dist "$User@$Ip`:/tmp/primos_dist"

Write-Host "4. Movendo arquivos para produção e ajustando permissões..."
ssh $User@$Ip "cp -r /tmp/primos_dist/* $Dest/ && chown -R www-data:www-data $Dest && chmod -R 755 $Dest && systemctl reload nginx"

Write-Host "=== DEPLOY CONCLUÍDO ==="
