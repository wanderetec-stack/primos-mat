import asyncio
import edge_tts
import os

VOICE = "pt-BR-AntonioNeural"

articles = {
    "teoria_numeros": """
    Teoria dos Números: Exploração Pura das Propriedades dos Inteiros e sua Distribuição.
    
    Carl Friedrich Gauss, um dos maiores matemáticos de todos os tempos, chamou a Teoria dos Números de "A Rainha da Matemática". Por séculos, ela foi considerada uma disciplina de beleza pura, sem aplicações práticas. "A ciência para a glória do espírito humano", diziam. Ironicamente, hoje ela é a base invisível de toda a nossa sociedade digital.
    
    O Teorema Fundamental da Aritmética.
    Tudo começa com uma verdade simples, mas profunda: todo número inteiro maior que 1 ou é primo ou pode ser escrito como um produto único de números primos. Pense nisso. Os números primos são os "átomos" da aritmética. O número 12 não é fundamental; ele é feito de 2 vezes 2 vezes 3. Mas o 7? O 7 é indivisível.
    
    A Distribuição dos Primos.
    Os primos parecem aparecer aleatoriamente. 2, 3, 5, 7, 11... Às vezes há grandes lacunas entre eles. Às vezes eles vêm em pares. Existe um padrão? Gauss percebeu que a densidade dos primos diminui à medida que os números aumentam, seguindo uma lei logarítmica. O Teorema do Número Primo afirma que a quantidade de primos menores que x é aproximadamente x dividido pelo logaritmo natural de x.
    
    A Hipótese de Riemann.
    Aqui entramos no "Santo Graal" da matemática. Bernhard Riemann, em 1859, conectou a distribuição dos primos à Função Zeta de Riemann. A hipótese afirma que todos os "zeros não triviais" dessa função têm uma parte real igual a meio. Se verdadeira, ela implica que os números primos são distribuídos da maneira mais regular possível. Há um prêmio de 1 Milhão de Dólares do Instituto Clay para quem provar isso.
    
    A Espiral de Ulam.
    Em 1963, Stanislaw Ulam estava entediado em uma conferência e começou a rabiscar números em uma espiral. Quando circulou os primos, percebeu que eles tendiam a se alinhar em linhas diagonais, revelando padrões ocultos na distribuição dos primos.
    
    Primos de Mersenne.
    Os maiores números primos conhecidos são quase todos de Mersenne, da forma 2 elevado a p menos 1. O projeto GIMPS usa computação distribuída para caçar esses gigantes.
    
    Conclusão.
    A Teoria dos Números é um vasto oceano. O estudo dos inteiros continua sendo a fronteira final da matemática pura.
    """,
    
    "performance": """
    Performance Extrema: Otimização Matemática no Front-end Moderno.
    
    No desenvolvimento web moderno, "rápido" não é mais um diferencial, é o padrão mínimo aceitável. Quando trazemos cálculos matemáticos complexos para o navegador — como criptografia ou fatoração de primos — entramos em um território onde cada ciclo de CPU conta.
    
    A Complexidade Assintótica.
    A notação Big O é a linguagem universal para descrever a eficiência de um algoritmo. A diferença entre uma solução linear e quadrática pode significar a diferença entre uma resposta em 100 milissegundos e uma resposta em 100 anos. Otimizar a lógica matemática, como usar algoritmos probabilísticos tipo Miller-Rabin, é o primeiro passo.
    
    JavaScript Engine: V8 e JIT Compilation.
    O motor V8 usa compilação Just-In-Time. O código é monitorado e recompilado dinamicamente. Manter a estrutura dos objetos consistente (Hidden Classes) permite que o motor reutilize código otimizado, resultando em ganhos massivos.
    
    Web Workers: Paralelismo Real.
    O JavaScript é single-threaded. Web Workers permitem criar threads reais em segundo plano. Isso é vital para nossa aplicação: a interface fica livre a 60 quadros por segundo enquanto um Worker processa números pesados em segundo plano. O uso de SharedArrayBuffer permite compartilhar memória sem cópias.
    
    WebAssembly (Wasm): O Próximo Nível.
    WebAssembly é um formato de instrução binária para uma máquina virtual baseada em pilha. Ao reescrever algoritmos críticos em Rust e compilá-los para Wasm, obtemos performance previsível, tipagem estática e tamanho compacto. Em nossos testes, o Crivo de Eratóstenes em Wasm foi até 10 vezes mais rápido que em JavaScript puro.
    
    Gerenciamento de Memória.
    Para dados numéricos massivos, TypedArrays como Uint32Array são essenciais. Eles alocam memória contígua, similar a C, evitando o overhead do Garbage Collector e aproveitando melhor o cache da CPU.
    
    Conclusão.
    O navegador moderno é um sistema operacional distribuído capaz de processamento científico. O limite não é mais a tecnologia, mas nossa capacidade de arquitetar soluções que explorem esse potencial.
    """,
    
    "criptografia": """
    Criptografia RSA e Segurança Digital: Fundamentação Matemática.
    
    A criptografia moderna não é apenas sobre esconder segredos; é a espinha dorsal de confiança da internet. Cada vez que você acessa sua conta bancária, você está confiando em teoremas matemáticos descobertos há séculos.
    
    A Revolução da Chave Pública.
    Até a década de 70, a criptografia exigia a troca prévia de chaves secretas. Diffie, Hellman e o algoritmo RSA mudaram isso com o conceito de chaves públicas e privadas. É como uma caixa de correio: qualquer um pode colocar uma carta, mas só quem tem a chave pode abrir.
    
    O Algoritmo RSA.
    O RSA baseia sua segurança na dificuldade de fatorar números inteiros grandes. Multiplicar dois primos gigantes é fácil; descobrir quais são eles a partir do resultado é computacionalmente inviável. A matemática envolve a função totiente de Euler e aritmética modular.
    
    Curvas Elípticas (ECC).
    Enquanto o RSA exige chaves enormes, a Criptografia de Curvas Elípticas consegue a mesma segurança com chaves muito menores. Ela se baseia na dificuldade do problema do Logaritmo Discreto em curvas algébricas. É o padrão usado em criptomoedas como Bitcoin.
    
    A Ameaça Quântica.
    O algoritmo de Shor, executado em um computador quântico, poderia quebrar o RSA e a ECC rapidamente. Isso gerou a corrida pela Criptografia Pós-Quântica, baseada em reticulados e outros problemas matemáticos resistentes a ataques quânticos.
    
    Implementação Prática: HTTPS e TLS 1.3.
    Na prática, usamos um sistema híbrido. O handshake usa criptografia assimétrica para trocar uma chave, e depois usamos criptografia simétrica rápida, como AES, para transmitir os dados. O TLS 1.3 tornou isso ainda mais rápido e seguro.
    
    Conclusão.
    A criptografia é uma eterna corrida entre criadores e quebradores de códigos. Entender a matemática por trás é essencial para construir sistemas resilientes.
    """
}

async def generate_audio():
    os.makedirs("public/audio", exist_ok=True)
    
    for key, text in articles.items():
        output_file = f"public/audio/{key}.mp3"
        print(f"Generating {output_file}...")
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(output_file)
        print(f"Saved {output_file}")

if __name__ == "__main__":
    asyncio.run(generate_audio())
