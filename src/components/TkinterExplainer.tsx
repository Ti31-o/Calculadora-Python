import React, { useState } from 'react';
import { Layers, Grid, Cpu, Terminal, ShieldAlert, Sparkles, Code2 } from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  summary: string;
  codeSnippet: string;
  details: string[];
}

export const TkinterExplainer: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<string>('grid');

  const concepts: Concept[] = [
    {
      id: 'window',
      title: '1. Janela Principal (tk.Tk)',
      badge: 'Estrutura Base',
      icon: <Layers className="h-4 w-4 text-amber-400" />,
      summary: 'É a raiz de qualquer aplicação gráfica no Python. Cria a janela do sistema operacional e inicia o loop de eventos.',
      codeSnippet: `import tkinter as tk

# Inicializa a janela principal
janela = tk.Tk()
janela.title("Calculadora Python")
janela.geometry("340x480")         # Largura x Altura em pixels
janela.resizable(False, False)      # Trava o redimensionamento
janela.configure(bg="#1e1e24")      # Cor de fundo

# Mantém a janela aberta escutando cliques e teclas
janela.mainloop()`,
      details: [
        'tk.Tk() inicializa o interpretador Tcl/Tk integrado ao Python.',
        'geometry("340x480") define o tamanho ideal para não quebrar os botões.',
        'resizable(False, False) impede que o usuário deforme a disposição da calculadora.',
        'mainloop() é um loop infinito que aguarda cliques do mouse e teclas.'
      ]
    },
    {
      id: 'grid',
      title: '2. Gerenciador de Geometria Grid',
      badge: 'Alinhamento Perfeito',
      icon: <Grid className="h-4 w-4 text-cyan-400" />,
      summary: 'O grid organiza botões em linhas (rows) e colunas (columns), perfeito para o formato de matriz de uma calculadora.',
      codeSnippet: `# Frame que abriga a matriz 5x4
grade = tk.Frame(root, bg="#1e1e24")
grade.pack(fill="both", expand=True, padx=12, pady=16)

# Garante que todas as linhas e colunas se expandam proporcionalmente
for r in range(5):
    grade.rowconfigure(r, weight=1)
for c in range(4):
    grade.columnconfigure(c, weight=1)

# Posiciona o botão '7' na linha 1, coluna 0 ocupando todo o espaço
btn_7.grid(row=1, column=0, padx=4, pady=4, sticky="nsew")`,
      details: [
        'sticky="nsew" faz o botão esticar para Norte, Sul, Leste e Oeste na célula.',
        'rowconfigure e columnconfigure com weight=1 distribuem o espaço uniformemente.',
        'padx e pady criam o espaçamento visual elegante entre os botões.'
      ]
    },
    {
      id: 'entry',
      title: '3. Visor com tk.Entry e Proteção',
      badge: 'Entrada e Saída',
      icon: <Terminal className="h-4 w-4 text-emerald-400" />,
      summary: 'O widget Entry funciona como display numérico. Usamos readonly para evitar que o usuário digite texto arbitrário.',
      codeSnippet: `# Criação do visor
visor = tk.Entry(
    root,
    font=("Consolas", 24, "bold"),
    bg="#16171b",
    fg="#61afef",
    bd=0,
    justify="right",           # Alinha os números à direita
    relief="flat"
)
visor.insert(0, "0")
visor.config(state="readonly") # Impede edição com cursor do mouse

# Para atualizar via código:
def atualizar_visor(novo_texto):
    visor.config(state="normal")
    visor.delete(0, tk.END)
    visor.insert(0, novo_texto)
    visor.config(state="readonly")`,
      details: [
        'justify="right" alinha os dígitos à direita, igual a uma calculadora real.',
        'state="readonly" previne que o usuário digite letras ou apague formatações.',
        'delete(0, tk.END) limpa o visor antes de inserir a nova expressão.'
      ]
    },
    {
      id: 'lambda',
      title: '4. Callbacks e Funções Lambda',
      badge: 'Eventos de Botão',
      icon: <Cpu className="h-4 w-4 text-purple-400" />,
      summary: 'Como passar argumentos (como o número digitado) para a função do botão sem que ela execute imediatamente.',
      codeSnippet: `# ❌ ERRADO: executa a função durante a inicialização!
# btn = tk.Button(..., command=inserir_numero("7"))

# ✅ CORRETO: usa uma função anônima lambda como gatilho
btn_7 = tk.Button(
    grade,
    text="7",
    command=lambda: self.inserir_numero("7")
)

# Botões que não recebem parâmetros não precisam de lambda:
btn_limpar = tk.Button(grade, text="C", command=self.limpar_tudo)`,
      details: [
        'O parâmetro command espera uma referência de função (callable).',
        'Usar lambda: funcao(valor) cria uma função temporária que só roda no clique.',
        'Sem o lambda, o Python executa a função no exato momento da criação da janela.'
      ]
    },
    {
      id: 'keyboard',
      title: '5. Suporte ao Teclado Físico (bind)',
      badge: 'Experiência Desktop',
      icon: <Sparkles className="h-4 w-4 text-rose-400" />,
      summary: 'Permite que o usuário use o teclado numérico (Numpad) ou os números do topo do teclado para fazer contas.',
      codeSnippet: `# Vincula a tecla Enter do teclado principal e do Numpad ao cálculo
root.bind("<Return>", lambda event: self.calcular_resultado())
root.bind("<KP_Enter>", lambda event: self.calcular_resultado())

# Vincula o BackSpace para apagar último dígito
root.bind("<BackSpace>", lambda event: self.apagar_ultimo())

# Vincula o Escape para limpar tudo
root.bind("<Escape>", lambda event: self.limpar_tudo())

# Captura qualquer caractere digitado (0-9, +, -, *, /)
root.bind("<Key>", self.tratar_tecla)`,
      details: [
        '<Return> e <KP_Enter> cobrem os dois tipos de tecla Enter no PC.',
        '<BackSpace> remove o último caractere da expressão.',
        'O evento repassa event.char com o caractere digitado pelo usuário.'
      ]
    },
    {
      id: 'errors',
      title: '6. Tratamento de Divisão por Zero',
      badge: 'Segurança & Exceções',
      icon: <ShieldAlert className="h-4 w-4 text-amber-400" />,
      summary: 'Evita que a aplicação quebre (crash) com erro fatal quando o usuário tentar dividir qualquer número por 0.',
      codeSnippet: `try:
    # Valida se a expressão possui apenas caracteres seguros
    if not re.match(r'^[0-9\\+\\-\\*/\\.\\s]+$', self.expressao):
        raise ValueError("Caracteres inválidos")
    
    # Executa a operação matemática
    resultado = eval(self.expressao)
    
    # Formata números inteiros sem .0
    if isinstance(resultado, float) and resultado.is_integer():
        resultado = int(resultado)
        
    self.atualizar_visor(str(resultado))

except ZeroDivisionError:
    # Captura explicitamente divisão por zero
    self.atualizar_visor("Erro: Divisão por 0")
except Exception:
    self.atualizar_visor("Erro de sintaxe")`,
      details: [
        'ZeroDivisionError é a exceção nativa disparada pelo Python.',
        'Usamos regex para filtrar caracteres antes de chamar eval().',
        'is_integer() remove casas decimais desnecessárias (ex: 4.0 vira 4).'
      ]
    }
  ];

  const current = concepts.find((c) => c.id === activeConcept) || concepts[0];

  return (
    <div id="anatomia" className="w-full">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Anatomia do Tkinter Explicada</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Aprenda os conceitos fundamentais da biblioteca Tkinter para construir aplicações gráficas profissionais em Python.
        </p>
      </div>

      {/* Concept Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {concepts.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveConcept(c.id)}
            className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
              activeConcept === c.id
                ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {c.icon}
              <span className="text-xs font-semibold">{c.title.split('.')[1]}</span>
            </div>
            <span className="text-[10px] text-slate-500">{c.badge}</span>
          </button>
        ))}
      </div>

      {/* Active Concept Explanation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        {/* Left Explanation */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-2">
              <span>{current.badge}</span>
              <span aria-hidden="true">·</span>
              <span>Conceito Tkinter</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{current.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{current.summary}</p>

            <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-200 block mb-2">Pontos-Chave:</span>
              {current.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-amber-400 font-mono text-[11px] shrink-0">0{idx + 1}.</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Code Block */}
        <div className="lg:col-span-7 rounded-lg border border-slate-800 bg-[#14151b] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-[#0e1014] border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Code2 className="h-3.5 w-3.5" />
              <span>Exemplo Prático</span>
            </span>
            <span>tkinter</span>
          </div>
          <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-slate-300">
            <pre className="whitespace-pre">{current.codeSnippet}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
