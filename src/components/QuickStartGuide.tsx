import React, { useState } from 'react';
import { Terminal, Copy, Check, Monitor, Apple, HelpCircle, Package } from 'lucide-react';

export const QuickStartGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div id="guia" className="w-full">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Como Executar no seu Computador</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          O Tkinter já vem instalado por padrão com o Python na maioria dos sistemas operacionais. Siga o passo a passo abaixo:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Windows */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Windows 10 / 11</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              O Python para Windows inclui o Tcl/Tk nativamente no instalador oficial.
            </p>

            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">1.</span>
                <span>Baixe o arquivo <code className="text-amber-300">calculadora.py</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">2.</span>
                <span>Abra o Prompt de Comando (CMD) ou PowerShell na pasta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">3.</span>
                <span>Execute o comando:</span>
              </li>
            </ol>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 font-mono text-xs border border-slate-800">
              <span className="text-amber-400">python calculadora.py</span>
              <button
                onClick={() => copyToClipboard('python calculadora.py')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Copiar comando"
              >
                {copiedCmd === 'python calculadora.py' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Linux */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Linux (Ubuntu / Debian)</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Algumas distribuições Linux separam o Tkinter em um pacote opcional.
            </p>

            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">1.</span>
                <span>Instale o suporte ao Tkinter no sistema:</span>
              </li>
              <div className="rounded-lg bg-slate-950 p-2 font-mono text-[11px] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">sudo apt install python3-tk</span>
                <button
                  onClick={() => copyToClipboard('sudo apt install python3-tk')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCmd === 'sudo apt install python3-tk' ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">2.</span>
                <span>Execute a calculadora:</span>
              </li>
            </ol>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 font-mono text-xs border border-slate-800">
              <span className="text-amber-400">python3 calculadora.py</span>
              <button
                onClick={() => copyToClipboard('python3 calculadora.py')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Copiar comando"
              >
                {copiedCmd === 'python3 calculadora.py' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* macOS */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Apple className="h-5 w-5 text-slate-300" />
              <h3 className="text-base font-bold text-white">macOS</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Utilize o Python instalado pelo instalador oficial ou via Homebrew.
            </p>

            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">1.</span>
                <span>Abra o Terminal (Cmd + Espaço &rarr; Terminal)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">2.</span>
                <span>Navegue até a pasta de Downloads com <code className="text-slate-400">cd ~/Downloads</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">3.</span>
                <span>Inicie a interface gráfica:</span>
              </li>
            </ol>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 font-mono text-xs border border-slate-800">
              <span className="text-amber-400">python3 calculadora.py</span>
              <button
                onClick={() => copyToClipboard('python3 calculadora.py')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Copiar comando"
              >
                {copiedCmd === 'python3 calculadora.py' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dica Extra: Gerando Executável .exe */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Dica Pro: Como transformar sua calculadora em um programa (.exe) independente
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Você pode empacotar o script para que qualquer pessoa consiga abrir com 2 cliques no Windows sem precisar ter o Python instalado usando o <strong className="text-slate-200">PyInstaller</strong>:
            </p>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">pip install pyinstaller</span>
              </div>
              <span className="text-slate-600">&rarr;</span>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-amber-400">pyinstaller --noconsole --onefile calculadora.py</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
