import React, { useState } from 'react';
import { 
  Download, 
  Code2, 
  Terminal, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';
import { Header } from './components/Header';
import { TkinterSimulator } from './components/TkinterSimulator';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { TkinterExplainer } from './components/TkinterExplainer';
import { QuickStartGuide } from './components/QuickStartGuide';
import { PythonMathSandbox } from './components/PythonMathSandbox';
import { CodeVersion } from './types/calculator';
import { CODIGO_POO, CODIGO_SIMPLES, CODIGO_CUSTOM_TKINTER } from './utils/pythonCode';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('simulador');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const downloadPythonFile = (version: CodeVersion = 'poo') => {
    let code = CODIGO_POO;
    let filename = 'calculadora.py';

    if (version === 'simples') {
      code = CODIGO_SIMPLES;
      filename = 'calculadora_simples.py';
    } else if (version === 'customtkinter') {
      code = CODIGO_CUSTOM_TKINTER;
      filename = 'calculadora_moderna.py';
    }

    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Arquivo ${filename} baixado com sucesso!`);
  };

  const copyCodeToClipboard = (version: CodeVersion = 'poo') => {
    const code = version === 'simples' ? CODIGO_SIMPLES : CODIGO_POO;
    navigator.clipboard.writeText(code);
    showToast('Código Python copiado para a área de transferência!');
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -70; // header height offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Bar Header adhering strictly to Top Bar Contract */}
      <Header
        onDownload={() => downloadPythonFile('poo')}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <section className="pt-4 pb-2">
          {/* Metadata Text without pill enclosures */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-3">
            <span className="text-amber-400 font-semibold">Python 3</span>
            <span aria-hidden="true">·</span>
            <span>Tkinter Standard Library</span>
            <span aria-hidden="true">·</span>
            <span>Matriz Grid 5×4</span>
            <span aria-hidden="true">·</span>
            <span>Zero Dependências Externas</span>
          </div>

          {/* Display Headline with balanced wrapping */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15] text-balance mb-4">
            Calculadora em Python com Interface Gráfica Tkinter
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-6">
            Realize operações aritméticas de <strong>soma</strong>, <strong>subtração</strong>, <strong>multiplicação</strong> e <strong>divisão</strong> com suporte a teclado físico, visor numérico protegido e tratamento de divisão por zero.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToSection('simulador')}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all shadow-sm"
            >
              <span>Testar no Simulador</span>
            </button>

            <button
              onClick={() => scrollToSection('codigo')}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:text-white active:scale-[0.98] transition-all"
            >
              <Code2 className="h-4 w-4 text-amber-400" />
              <span>Ver Código-Fonte</span>
            </button>

            <button
              onClick={() => downloadPythonFile('poo')}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:text-white active:scale-[0.98] transition-all"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Baixar arquivo .py</span>
            </button>
          </div>
        </section>

        {/* Section 1: Tkinter Simulator Stage */}
        <section className="scroll-mt-24">
          <TkinterSimulator
            onCopyCode={() => copyCodeToClipboard('poo')}
            onDownloadPy={() => downloadPythonFile('poo')}
          />
        </section>

        {/* Section 2: Complete Python Source Code */}
        <section className="scroll-mt-24">
          <PythonCodeViewer onDownload={downloadPythonFile} />
        </section>

        {/* Section 3: Quick Math Evaluator Sandbox */}
        <section className="scroll-mt-24">
          <PythonMathSandbox />
        </section>

        {/* Section 4: Tkinter Architecture & Concepts */}
        <section className="scroll-mt-24">
          <TkinterExplainer />
        </section>

        {/* Section 5: How to Run Guide */}
        <section className="scroll-mt-24">
          <QuickStartGuide />
        </section>
      </main>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-slate-900 border border-amber-500/40 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400 font-bold">Python / Tkinter</span>
            <span>—</span>
            <span>Calculadora com interface gráfica desktop nativa</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => scrollToSection('simulador')}
              className="hover:text-white transition-colors"
            >
              Simulador
            </button>
            <button
              onClick={() => scrollToSection('codigo')}
              className="hover:text-white transition-colors"
            >
              Código
            </button>
            <button
              onClick={() => scrollToSection('guia')}
              className="hover:text-white transition-colors"
            >
              Guia
            </button>
            <button
              onClick={() => downloadPythonFile('poo')}
              className="text-amber-400 hover:underline"
            >
              Baixar .py
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
