import React, { useEffect } from 'react';
import { Shield, Lock, Key, Terminal, ChevronRight, MessageSquare, AlertTriangle, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleMedia from '../components/ArticleMedia';

const CriptografiaArticle: React.FC = () => {
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
          <span className="text-white">Criptografia</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Segurança Digital
            </span>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Terminal size={12} />
              Leitura: 12 min
            </span>
          </div>
          <h1 itemProp="headline" className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Fundamentação Matemática para Protocolos de Segurança Digital Modernos
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Uma análise profunda sobre como a Teoria dos Números protege trilhões de dólares diariamente, do RSA às Curvas Elípticas e a era Pós-Quântica.
          </p>
        </header>

        {/* Media Section */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArticleMedia 
            type="audio" 
            title="Narração Neural (Pt-BR)" 
            duration="12:45" 
            mediaUrl="/audio/criptografia.mp3"
          />
          <ArticleMedia 
            type="video" 
            title="Vídeo Explicativo: Criptografia RSA" 
            duration="01:30" 
            mediaUrl="/video/criptografia.mp4"
          />
        </section>

        {/* Introduction */}
        <div itemProp="articleBody" className="space-y-8 text-gray-300">
          <p>
            A criptografia moderna não é apenas sobre esconder segredos; é a espinha dorsal de confiança da internet. Cada vez que você acessa sua conta bancária, envia uma mensagem no WhatsApp ou realiza uma compra online, você está confiando em teoremas matemáticos descobertos há séculos, agora aplicados em silício. Neste artigo técnico, vamos dissecar os mecanismos que tornam isso possível, focando na elegância matemática e na implementação prática.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Key className="text-primary" />
            1. A Revolução da Chave Pública
          </h2>
          <p>
            Até meados da década de 1970, a criptografia era simétrica: para Alice enviar uma mensagem segura para Bob, eles precisavam ter trocado previamente uma chave secreta. Isso gerava um problema logístico massivo. Como estabelecer uma chave segura em um canal inseguro?
          </p>
          <p>
            A solução veio com Diffie, Hellman e Merkle, e posteriormente com Rivest, Shamir e Adleman (RSA). A ideia revolucionária foi dividir a chave em duas partes: uma pública (para encriptar) e uma privada (para decriptar).
          </p>
          <div className="bg-black/40 border border-white/10 p-6 rounded-lg my-6">
            <h4 className="text-white font-bold mb-2">O Conceito da Função Trapdoor</h4>
            <p className="text-sm text-gray-400 mb-4">
              Imagine uma caixa de correio. Qualquer pessoa pode colocar uma carta nela (Chave Pública), mas apenas o carteiro com a chave mestra pode abri-la e retirar as cartas (Chave Privada). Matematicamente, isso depende de funções que são fáceis de calcular em uma direção, mas computacionalmente inviáveis de reverter sem uma informação especial.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Lock className="text-primary" />
            2. O Algoritmo RSA: Matemática Pura
          </h2>
          <p>
            O RSA baseia sua segurança na dificuldade de fatorar números inteiros grandes. Se eu te der o número 15, você rapidamente me diz que seus fatores primos são 3 e 5. Mas se eu te der um número com 600 dígitos, nem todos os computadores da Terra trabalhando juntos por um milhão de anos conseguiriam encontrar seus fatores primos a tempo.
          </p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">Gerando Chaves RSA</h3>
          <p>O processo segue passos matemáticos precisos:</p>
          <ol className="list-decimal pl-6 space-y-2 marker:text-primary">
            <li>Escolha dois números primos gigantes, <strong>p</strong> e <strong>q</strong>.</li>
            <li>Calcule <strong>n = p × q</strong>. O número <strong>n</strong> será o módulo da chave pública e privada. O tamanho de <strong>n</strong> em bits determina a segurança (ex: 2048 ou 4096 bits).</li>
            <li>Calcule a função totiente de Euler: <strong>φ(n) = (p-1) × (q-1)</strong>.</li>
            <li>Escolha um inteiro <strong>e</strong> tal que 1 &lt; e &lt; φ(n) e que seja coprimo a φ(n). Geralmente, e = 65537 é escolhido por eficiência.</li>
            <li>Calcule <strong>d</strong> tal que <strong>d × e ≡ 1 (mod φ(n))</strong>. Este <strong>d</strong> é o expoente privado.</li>
          </ol>

          <p>
            A chave pública é o par <strong>(n, e)</strong>. A chave privada é o par <strong>(n, d)</strong>.
          </p>
          <p>
            Para encriptar uma mensagem <strong>M</strong> (convertida em número), calculamos: <br/>
            <code className="bg-gray-800 px-2 py-1 rounded text-primary">C = M^e mod n</code>
          </p>
          <p>
            Para decriptar o cifrotexto <strong>C</strong>, calculamos: <br/>
            <code className="bg-gray-800 px-2 py-1 rounded text-primary">M = C^d mod n</code>
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Shield className="text-primary" />
            3. Curvas Elípticas (ECC): O Futuro Eficiente
          </h2>
          <p>
            Enquanto o RSA exige chaves de 2048 ou 4096 bits para ser seguro, a Criptografia de Curvas Elípticas (ECC) consegue o mesmo nível de segurança com chaves muito menores (ex: 256 bits). Isso é crucial para dispositivos móveis e IoT, onde processamento e bateria são limitados.
          </p>
          <p>
            A ECC baseia-se na estrutura algébrica de curvas elípticas sobre corpos finitos. A equação geral é da forma:
          </p>
          <p className="text-center font-mono text-xl my-6 text-primary">
            y² = x³ + ax + b
          </p>
          <p>
            O problema difícil aqui não é a fatoração, mas o "Logaritmo Discreto em Curvas Elípticas". Dado um ponto P na curva e um ponto Q = k*P (onde k é um inteiro escalar), é extremamente difícil descobrir k conhecendo apenas P e Q.
          </p>
          <p>
            Bitcoin e Ethereum, por exemplo, usam a curva <strong>secp256k1</strong> para gerar endereços e assinar transações.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <AlertTriangle className="text-yellow-500" />
            4. A Ameaça Quântica e Algoritmo de Shor
          </h2>
          <p>
            Toda a segurança do RSA e da ECC baseia-se na premissa de que computadores clássicos são ineficientes para resolver fatoração e logaritmos discretos. No entanto, em 1994, Peter Shor desenvolveu um algoritmo quântico que pode resolver esses problemas em tempo polinomial.
          </p>
          <p>
            Isso significa que, se (ou quando) um computador quântico suficientemente potente e estável for construído, ele quebrará quase toda a criptografia atual da internet instantaneamente. O RSA-2048, que levaria bilhões de anos para ser quebrado hoje, poderia ser fatorado em horas ou minutos.
          </p>
          <p>
            Isso gerou uma corrida pela <strong>Criptografia Pós-Quântica (PQC)</strong>. O NIST (National Institute of Standards and Technology) está padronizando novos algoritmos baseados em reticulados (Lattice-based cryptography), códigos corretores de erro e isogenias, que se acredita serem resistentes até mesmo a ataques quânticos.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Server className="text-primary" />
            5. Implementação Prática: HTTPS e TLS 1.3
          </h2>
          <p>
            Na prática, não usamos RSA para encriptar todo o tráfego da internet porque ele é lento. Usamos um sistema híbrido.
          </p>
          <ul className="list-disc pl-6 space-y-4 text-gray-300">
            <li>
              <strong>Handshake (Aperto de Mão):</strong> Quando você acessa este site, seu navegador e o servidor usam criptografia assimétrica (geralmente ECC com Algoritmo Diffie-Hellman Ephemeral) para negociar uma chave de sessão compartilhada.
            </li>
            <li>
              <strong>Autenticação:</strong> O servidor prova sua identidade enviando um Certificado Digital assinado por uma Autoridade Certificadora (CA). A assinatura é verificada usando a chave pública da CA pré-instalada no seu dispositivo.
            </li>
            <li>
              <strong>Túnel Seguro:</strong> Uma vez estabelecida a chave de sessão, a comunicação muda para criptografia simétrica (como AES-256-GCM), que é incrivelmente rápida e eficiente para transmitir dados em massa (vídeos, imagens, texto).
            </li>
          </ul>
          <p className="mt-4">
            O protocolo TLS 1.3, o padrão atual, removeu algoritmos obsoletos e inseguros (como MD5 e RC4) e tornou o handshake mais rápido, exigindo menos viagens de ida e volta (RTT) entre cliente e servidor.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Conclusão</h2>
          <p>
            A criptografia é um campo dinâmico, uma eterna corrida de gato e rato entre criptoanalistas e criptógrafos. Enquanto a matemática fundamental (Teoria dos Números) permanece sólida, as implementações e o hardware evoluem. Para desenvolvedores e engenheiros, entender esses conceitos não é apenas acadêmico – é uma responsabilidade profissional para construir sistemas seguros e resilientes.
          </p>

        </div>

        {/* FAQ Section with Schema */}
        <section className="mt-16 border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-white mb-8">Perguntas Frequentes (FAQ)</h3>
          <div className="space-y-6">
            {[
              {
                q: "O RSA ainda é seguro em 2026?",
                a: "Sim, desde que utilizado com chaves de 2048 bits ou superior (preferencialmente 4096 bits). No entanto, para novas implementações, recomenda-se Curvas Elípticas (ECC) devido à melhor performance."
              },
              {
                q: "O que é Criptografia de Ponta a Ponta (E2EE)?",
                a: "É um sistema onde apenas os usuários comunicantes podem ler as mensagens. Nem o provedor do serviço (como WhatsApp ou Signal) tem acesso às chaves privadas necessárias para decriptar o conteúdo."
              },
              {
                q: "Computadores Quânticos vão acabar com o Bitcoin?",
                a: "Potencialmente sim, se o Bitcoin não atualizar seus protocolos. O algoritmo de assinatura ECDSA usado pelo Bitcoin é vulnerável a ataques quânticos. No entanto, a rede pode fazer um 'soft fork' para implementar assinaturas pós-quânticas no futuro."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors">
                <h4 className="text-lg font-bold text-primary mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comments Section (Mock) */}
        <section className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <MessageSquare size={24} />
            Comentários da Comunidade
          </h3>
          <div className="bg-black/40 rounded-xl p-8 text-center border border-white/5">
            <p className="text-gray-400 mb-4">A seção de comentários está sendo atualizada para suportar assinaturas criptográficas Web3.</p>
            <button className="bg-primary/20 text-primary px-6 py-2 rounded-full hover:bg-primary/30 transition-colors font-medium text-sm">
              Notifique-me quando estiver disponível
            </button>
          </div>
        </section>

      </article>
    </div>
  );
};

export default CriptografiaArticle;
