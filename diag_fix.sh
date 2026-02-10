#!/bin/bash
# Script de Diagnóstico e Correção Automática v2
LOG="/root/diag_fix_v2.log"
exec > >(tee -a $LOG) 2>&1

echo "=== INICIO DIAGNOSTICO $(date) ==="

# 1. Garantir que UFW está DESATIVADO (para isolar problema na Hetzner)
echo "[1] Desativando UFW..."
ufw disable

# 2. Limpar todas as regras de IPTables (Flush total)
echo "[2] Limpando IPTables..."
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

# 3. Verificar quem está ouvindo na porta 80 e 443
echo "[3] Verificando Portas (Netstat)..."
netstat -tuln | grep -E '(:80|:443)'

# 4. Testar Nginx Localmente
echo "[4] Teste Nginx Local (Curl)..."
curl -I -m 5 http://127.0.0.1
curl -I -m 5 http://localhost

# 5. Verificar IPs da máquina
echo "[5] Endereços IP..."
ip addr show

echo "=== FIM DIAGNOSTICO ==="
