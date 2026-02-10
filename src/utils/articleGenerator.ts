
export interface ArticleSection {
  title: string;
  content: string;
}

export interface SEOArticle {
  title: string;
  intro: string;
  sections: ArticleSection[];
  faq: { question: string; answer: string }[];
  metaDescription: string;
  wordCount: number;
}

const formatNumber = (n: bigint): string => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const generateSEOArticle = (n: bigint, isPrime: boolean, factors: string[] = [], executionTime: number): SEOArticle => {
  const numStr = n.toString();
  const numLen = numStr.length;
  const numInt = parseInt(numStr.substring(0, 15)); // Safe integer for math ops
  
  // Helpers
  const isEven = n % 2n === 0n;
  const sqrtApprox = Math.floor(Math.sqrt(Number(numStr.substring(0, 15)))) * Math.pow(10, Math.floor((numLen - 15)/2)); 
  
  // 1. Title & Meta
  const title = isPrime 
    ? `Dossiê Completo: Por que o número ${formatNumber(n)} é um Primo Matemático?`
    : `Análise Numérica: Decomposição e Fatores do Número ${formatNumber(n)}`;
    
  const metaDescription = isPrime
    ? `Descubra tudo sobre o número ${formatNumber(n)}. Análise de primalidade confirmada, propriedades matemáticas, representações binárias e curiosidades. Um estudo completo.`
    : `O número ${formatNumber(n)} é primo? Veja a resposta, seus fatores ${factors.slice(0, 3).join(', ')} e decomposição completa. Entenda sua estrutura matemática.`;

  // 2. Sections Generation
  const sections: ArticleSection[] = [];

  // Section 1: Introduction (The Hook)
  sections.push({
    title: `Introdução ao Número ${formatNumber(n)}`,
    content: `No vasto universo da teoria dos números, cada inteiro ocupa um lugar único e possui propriedades distintas que o definem. O número **${formatNumber(n)}** não é exceção. ${
      isPrime 
      ? "Após uma análise computacional rigorosa, confirmamos que este número pertence à elite dos números inteiros: ele é um **Número Primo**." 
      : "Nossa análise detectou que este é um **Número Composto**, o que significa que ele pode ser construído através da multiplicação de números menores."
    } Este dossiê técnico visa explorar todas as facetas matemáticas, computacionais e curiosas desta entidade numérica, fornecendo uma referência definitiva para estudantes, matemáticos e entusiastas.`
  });

  // Section 2: Detailed Primality Analysis
  sections.push({
    title: `Análise de Primalidade: O Veredito`,
    content: `A questão central "O número ${formatNumber(n)} é primo?" foi respondida com **${isPrime ? "SIM" : "NÃO"}**. 
    
    Para chegar a esta conclusão, nosso algoritmo de força bruta otimizada realizou uma varredura exaustiva. ${
      isPrime
      ? `Sendo um número primo, ${formatNumber(n)} possui a propriedade fundamental de ser divisível apenas por 1 e por ele mesmo. Isso significa que ele é um "átomo" da aritmética, um bloco de construção indivisível. Em termos criptográficos, números como este são a base para a segurança de dados moderna (como no algoritmo RSA).`
      : `Como um número composto, ${formatNumber(n)} possui divisores além da unidade e de si mesmo. Especificamente, identificamos que ele pode ser dividido por **${factors[0]}**. A fatoração fundamental revela que ${formatNumber(n)} = ${factors[0]} × ${factors[1]} (entre outras possíveis combinações). Isso demonstra que ele é um "produto" de primos menores.`
    }
    
    A verificação levou aproximadamente **${executionTime.toFixed(4)} milissegundos**, demonstrando a eficiência do nosso motor de processamento client-side.`
  });

  // Section 3: Properties & Representations
  const binary = n.toString(2);
  const hex = n.toString(16).toUpperCase();
  const octal = n.toString(8);
  
  sections.push({
    title: `Propriedades Computacionais e Representações`,
    content: `Além de seu valor decimal, o número ${formatNumber(n)} assume formas diferentes dependendo da base numérica utilizada, essenciais para a ciência da computação:
    
    *   **Binário (Base 2):** \`${binary}\` - Esta é a linguagem nativa das máquinas. O número possui ${binary.length} bits. A quantidade de bits "1" (Population Count) é ${binary.split('1').length - 1}, o que influencia em cálculos de paridade e detecção de erros.
    *   **Hexadecimal (Base 16):** \`${hex}\` - Frequentemente usado em endereçamento de memória e códigos de cores.
    *   **Octal (Base 8):** \`${octal}\` - Uma representação histórica em computação.
    
    Essas transformações confirmam a integridade do dado através de diferentes sistemas lógicos.`
  });

  // Section 4: Mathematical Trivia
  const digitSum = numStr.split('').reduce((a, b) => a + parseInt(b), 0);
  const lastDigit = numStr.slice(-1);
  
  sections.push({
    title: `Curiosidades Aritméticas`,
    content: `Vamos aprofundar nas características intrínsecas dos dígitos de ${formatNumber(n)}:
    
    1.  **Soma dos Dígitos:** A soma de todos os algarismos é **${digitSum}**. ${digitSum % 3 === 0 ? "Como esta soma é divisível por 3, o número original também é (critério de divisibilidade)." : "Esta soma não é divisível por 3, o que elimina o 3 como fator trivial."}
    2.  **Dígito Terminal:** O número termina em **${lastDigit}**. ${
      ['0', '2', '4', '6', '8'].includes(lastDigit) 
      ? "Isso o classifica imediatamente como um número **PAR**, garantindo divisibilidade por 2." 
      : "Isso o classifica como um número **ÍMPAR**, uma condição necessária (mas não suficiente) para ser primo (exceto o 2)."
    }
    3.  **Magnitude:** O número possui **${numLen} dígitos**. Estima-se que existam aproximadamente ${formatNumber(n / BigInt(Math.log(numInt) || 1))} números primos menores que ele, baseando-se no Teorema dos Números Primos.`
  });

  // 3. FAQ Generation
  const faq = [
    {
      question: `O número ${formatNumber(n)} é primo?`,
      answer: isPrime 
        ? `Sim, ${formatNumber(n)} é um número primo. Ele não possui divisores exatos além de 1 e dele mesmo.`
        : `Não, ${formatNumber(n)} é um número composto. Ele pode ser dividido por ${factors[0]} e outros números.`
    },
    {
      question: `Quais são os fatores de ${formatNumber(n)}?`,
      answer: isPrime
        ? `Sendo primo, seus únicos fatores são 1 e ${formatNumber(n)}.`
        : `Seus fatores incluem 1, ${factors.slice(0, 5).join(', ')}, ..., e ${formatNumber(n)}. A decomposição primária começa com ${factors[0]}.`
    },
    {
      question: `Qual é o binário de ${formatNumber(n)}?`,
      answer: `A representação binária é ${binary}.`
    },
    {
      question: `Para que serve saber se ${formatNumber(n)} é primo?`,
      answer: `A primalidade é fundamental para criptografia (RSA), geração de números aleatórios e teoria dos códigos. Saber se ${formatNumber(n)} é primo ajuda a determinar sua utilidade nesses algoritmos de segurança.`
    }
  ];

  // Calculate generic word count (approximation)
  const fullText = sections.map(s => s.content).join(' ') + faq.map(f => f.answer).join(' ');
  const wordCount = fullText.split(/\s+/).length;

  return {
    title,
    intro: metaDescription,
    sections,
    faq,
    metaDescription,
    wordCount
  };
};
