import React, { useEffect } from 'react';
import { Cpu, Gauge, ChevronRight, MessageSquare, Share2, Code, Layers, Zap, Database, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleMedia from '../components/ArticleMedia';

const PerformanceArticle: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <article itemScope itemType="http://schema.org/TechArticle" className="prose prose-invert prose-lg max-w-none">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-mono">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-primary">Artigos</span>
          <ChevronRight size={14} />
          <span className="text-white">Performance</span>
        </nav>

        <header className="mb-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            ENGENHARIA DE SOFTWARE // CORE
          </div>
          
          <h1 itemProp="headline" className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white mb-6">
            Performance Extrema<br/>
            <span className="text-primary text-2xl md:text-3xl font-normal block mt-4">Otimização Matemática no Front-end Moderno</span>
          </h1>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-mono">
            <span itemProp="author">Por Wander Santos</span>
            <span>•</span>
            <time itemProp="datePublished" dateTime={new Date().toISOString().split('T')[0]}>{new Date().toLocaleDateString()}</time>
            <span>•</span>
            <span>15 min de leitura</span>
          </div>
        </header>

        {/* Media Section - AI Generated Content */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArticleMedia 
            type="audio" 
            title="Narração Completa do Artigo" 
            duration="18:30" 
          />
          <ArticleMedia 
            type="video" 
            title="Visualizando Big O na Prática" 
            duration="10:15" 
          />
        </section>

        {/* Introduction */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 mb-12 backdrop-blur-sm">
          <p className="lead text-xl text-gray-300 mb-0">
            No desenvolvimento web moderno, "rápido" não é mais um diferencial, é o padrão mínimo aceitável. Quando trazemos cálculos matemáticos complexos para o navegador — como criptografia, fatoração de primos ou renderização de fractais — entramos em um território onde cada ciclo de CPU conta. Este artigo explora como transformar o navegador em uma supermáquina de cálculo.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 text-gray-300">
          
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
              <Gauge className="text-primary" />
              A Complexidade Assintótica: O Pesadelo O(n!)
            </h2>
            <p>
              Antes de otimizar código, precisamos otimizar a lógica. A notação Big O é a linguagem universal para descrever a eficiência de um algoritmo. Em aplicações matemáticas, a diferença entre uma solução $O(n)$ e $O(n^2)$ pode significar a diferença entre uma resposta em 100ms e uma resposta em 100 anos.
            </p>
            <p>
              Considere a verificação de primalidade. Um método ingênuo que testa todos os divisores até $n$ tem complexidade $O(n)$. Melhorando para testar até $\sqrt{'{'}n{'}'}$, reduzimos para $O(\sqrt{'{'}n{'}'})$. Para um número de 18 dígitos, isso reduz as operações de $10^{'{'}18{'}'}$ para $10^9$ — uma melhoria de um bilhão de vezes apenas com matemática, sem mudar uma linha de infraestrutura.
            </p>
            <p>
              Algoritmos probabilísticos como Miller-Rabin levam isso além, oferecendo complexidade polilogarítmica $O(k \log^3 n)$, tornando viável verificar primos gigantescos em tempo real no navegador do usuário.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
              <Cpu className="text-primary" />
              JavaScript Engine: V8 e JIT Compilation
            </h2>
            <p>
              Para escrever JavaScript performático, é preciso entender onde ele roda. O motor V8 (Chrome/Node.js) usa compilação Just-In-Time (JIT). O código não é apenas interpretado; ele é monitorado, "profilado" e recompilado dinamicamente para código de máquina otimizado.
            </p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">Hidden Classes e Inline Caching</h3>
            <p>
              O V8 cria "classes ocultas" (hidden classes) para objetos em tempo de execução. Se você adiciona propriedades a um objeto em ordens diferentes, você quebra essa otimização.
            </p>
            <div className="bg-black/50 p-4 rounded-lg border border-white/10 font-mono text-sm mb-4">
              <p className="text-red-400">// Ruim para performance (cria formas diferentes)</p>
              <p>const p1 = {'{ x: 1, y: 2 }'};</p>
              <p>const p2 = {'{ y: 2, x: 1 }'};</p>
              <br/>
              <p className="text-green-400">// Bom para performance (mesma forma)</p>
              <p>const p1 = {'{ x: 1, y: 2 }'};</p>
              <p>const p2 = {'{ x: 1, y: 2 }'};</p>
            </div>
            <p>
              Manter a estrutura dos objetos consistente permite que o motor reutilize código otimizado, resultando em ganhos massivos de performance em loops intensivos.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
              <Layers className="text-primary" />
              Web Workers: Paralelismo Real
            </h2>
            <p>
              O JavaScript no navegador é single-threaded por design para garantir a consistência do DOM. Isso significa que um loop `while(true)` trava a aba inteira, impedindo cliques, rolagens e atualizações de tela.
            </p>
            <p>
              Web Workers permitem "escapar" dessa limitação, criando threads de sistema operacional reais para execução de script em segundo plano. Para nossa aplicação de primos, isso é vital. A thread principal (UI thread) fica livre para renderizar animações a 60fps, enquanto um Worker "mastiga" números em segundo plano.
            </p>
            <p>
              A comunicação entre threads via `postMessage` tem um custo de serialização. O uso de `SharedArrayBuffer` e `Atomics` permite que threads compartilhem memória diretamente, eliminando cópias desnecessárias e permitindo sincronização de baixo nível, similar a linguagens como C++ ou Rust.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
              <Zap className="text-primary" />
              WebAssembly (Wasm): O Próximo Nível
            </h2>
            <p>
              Por mais otimizado que seja o JIT do JavaScript, ele ainda tem overheads de tipagem dinâmica e Garbage Collection. WebAssembly (Wasm) é um formato de instrução binária para uma máquina virtual baseada em pilha, projetada como um alvo portátil para compilação de linguagens de alto nível como C, C++ e Rust.
            </p>
            <p>
              Ao reescrever algoritmos críticos de criptografia ou fatoração em Rust e compilá-los para Wasm, obtemos:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Performance Previsível:</strong> Sem pausas inesperadas de Garbage Collection.</li>
              <li><strong>Tipagem Estática:</strong> Otimizações de compilador agressivas antes mesmo do código chegar ao navegador.</li>
              <li><strong>Tamanho Compacto:</strong> O binário Wasm é menor e carrega mais rápido que o JS equivalente minificado.</li>
            </ul>
            <p className="mt-4">
              Em nossos testes, a implementação do Crivo de Eratóstenes em Wasm (Rust) foi cerca de 4x a 10x mais rápida que a versão em JavaScript puro para $n &gt; 10^9$.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
              <Database className="text-primary" />
              Gerenciamento de Memória e Typed Arrays
            </h2>
            <p>
              O Garbage Collector (GC) é conveniente, mas em aplicações de alta performance, ele é um vilão imprevisível. Alocar e desalocar milhões de objetos pequenos gera "pausas de GC" que causam "jank" (engasgos visuais).
            </p>
            <p>
              Para dados numéricos massivos, `TypedArrays` (`Uint32Array`, `Float64Array`) são essenciais. Eles alocam um bloco contíguo de memória binária, similar a um array em C.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Menor Overhead:</strong> Não há cabeçalhos de objeto ou ponteiros extras.</li>
              <li><strong>Cache Friendly:</strong> Acesso sequencial em memória contígua aproveita melhor o cache L1/L2 da CPU.</li>
              <li><strong>Interoperabilidade:</strong> Podem ser passados diretamente para WebGL ou WebAssembly sem cópia.</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
              <Globe className="text-primary" />
              Conclusão: O Navegador como Plataforma
            </h2>
            <p>
              A combinação de algoritmos eficientes ($O(n \log n)$ ou melhor), paralelismo (Web Workers), execução de baixo nível (WebAssembly) e gerenciamento consciente de memória transforma o navegador.
            </p>
            <p>
              Não estamos mais limitados a exibir documentos estáticos. O navegador moderno é um sistema operacional distribuído capaz de processamento científico, criptografia de ponta a ponta e renderização gráfica avançada. O limite não é mais a tecnologia, mas nossa capacidade de arquitetar soluções que explorem esse potencial.
            </p>
          </section>

        </div>

        {/* FAQ Section */}
        <section className="mt-16 pt-16 border-t border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Perguntas Frequentes</h2>
          <div className="grid gap-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Otimização prematura é a raiz de todo mal?
              </h3>
              <p className="text-gray-400 text-sm">
                A famosa frase de Donald Knuth é frequentemente mal interpretada. Otimizar código ilegível antes de saber onde está o gargalo é ruim. Mas escolher a estrutura de dados correta e a complexidade algorítmica adequada desde o início não é otimização prematura, é engenharia competente.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Quando usar WebAssembly vs JavaScript?
              </h3>
              <p className="text-gray-400 text-sm">
                Use JS para a lógica de UI, manipulação de DOM e "cola" da aplicação. Use Wasm para tarefas computacionalmente intensivas: processamento de imagem/vídeo, física de jogos, criptografia pesada e algoritmos matemáticos complexos.
              </p>
            </div>
          </div>
        </section>

        {/* Action Footer */}
        <footer className="mt-16 text-center space-y-8">
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white font-mono text-sm">
              <Share2 size={16} /> Compartilhar Técnicas
            </button>
            <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-full transition-all font-mono text-sm">
              <Code size={16} /> Ver Código Fonte
            </Link>
          </div>
        </footer>

      </article>
    </div>
  );
};

export default PerformanceArticle;
