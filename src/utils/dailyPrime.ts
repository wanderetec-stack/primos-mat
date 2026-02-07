export const getDailyPrime = () => {
    const primes = [
      { 
        number: 2, 
        title: "O Único Par", 
        desc: "O número 2 é o único primo par. Ele é a base da dualidade binária e fundamental para toda a computação moderna." 
      },
      { 
        number: 3, 
        title: "A Trindade", 
        desc: "O primeiro primo ímpar. Essencial em geometria (triângulos) e na definição de estruturas estáveis." 
      },
      { 
        number: 7, 
        title: "O Primo da Sorte", 
        desc: "Frequentemente associado à mística e probabilidade. Na matemática, 1/7 gera a dízima periódica 142857." 
      },
      { 
        number: 17, 
        title: "O Primo de Gauss", 
        desc: "Gauss provou que um polígono regular de 17 lados pode ser construído apenas com régua e compasso." 
      },
      { 
        number: 31, 
        title: "Primo de Mersenne", 
        desc: "2^5 - 1 = 31. Um primo de Mersenne usado em geradores de números pseudoaleatórios." 
      },
      { 
        number: 137, 
        title: "A Constante Fina", 
        desc: "Aproximação do inverso da constante de estrutura fina (1/137), número que intriga físicos como Feynman." 
      },
      {
        number: 1009,
        title: "O Menor de 4 Dígitos",
        desc: "O primeiro número primo após 1000. Marca a transição para escalas maiores de primalidade."
      }
    ];
  
    // Simple hash based on date to pick a prime
    const today = new Date();
    const hash = today.getDate() + today.getMonth() + today.getFullYear();
    const index = hash % primes.length;
    
    return primes[index];
  };
  