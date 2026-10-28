import React, { useState } from 'react';
import { Copy, Check, Download, FileCode2, Info } from 'lucide-react';
import { CodeVersion } from '../types/calculator';
import { CODIGO_POO, CODIGO_SIMPLES, CODIGO_CUSTOM_TKINTER } from '../utils/pythonCode';

interface PythonCodeViewerProps {
  onDownload: (version: CodeVersion) => void;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({ onDownload }) => {
  const [selectedVersion, setSelectedVersion] = useState<CodeVersion>('poo');
  const [copied, setCopied] = useState<boolean>(false);

  const getActiveCode = () => {
    switch (selectedVersion) {
      case 'simples':
        return CODIGO_SIMPLES;
      case 'customtkinter':
        return CODIGO_CUSTOM_TKINTER;
      case 'poo':
      default:
        return CODIGO_POO;
    }
  };

  const getFileName = () => {
    switch (selectedVersion) {
      case 'simples':
        return 'calculadora_simples.py';
      case 'customtkinter':
        return 'calculadora_moderna.py';
      case 'poo':
      default:
        return 'calculadora.py';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCode = getActiveCode();
  const lines = activeCode.trim().split('\n');

  return (
    <div id="codigo" className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Código-Fonte Python Completo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Scripts Python prontos para executar diretamente na sua máquina. Copie ou baixe o arquivo <code className="text-amber-400 font-mono">.py</code>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:text-white transition-all shadow-sm active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Código Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={() => onDownload(selectedVersion)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-all shadow-sm active:scale-[0.98]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Baixar {getFileName()}</span>
          </button>
        </div>
      </div>

      {/* Version Selector Tabs (Segmented Control) */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedVersion('poo')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              selectedVersion === 'poo'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orientada a Objetos (POO)
          </button>
          <button
            onClick={() => setSelectedVersion('simples')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              selectedVersion === 'simples'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Versão Simples (Iniciantes)
          </button>
          <button
            onClick={() => setSelectedVersion('customtkinter')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              selectedVersion === 'customtkinter'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CustomTkinter (Moderna)
          </button>
        </div>

        {/* Info Note without pill styling */}
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="text-amber-400 font-mono font-medium">{getFileName()}</span>
          <span aria-hidden="true">·</span>
          <span>{lines.length} linhas de código</span>
          <span aria-hidden="true">·</span>
          <span>Biblioteca padrão Tkinter</span>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="rounded-xl border border-slate-800 bg-[#16171d] shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#121317] border-b border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-amber-400" />
            <span className="text-slate-200 font-medium">{getFileName()}</span>
          </div>
          <span>Python 3.x</span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="max-h-[560px] overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="w-12 select-none text-right pr-4 text-slate-600 font-mono text-[11px] align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono">
                    {renderColoredPythonLine(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Syntax high-lighting tokenizer for clean Python presentation
function renderColoredPythonLine(line: string) {
  // Comments
  if (line.trim().startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith("'''") || line.trim().startsWith('=')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Keywords
  const keywords = ['import', 'from', 'as', 'class', 'def', 'return', 'if', 'elif', 'else', 'try', 'except', 'global', 'lambda', 'True', 'False', 'None'];
  
  // Highlighting key elements
  const parts = line.split(/(\b(?:import|from|as|class|def|return|if|elif|else|try|except|global|lambda|True|False|None)\b|"[^"]*"|'[^']*'|#[^\n]*)/g);

  return parts.map((part, i) => {
    if (keywords.includes(part)) {
      return (
        <span key={i} className="text-amber-400 font-semibold">
          {part}
        </span>
      );
    }
    if (part.startsWith('#')) {
      return (
        <span key={i} className="text-slate-500 italic">
          {part}
        </span>
      );
    }
    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
      return (
        <span key={i} className="text-emerald-400">
          {part}
        </span>
      );
    }
    if (part.includes('tk.') || part.includes('ctk.') || part.includes('self.')) {
      return (
        <span key={i} className="text-cyan-400">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
