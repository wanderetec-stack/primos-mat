import asyncio
import edge_tts
import os

# Voice constant
VOICE = "pt-BR-AntonioNeural"  # Male voice, very natural
# Alternative: "pt-BR-FranciscaNeural" for female voice

# Text content for the 3 articles
TEXT_CRIPTO = """
Fundamentação Matemática para Protocolos de Segurança Digital Modernos.
Uma análise profunda sobre como a Teoria dos Números protege trilhões de dólares diariamente, do RSA às Curvas Elípticas e a era Pós-Quântica.

A criptografia moderna não é apenas sobre esconder segredos; é a espinha dorsal de confiança da internet. Cada vez que você acessa sua conta bancária, envia uma mensagem no WhatsApp ou realiza uma compra online, você está confiando em teoremas matemáticos descobertos há séculos, agora aplicados em silício. Neste artigo técnico, vamos dissecar os mecanismos que tornam isso possível, focando na elegância matemática e na implementação prática.

1. A Revolução da Chave Pública.
Até meados da década de 1970, a criptografia era simétrica: para Alice enviar uma mensagem segura para Bob, eles precisavam ter trocado previamente uma chave secreta. Isso gerava um problema logístico massivo. Como estabelecer uma chave segura em um canal inseguro?
A solução veio com Diffie, Hellman e Merkle, e posteriormente com Rivest, Shamir e Adleman (RSA). A ideia revolucionária foi dividir a chave em duas partes: uma pública (para encriptar) e uma privada (para decriptar).

O Conceito da Função Trapdoor.
Imagine uma caixa de correio. Qualquer pessoa pode colocar uma carta nela (Chave Pública), mas apenas o carteiro com a chave mestra pode abri-la e retirar as cartas (Chave Privada). Matematicamente, isso depende de funções que são fáceis de calcular em uma direção, mas computacionalmente inviáveis de reverter sem uma informação especial.

2. O Algoritmo RSA: Matemática Pura.
O RSA baseia sua segurança na dificuldade de fatorar números inteiros grandes. Se eu te der o número 15, você rapidamente me diz que seus fatores primos são 3 e 5. Mas se eu te der um número com 600 dígitos, nem todos os computadores da Terra trabalhando juntos por um milhão de anos conseguiriam encontrar seus fatores primos a tempo.

Gerando Chaves RSA.
O processo segue passos matemáticos precisos:
Primeiro, escolha dois números primos gigantes, p e q.
Segundo, calcule n = p vezes q. O número n será o módulo da chave pública e privada. O tamanho de n em bits determina a segurança (ex: 2048 ou 4096 bits).
Terceiro, calcule a função totiente de Euler.
Quarto, escolha um inteiro "e" tal que seja coprimo a função totiente. Geralmente, e = 65537 é escolhido por eficiência.
Quinto, calcule "d" tal que d vezes e seja congruente a 1 módulo totiente. Este d é o expoente privado.

A chave pública é o par (n, e). A chave privada é o par (n, d).

3. Curvas Elípticas (ECC): O Futuro Eficiente.
Enquanto o RSA exige chaves de 2048 ou 4096 bits para ser seguro, a Criptografia de Curvas Elípticas (ECC) consegue o mesmo nível de segurança com chaves muito menores (ex: 256 bits). Isso é crucial para dispositivos móveis e IoT, onde processamento e bateria são limitados.
A ECC baseia-se na estrutura algébrica de curvas elípticas sobre corpos finitos.
Bitcoin e Ethereum, por exemplo, usam a curva secp256k1 para gerar endereços e assinar transações.

4. A Ameaça Quântica e Algoritmo de Shor.
Toda a segurança do RSA e da ECC baseia-se na premissa de que computadores clássicos são ineficientes para resolver fatoração e logaritmos discretos. No entanto, em 1994, Peter Shor desenvolveu um algoritmo quântico que pode resolver esses problemas em tempo polinomial.
Isso significa que, se (ou quando) um computador quântico suficientemente potente e estável for construído, ele quebrará quase toda a criptografia atual da internet instantaneamente.
Isso gerou uma corrida pela Criptografia Pós-Quântica (PQC).

5. Implementação Prática: HTTPS e TLS 1.3.
Na prática, não usamos RSA para encriptar todo o tráfego da internet porque ele é lento. Usamos um sistema híbrido.
Handshake: Quando você acessa este site, seu navegador e o servidor usam criptografia assimétrica para negociar uma chave de sessão compartilhada.
Autenticação: O servidor prova sua identidade enviando um Certificado Digital assinado por uma Autoridade Certificadora.
Túnel Seguro: Uma vez estabelecida a chave de sessão, a comunicação muda para criptografia simétrica (como AES-256), que é incrivelmente rápida.

Conclusão.
A criptografia é um campo dinâmico, uma eterna corrida de gato e rato entre criptoanalistas e criptógrafos. Enquanto a matemática fundamental permanece sólida, as implementações evoluem. Para desenvolvedores e engenheiros, entender esses conceitos não é apenas acadêmico – é uma responsabilidade profissional para construir sistemas seguros e resilientes.
"""

