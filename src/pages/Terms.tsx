import React from 'react';
import { Scale, AlertCircle, CheckSquare } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">TERMOS DE USO</h1>
        <p className="text-primary font-mono text-sm uppercase tracking-widest">Regras de Acesso e Responsabilidade</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-xl space-y-4">
          <div className="flex items-center gap-3 text-primary mb-2">
            <CheckSquare />
            <h3 className="text-lg font-mono font-bold text-white">1. Aceitação</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ao acessar o PRIMOS.MAT.BR, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis, e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-xl space-y-4">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Scale />
            <h3 className="text-lg font-mono font-bold text-white">2. Uso de Licença</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            É concedida permissão para uso temporário e não comercial das ferramentas. Esta é a concessão de uma licença, não uma transferência de título. Você não pode modificar, copiar ou usar os materiais para qualquer finalidade comercial.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-xl space-y-4 md:col-span-2 border-red-500/20">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <AlertCircle />
            <h3 className="text-lg font-mono font-bold text-white">3. Isenção de Responsabilidade</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Os materiais e ferramentas no PRIMOS.MAT.BR são fornecidos 'como estão'. Não oferecemos garantias de precisão absoluta para propósitos críticos (como criptografia bancária real), embora nos esforcemos pela máxima exatidão matemática. O uso das informações é de sua inteira responsabilidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
