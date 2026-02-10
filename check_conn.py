import socket
import requests
import sys

log_file = "conn_log.txt"

def log(msg):
    with open(log_file, "a") as f:
        f.write(msg + "\n")
    print(msg)

log("=== TESTE DE CONEXÃO INICIADO ===")
target_ip = "85.209.2.196"
ports = [80, 443, 8080]

for port in ports:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(5)
    result = sock.connect_ex((target_ip, port))
    if result == 0:
        log(f"Porta {port}: ABERTA (Sucesso)")
    else:
        log(f"Porta {port}: FECHADA (Erro: {result})")
    sock.close()

try:
    log("Tentando HTTP GET na porta 80...")
    response = requests.get(f"http://{target_ip}/", timeout=5)
    log(f"HTTP GET: Sucesso (Status {response.status_code})")
except Exception as e:
    log(f"HTTP GET: Falhou ({e})")

log("=== FIM DO TESTE ===")
