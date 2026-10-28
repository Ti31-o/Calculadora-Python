import React from 'react';
import { Download } from 'lucide-react';
import { CODIGO_POO } from '../utils/pythonCode';

interface HeaderProps {
  onDownload: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onDownload, activeSection, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-amber-400 font-semibold tracking-wider">PY / TK</span>
          <a
            href="#simulador"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('simulador');
            }}
            className="text-base font-bold tracking-tight text-white whitespace-nowrap hover:text-slate-200 transition-colors"
          >
            Calculadora Python Tkinter
          </a>
        </div>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('simulador')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeSection === 'simulador' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Simulador Gráfico
          </button>
          <button
            onClick={() => onNavigate('codigo')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeSection === 'codigo' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Código Python
          </button>
          <button
            onClick={() => onNavigate('anatomia')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeSection === 'anatomia' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Anatomia Tkinter
          </button>
          <button
            onClick={() => onNavigate('guia')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeSection === 'guia' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Como Executar
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 shadow-sm"
            title="Baixar arquivo calculadora.py"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Baixar calculadora.py</span>
          </button>
        </div>
      </div>
    </header>
  );
};