TEXT_TEORIA = """
Exploração Pura das Propriedades dos Inteiros e sua Distribuição.
De Euclides à Hipótese de Riemann: uma jornada pelos mistérios dos números primos, os blocos fundamentais de construção do universo matemático.

Carl Friedrich Gauss, um dos maiores matemáticos de todos os tempos, chamou a Teoria dos Números de "A Rainha da Matemática". Por séculos, ela foi considerada uma disciplina de beleza pura, sem aplicações práticas. "A ciência para a glória do espírito humano", diziam. Ironicamente, hoje ela é a base invisível de toda a nossa sociedade digital. Mas neste artigo, vamos nos afastar das aplicações e mergulhar na beleza intrínseca dos números.

1. O Teorema Fundamental da Aritmética.
Tudo começa com uma verdade simples, mas profunda: todo número inteiro maior que 1 ou é primo ou pode ser escrito como um produto único de números primos.
Pense nisso. Os números primos (2, 3, 5, 7, 11...) são os "átomos" da aritmética. O número 12 não é fundamental; ele é feito de 2 vezes 2 vezes 3. O número 21 é 3 vezes 7. Mas o 7? O 7 é indivisível. Ele é um bloco de construção elementar.
A unicidade dessa fatoração é o que garante que a matemática "funcione".

2. A Distribuição dos Primos.
Os primos parecem aparecer aleatoriamente. 2, 3, 5, 7, 11, 13, 17... Às vezes há grandes lacunas entre eles. Às vezes eles vêm em pares (Primos Gêmeos), como 11 e 13, ou 41 e 43.
Existe um padrão? Gauss, aos 15 anos, percebeu que a densidade dos primos diminui à medida que os números aumentam, seguindo uma lei logarítmica. Isso culminou no Teorema do Número Primo, que afirma que a quantidade de primos menores que um número x é aproximadamente x dividido pelo logaritmo natural de x.
Isso significa que existe uma ordem estatística emergindo do caos aparente.

3. A Hipótese de Riemann.
Aqui entramos no "Santo Graal" da matemática. Bernhard Riemann, em 1859, conectou a distribuição dos primos à Função Zeta de Riemann.
A hipótese afirma que todos os "zeros não triviais" dessa função têm uma parte real igual a 1/2.
Por que isso importa? Se a Hipótese de Riemann for verdadeira, ela implica que os números primos são distribuídos da maneira mais regular possível. Se for falsa, o universo dos números tem irregularidades caóticas que desconhecemos. Há um prêmio de 1 Milhão de Dólares do Instituto Clay para quem provar ou refutar isso.

4. A Espiral de Ulam.
Em 1963, o matemático Stanislaw Ulam estava entediado em uma conferência científica. Ele começou a rabiscar números em uma espiral em seu caderno.
Quando ele circulou os números primos, percebeu algo chocante: eles tendiam a se alinhar em linhas diagonais. Isso sugere que existem polinômios quadráticos que geram primos com frequência muito maior que o aleatório.
A Espiral de Ulam é uma visualização gráfica que transforma a aridez dos números em uma estrutura quase orgânica.

5. Primos de Mersenne e a Busca Computacional.
Um primo de Mersenne é um primo da forma 2 elevado a p, menos 1.
Os maiores números primos conhecidos pela humanidade são quase todos de Mersenne. Isso porque existe um teste de primalidade extremamente eficiente para eles, o Teste de Lucas-Lehmer. O projeto GIMPS usa computação distribuída para caçar esses gigantes.

Conclusão.
A Teoria dos Números é um vasto oceano. Apenas molhamos os pés. De conjecturas simples que uma criança pode entender até as complexidades da análise complexa de Riemann, o estudo dos inteiros continua sendo a fronteira final da matemática pura.
"""

