import React, { useEffect } from 'react';
import { Sigma, ChevronRight, MessageSquare, Search, Brain, Globe, Hash, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleMedia from '../components/ArticleMedia';

const TeoriaNumerosArticle: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <article itemScope itemType="http://schema.org/TechArticle" className="prose prose-invert prose-lg max-w-none">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-mono">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-primary">Artigos</span>
          <ChevronRight size={14} />
          <span className="text-white">Teoria dos Números</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Matemática Pura
            </span>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Brain size={12} />
              Leitura: 15 min
            </span>
          </div>
          <h1 itemProp="headline" className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Exploração Pura das Propriedades dos Inteiros e sua Distribuição
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            De Euclides à Hipótese de Riemann: uma jornada pelos mistérios dos números primos, os blocos fundamentais de construção do universo matemático.
          </p>
        </header>

        {/* Media Section */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArticleMedia 
            type="audio" 
            title="Narração Completa do Artigo" 
            duration="15:20" 
          />
          <ArticleMedia 
            type="video" 
            title="A Beleza da Espiral de Ulam" 
            duration="08:45" 
          />
        </section>

        {/* Content Body */}
        <div itemProp="articleBody" className="space-y-8 text-gray-300">
          <p>
            Carl Friedrich Gauss, um dos maiores matemáticos de todos os tempos, chamou a Teoria dos Números de "A Rainha da Matemática". Por séculos, ela foi considerada uma disciplina de beleza pura, sem aplicações práticas. "A ciência para a glória do espírito humano", diziam. Ironicamente, hoje ela é a base invisível de toda a nossa sociedade digital. Mas neste artigo, vamos nos afastar das aplicações e mergulhar na beleza intrínseca dos números.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Hash className="text-primary" />
            1. O Teorema Fundamental da Aritmética
          </h2>
          <p>
            Tudo começa com uma verdade simples, mas profunda: todo número inteiro maior que 1 ou é primo ou pode ser escrito como um produto único de números primos.
          </p>
          <p>
            Pense nisso. Os números primos (2, 3, 5, 7, 11...) são os "átomos" da aritmética. O número 12 não é fundamental; ele é feito de <code className="bg-gray-800 px-1 rounded">2 × 2 × 3</code>. O número 21 é <code className="bg-gray-800 px-1 rounded">3 × 7</code>. Mas o 7? O 7 é indivisível. Ele é um bloco de construção elementar.
          </p>
          <p>
            A unicidade dessa fatoração é o que garante que a matemática "funcione". Se houvesse duas maneiras diferentes de fatorar o mesmo número em primos, toda a aritmética colapsaria.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Globe className="text-primary" />
            2. A Distribuição dos Primos
          </h2>
          <p>
            Os primos parecem aparecer aleatoriamente.
            <br/>2, 3, 5, 7, 11, 13, 17, 19, 23, 29...
            <br/>Às vezes há grandes lacunas entre eles. Às vezes eles vêm em pares (Primos Gêmeos), como 11 e 13, ou 41 e 43.
          </p>
          <p>
            Existe um padrão? Gauss, aos 15 anos, percebeu que a densidade dos primos diminui à medida que os números aumentam, seguindo uma lei logarítmica. Isso culminou no <strong>Teorema do Número Primo (PNT)</strong>, que afirma que a quantidade de primos menores que um número $x$ é aproximadamente:
          </p>
          <div className="bg-black/40 p-6 rounded-lg text-center font-mono text-xl text-primary border border-white/10 my-6">
            π(x) ≈ x / ln(x)
          </div>
          <p>
            Isso significa que, perto de $x$, a probabilidade de um número aleatório ser primo é de $1/ln(x)$. É uma ordem estatística emergindo do caos aparente.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Sigma className="text-primary" />
            3. A Hipótese de Riemann
          </h2>
          <p>
            Aqui entramos no "Santo Graal" da matemática. Bernhard Riemann, em 1859, conectou a distribuição dos primos à Função Zeta de Riemann:
          </p>
          <p className="text-center font-mono my-4 text-gray-400">
            ζ(s) = 1 + 1/2^s + 1/3^s + 1/4^s + ...
          </p>
          <p>
            A hipótese afirma que todos os "zeros não triviais" dessa função têm uma parte real igual a 1/2.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg my-6">
            <h4 className="text-red-400 font-bold mb-2">Por que isso importa?</h4>
            <p className="text-sm text-gray-300">
              Se a Hipótese de Riemann for verdadeira, ela implica que os números primos são distribuídos da maneira mais regular possível. Se for falsa, o universo dos números tem irregularidades caóticas que desconhecemos. Há um prêmio de <strong>1 Milhão de Dólares</strong> do Instituto Clay para quem provar ou refutar isso.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Zap className="text-primary" />
            4. A Espiral de Ulam
          </h2>
          <p>
            Em 1963, o matemático Stanislaw Ulam estava entediado em uma conferência científica. Ele começou a rabiscar números em uma espiral em seu caderno:
          </p>
          <pre className="font-mono text-xs md:text-sm bg-black/50 p-4 rounded text-center leading-relaxed text-gray-400">
             37--36--35--34--33--32--31
              |                       |
             38  17--16--15--14--13  30
              |   |               |   |
             39  18   5---4---3  12  29
              |   |   |       |   |   |
             40  19   6   1---2  11  28
              |   |               |   |
             41  20   7---8---9--10  27
              |                       |
             42--43--44--45--46--47--48...
          </pre>
          <p className="mt-4">
            Quando ele circulou os números primos, percebeu algo chocante: eles tendiam a se alinhar em linhas diagonais. Isso sugere que existem polinômios quadráticos que geram primos com frequência muito maior que o aleatório (como o famoso $n^2 + n + 41$ de Euler).
          </p>
          <p>
            A Espiral de Ulam é uma visualização gráfica que transforma a aridez dos números em uma estrutura quase orgânica, revelando padrões ocultos na distribuição dos primos.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Search className="text-primary" />
            5. Primos de Mersenne e a Busca Computacional
          </h2>
          <p>
            Um primo de Mersenne é um primo da forma $M_p = 2^p - 1$.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Se $p=3$, $2^3 - 1 = 7$ (Primo)</li>
            <li>Se $p=5$, $2^5 - 1 = 31$ (Primo)</li>
            <li>Se $p=11$, $2^{11} - 1 = 2047$ (Não é primo! $23 \times 89$)</li>
          </ul>
          <p>
            Os maiores números primos conhecidos pela humanidade são quase todos de Mersenne. Isso porque existe um teste de primalidade extremamente eficiente para eles, o Teste de Lucas-Lehmer, que permite a computadores verificarem números com milhões de dígitos. O projeto GIMPS (Great Internet Mersenne Prime Search) usa computação distribuída para caçar esses gigantes.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Conclusão</h2>
          <p>
            A Teoria dos Números é um vasto oceano. Apenas molhamos os pés. De conjecturas simples que uma criança pode entender (como a Conjectura de Goldbach: "todo par &gt; 2 é a soma de dois primos") até as complexidades da análise complexa de Riemann, o estudo dos inteiros continua sendo a fronteira final da matemática pura.
          </p>

        </div>

        {/* FAQ Section */}
        <section className="mt-16 border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-white mb-8">Perguntas Frequentes (FAQ)</h3>
          <div className="space-y-6">
            {[
              {
                q: "Qual é o maior número primo conhecido?",
                a: "Até 2025, o maior primo conhecido é 2^136,279,841 - 1. Ele tem mais de 41 milhões de dígitos."
              },
              {
                q: "Para que serve saber se um número é primo?",
                a: "Além da criptografia RSA, primos são usados em tabelas hash (computação), geração de números pseudoaleatórios e códigos corretores de erro (como os usados em CDs e transmissões de satélite)."
              },
              {
                q: "O número 1 é primo?",
                a: "Não. Por definição, um primo deve ter exatamente dois divisores distintos: 1 e ele mesmo. O número 1 só tem um divisor. Se 1 fosse primo, a fatoração única (Teorema Fundamental) falharia."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors">
                <h4 className="text-lg font-bold text-primary mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <MessageSquare size={24} />
            Discussão Acadêmica
          </h3>
          <div className="bg-black/40 rounded-xl p-8 text-center border border-white/5">
            <p className="text-gray-400 mb-4">Conecte sua carteira acadêmica (ORCID) para participar da discussão.</p>
            <button className="bg-primary/20 text-primary px-6 py-2 rounded-full hover:bg-primary/30 transition-colors font-medium text-sm">
              Conectar ORCID
            </button>
          </div>
        </section>

      </article>
    </div>
  );
};

export default TeoriaNumerosArticle;
