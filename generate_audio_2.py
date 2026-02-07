import asyncio
import edge_tts

VOICE = "pt-BR-AntonioNeural"

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
    print("Gerando teoria_numeros.mp3...")
    try:
        communicate = edge_tts.Communicate(TEXT_TEORIA, VOICE)
        await communicate.save("public/audio/teoria_numeros.mp3")
        print("Teoria OK")
    except Exception as e:
        print(f"Erro Teoria: {e}")

    print("Gerando performance.mp3...")
    try:
        communicate = edge_tts.Communicate(TEXT_PERFORMANCE, VOICE)
        await communicate.save("public/audio/performance.mp3")
        print("Performance OK")
    except Exception as e:
        print(f"Erro Performance: {e}")

if __name__ == "__main__":
    asyncio.run(generate_audio())