TEXT_PERFORMANCE = """
Performance Extrema: Otimização Matemática no Front-end Moderno.
No desenvolvimento web moderno, "rápido" não é mais um diferencial, é o padrão mínimo aceitável. Quando trazemos cálculos matemáticos complexos para o navegador — como criptografia, fatoração de primos ou renderização de fractais — entramos em um território onde cada ciclo de CPU conta. Este artigo explora como transformar o navegador em uma supermáquina de cálculo.

A Complexidade Assintótica: O Pesadelo Big O.
Antes de otimizar código, precisamos otimizar a lógica. A notação Big O é a linguagem universal para descrever a eficiência de um algoritmo. Em aplicações matemáticas, a diferença entre uma solução O(n) e O(n ao quadrado) pode significar a diferença entre uma resposta em 100 milissegundos e uma resposta em 100 anos.
Considere a verificação de primalidade. Um método ingênuo que testa todos os divisores até n tem complexidade linear. Melhorando para testar até a raiz quadrada de n, reduzimos drasticamente as operações. Para um número de 18 dígitos, isso reduz as operações de 10 elevado a 18 para 10 elevado a 9 — uma melhoria de um bilhão de vezes apenas com matemática.

JavaScript Engine: V8 e JIT Compilation.
Para escrever JavaScript performático, é preciso entender onde ele roda. O motor V8 usa compilação Just-In-Time (JIT). O código não é apenas interpretado; ele é monitorado e recompilado dinamicamente para código de máquina otimizado.
Hidden Classes e Inline Caching são conceitos fundamentais. Manter a estrutura dos objetos consistente permite que o motor reutilize código otimizado, resultando em ganhos massivos de performance em loops intensivos.

Web Workers: Paralelismo Real.
O JavaScript no navegador é single-threaded por design. Isso significa que um loop infinito trava a aba inteira.
Web Workers permitem "escapar" dessa limitação, criando threads reais para execução de script em segundo plano. Para nossa aplicação de primos, isso é vital. A thread principal fica livre para renderizar animações a 60fps, enquanto um Worker "mastiga" números em segundo plano.

WebAssembly (Wasm): O Próximo Nível.
Por mais otimizado que seja o JIT do JavaScript, ele ainda tem overheads. WebAssembly é um formato de instrução binária, projetado como um alvo portátil para compilação de linguagens como C++ e Rust.
Ao reescrever algoritmos críticos em Rust e compilá-los para Wasm, obtemos performance previsível, tipagem estática e tamanho compacto. Em nossos testes, a implementação do Crivo de Eratóstenes em Wasm foi cerca de 4 a 10 vezes mais rápida que a versão em JavaScript puro.

Gerenciamento de Memória e Typed Arrays.
O Garbage Collector é conveniente, mas pode causar pausas imprevisíveis. Para dados numéricos massivos, TypedArrays como Uint32Array são essenciais. Eles alocam um bloco contíguo de memória binária, similar a um array em C, garantindo menor overhead e melhor uso do cache da CPU.

Conclusão: O Navegador como Plataforma.
A combinação de algoritmos eficientes, paralelismo com Web Workers, execução de baixo nível com WebAssembly e gerenciamento consciente de memória transforma o navegador. Não estamos mais limitados a exibir documentos estáticos. O navegador moderno é um sistema operacional distribuído capaz de processamento científico avançado.
"""

async def generate_audio():
    print("Iniciando geração de áudio neural...")
    
    # 1. Criptografia
    print("Gerando criptografia.mp3...")
    communicate = edge_tts.Communicate(TEXT_CRIPTO, VOICE)
    await communicate.save("public/audio/criptografia.mp3")
    
    # 2. Teoria dos Números
    print("Gerando teoria_numeros.mp3...")
    communicate = edge_tts.Communicate(TEXT_TEORIA, VOICE)
    await communicate.save("public/audio/teoria_numeros.mp3")
    
    # 3. Performance
    print("Gerando performance.mp3...")
    communicate = edge_tts.Communicate(TEXT_PERFORMANCE, VOICE)
    await communicate.save("public/audio/performance.mp3")
    
    print("Concluído! Arquivos salvos em public/audio/")

if __name__ == "__main__":
    asyncio.run(generate_audio())
