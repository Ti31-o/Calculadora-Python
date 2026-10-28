import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export const PythonMathSandbox: React.FC = () => {
  const [expression, setExpression] = useState<string>('25 * 4 + 10 / 2');
  const [result, setResult] = useState<string>('105');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ expr: string; res: string }>>([
    { expr: '25 * 4 + 10 / 2', res: '105' },
    { expr: '100 / 0', res: 'ZeroDivisionError: division by zero' },
    { expr: '(50 - 20) * 3', res: '90' },
  ]);

  const presetExamples = [
    { label: 'Soma e Multiplicação', expr: '15 + 4 * 5' },
    { label: 'Divisão Simples', expr: '144 / 12' },
    { label: 'Precedência de Parênteses', expr: '(100 - 20) / 4' },
    { label: 'Divisão por Zero', expr: '42 / 0' },
    { label: 'Potenciação (**) em Python', expr: '2 ** 8' },
    { label: 'Resto da Divisão (%)', expr: '17 % 5' },
  ];

  const evaluateExpression = (exprToRun: string) => {
    setError(null);
    const trimmed = exprToRun.trim();

    if (!trimmed) {
      setError('Por favor, digite uma expressão matemática.');
      return;
    }

    // Check division by zero
    if (/\/0(?!\.)/.test(trimmed.replace(/\s+/g, ''))) {
      setError('ZeroDivisionError: division by zero (divisão por zero não é permitida)');
      setResult('');
      setHistory((prev) => [{ expr: trimmed, res: 'ZeroDivisionError: division by zero' }, ...prev.slice(0, 9)]);
      return;
    }

    try {
      // Validate safe characters: numbers, spaces, operators +, -, *, /, %, (, ), **
      if (!/^[\d\s+\-*/%().]+$/.test(trimmed)) {
        throw new Error('SyntaxError: caractere inválido na expressão');
      }

      // Safe JS evaluation representing Python arithmetic
      // Replace ** with Math.pow equivalent for JS or use standard JS **
      // eslint-disable-next-line no-eval
      const evalResult = eval(trimmed);

      if (!isFinite(evalResult)) {
        throw new Error('ZeroDivisionError: division by zero');
      }

      const formatted = Number.isInteger(evalResult)
        ? evalResult.toString()
        : parseFloat(evalResult.toFixed(8)).toString();

      setResult(formatted);
      setHistory((prev) => [{ expr: trimmed, res: formatted }, ...prev.slice(0, 9)]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao avaliar expressão';
      setError(msg);
      setResult('');
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Testador Rápido de Expressões Python</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Veja como o interpretador Python resolve a precedência matemática das operações básicas.
        </p>
      </div>

      {/* Preset pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presetExamples.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setExpression(item.expr);
              evaluateExpression(item.expr);
            }}
            className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs text-slate-300 border border-slate-800 hover:border-amber-500/50 hover:text-white transition-colors"
          >
            {item.label}: <span className="font-mono text-amber-400">{item.expr}</span>
          </button>
        ))}
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          evaluateExpression(expression);
        }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-amber-400 select-none">
            &gt;&gt;&gt;
          </span>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Digite ex: 25 * 4 + 10 / 2"
            className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-12 pr-4 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors shrink-0"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Avaliar Expressão</span>
        </button>
      </form>

      {/* Output Display */}
      {error ? (
        <div className="flex items-start gap-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 p-3 text-xs text-rose-300 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-bold">Python Exception:</span> {error}
          </div>
        </div>
      ) : result ? (
        <div className="flex items-center justify-between rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-xs">
          <span className="text-slate-400">Resultado avaliado:</span>
          <span className="text-lg font-bold text-emerald-400 tabular-nums">
            {result}
          </span>
        </div>
      ) : null}
    </div>
  );
};
