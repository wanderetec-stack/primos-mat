export interface DailyPrimeData {
  number: number;
  title: string;
  desc: string;
  formula?: string;
  articleLink?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

const primes: DailyPrimeData[] = [
  { 
    number: 2, 
    title: "O Único Par", 
    desc: "O número 2 é o único primo par. Ele é a base da dualidade binária e fundamental para toda a computação moderna.",
    formula: "p = 2",
    articleLink: "/artigos/teoria-numeros",
    quiz: {
      question: "Por que o número 2 é único entre os primos?",
      options: ["É o único par", "É o maior primo", "É divisível por 3", "Não é inteiro"],
      correctIndex: 0
    }
  },
  { 
    number: 3, 
    title: "A Trindade", 
    desc: "O primeiro primo ímpar. Essencial em geometria (triângulos) e na definição de estruturas estáveis.",
    formula: "p_2 = 3",
    articleLink: "/artigos/teoria-numeros",
    quiz: {
      question: "Qual polígono regular não pode ser construído apenas com régua e compasso?",
      options: ["Triângulo (3)", "Pentágono (5)", "Heptágono (7)", "Quadrado (4)"],
      correctIndex: 2
    }
  },
  { 
    number: 7, 
    title: "O Primo da Sorte", 
    desc: "Frequentemente associado à mística. Na matemática, 1/7 gera a dízima periódica 142857.",
    formula: "1/7 = 0.\\overline{142857}",
    articleLink: "/artigos/teoria-numeros",
    quiz: {
      question: "Quantos dígitos tem o período da dízima 1/7?",
      options: ["4", "5", "6", "7"],
      correctIndex: 2
    }
  },
  { 
    number: 17, 
    title: "O Primo de Gauss", 
    desc: "Gauss provou que um polígono regular de 17 lados pode ser construído apenas com régua e compasso.",
    formula: "F_2 = 2^{2^2} + 1 = 17",
    articleLink: "/artigos/teoria-numeros",
    quiz: {
      question: "O número 17 é um primo de qual tipo?",
      options: ["Mersenne", "Fermat", "Sophie Germain", "Twin Prime"],
      correctIndex: 1
    }
  },
  { 
    number: 31, 
    title: "Primo de Mersenne", 
    desc: "Um primo de Mersenne usado em geradores de números pseudoaleatórios e hashing.",
    formula: "M_5 = 2^5 - 1 = 31",
    articleLink: "/artigos/criptografia",
    quiz: {
      question: "Qual a forma geral de um primo de Mersenne?",
      options: ["2^n - 1", "n^2 + 1", "2n + 1", "n! + 1"],
      correctIndex: 0
    }
  },
  { 
    number: 137, 
    title: "A Constante Fina", 
    desc: "Aproximação do inverso da constante de estrutura fina (1/137), número que intriga físicos como Feynman.",
    formula: "\\alpha \\approx 1/137",
    articleLink: "/artigos/performance",
    quiz: {
      question: "Em qual área da física o número 137 é famoso?",
      options: ["Mecânica Clássica", "Eletrodinâmica Quântica", "Termodinâmica", "Óptica"],
      correctIndex: 1
    }
  },
  {
    number: 1009,
    title: "O Menor de 4 Dígitos",
    desc: "O primeiro número primo após 1000. Marca a transição para escalas maiores de primalidade.",
    formula: "p_{169} = 1009",
    articleLink: "/artigos/performance",
    quiz: {
      question: "Quantos números primos existem menores que 1000?",
      options: ["168", "100", "250", "500"],
      correctIndex: 0
    }
  }
];

export const getDailyPrime = (offsetDays: number = 0): DailyPrimeData => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays); // Add offset
  
  // Hash based on YYYY-MM-DD to be consistent per day
  // Using absolute values to avoid negative index with negative offset
  const hash = Math.abs(date.getDate() + (date.getMonth() * 31) + (date.getFullYear() * 365));
  const index = hash % primes.length;
  
  return primes[index];
};
