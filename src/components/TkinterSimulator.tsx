import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  History, 
  Terminal, 
  Keyboard as KeyboardIcon,
  Check,
  Copy,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CalculatorTheme, CalculationRecord, TkEventLog } from '../types/calculator';
import { playKeyClick } from '../utils/audio';

interface TkinterSimulatorProps {
  onCopyCode: () => void;
  onDownloadPy: () => void;
}

export const TkinterSimulator: React.FC<TkinterSimulatorProps> = ({ onCopyCode, onDownloadPy }) => {
  const [expression, setExpression] = useState<string>('0');
  const [subDisplay, setSubDisplay] = useState<string>('');
  const [isNewCalculation, setIsNewCalculation] = useState<boolean>(false);
  const [theme, setTheme] = useState<CalculatorTheme>('modern');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationRecord[]>([
    { id: '1', expression: '25 × 4', result: '100', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '2', expression: '1250 ÷ 5', result: '250', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
  ]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [eventLogs, setEventLogs] = useState<TkEventLog[]>([
    { id: 'init-1', timestamp: '00:00:01', action: 'tk.Tk()', widget: 'root', detail: 'Janela inicializada em 340x480' },
    { id: 'init-2', timestamp: '00:00:01', action: 'tk.Entry()', widget: 'self.visor', detail: 'Visor montado com state="readonly"' },
    { id: 'init-3', timestamp: '00:00:01', action: 'root.mainloop()', widget: 'EventLoop', detail: 'Aguardando eventos do usuário' },
  ]);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const logRef = useRef<HTMLDivElement>(null);

  const addEventLog = (action: string, widget: string, detail: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setEventLogs((prev) => [
      { id: Math.random().toString(), timestamp: timeStr, action, widget, detail },
      ...prev.slice(0, 19) // keep last 20 logs
    ]);
  };

  // Trigger sound effect
  const triggerAudio = (type: 'num' | 'op' | 'enter' | 'clear' = 'num') => {
    if (soundEnabled) {
      playKeyClick(type);
    }
  };

  // Button handlers
  const handleDigit = useCallback((digit: string) => {
    triggerAudio('num');
    setActiveKey(digit);
    setTimeout(() => setActiveKey(null), 150);

    setExpression((prev) => {
      let nextVal = prev;
      if (isNewCalculation || prev === '0' || prev.includes('Erro')) {
        nextVal = digit;
        setIsNewCalculation(false);
      } else {
        nextVal = prev + digit;
      }
      addEventLog('inserir_numero()', 'self.visor', `Adicionado dígito '${digit}' -> '${nextVal}'`);
      return nextVal;
    });
  }, [isNewCalculation, soundEnabled]);

  const handleOperator = useCallback((op: string) => {
    triggerAudio('op');
    setActiveKey(op);
    setTimeout(() => setActiveKey(null), 150);
    setIsNewCalculation(false);

    setExpression((prev) => {
      if (prev === '0' || prev.includes('Erro')) {
        if (op === '-') return '-';
        return prev;
      }

      const lastChar = prev.slice(-1);
      let nextVal = prev;

      if (['+', '-', '*', '/'].includes(lastChar)) {
        nextVal = prev.slice(0, -1) + op;
        addEventLog('inserir_operador()', 'self.visor', `Substituído operador anterior por '${op}'`);
      } else {
        nextVal = prev + op;
        addEventLog('inserir_operador()', 'self.visor', `Adicionado operador '${op}' -> '${nextVal}'`);
      }
      return nextVal;
    });
  }, [soundEnabled]);

  const handlePoint = useCallback(() => {
    triggerAudio('num');
    setActiveKey('.');
    setTimeout(() => setActiveKey(null), 150);

    setExpression((prev) => {
      if (isNewCalculation || prev === '0' || prev.includes('Erro')) {
        setIsNewCalculation(false);
        addEventLog('inserir_ponto()', 'self.visor', `Iniciado decimal '0.'`);
        return '0.';
      }

      // Check last number segment
      const parts = prev.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];

      if (!lastPart.includes('.')) {
        const nextVal = prev.slice(-1).match(/[+\-*/]/) ? prev + '0.' : prev + '.';
        addEventLog('inserir_ponto()', 'self.visor', `Adicionado ponto decimal -> '${nextVal}'`);
        return nextVal;
      }
      return prev;
    });
  }, [isNewCalculation, soundEnabled]);

  const handleClear = useCallback(() => {
    triggerAudio('clear');
    setActiveKey('C');
    setTimeout(() => setActiveKey(null), 150);
    setExpression('0');
    setSubDisplay('');
    setIsNewCalculation(false);
    addEventLog('limpar_tudo()', 'self.visor', 'Visor resetado para 0');
  }, [soundEnabled]);

  const handleBackspace = useCallback(() => {
    triggerAudio('clear');
    setActiveKey('⌫');
    setTimeout(() => setActiveKey(null), 150);

    setExpression((prev) => {
      if (prev.length <= 1 || prev === '0' || prev.includes('Erro')) {
        addEventLog('apagar_ultimo()', 'self.visor', 'Visor resetado para 0');
        return '0';
      }
      const nextVal = prev.slice(0, -1);
      addEventLog('apagar_ultimo()', 'self.visor', `Removido último caractere -> '${nextVal}'`);
      return nextVal;
    });
  }, [soundEnabled]);

  const handleToggleSign = useCallback(() => {
    triggerAudio('op');
    setActiveKey('±');
    setTimeout(() => setActiveKey(null), 150);

    setExpression((prev) => {
      if (prev === '0' || prev.includes('Erro')) return prev;
      try {
        const val = Number(eval(prev));
        if (isNaN(val)) return prev;
        const inverted = -val;
        const resStr = Number.isInteger(inverted) ? inverted.toString() : inverted.toString();
        addEventLog('inverter_sinal()', 'self.visor', `Invertido sinal de ${val} para ${resStr}`);
        return resStr;
      } catch {
        return prev;
      }
    });
  }, [soundEnabled]);

  const handlePercentage = useCallback(() => {
    triggerAudio('op');
    setActiveKey('%');
    setTimeout(() => setActiveKey(null), 150);

    setExpression((prev) => {
      if (prev === '0' || prev.includes('Erro')) return prev;
      try {
        // Safe evaluation
        const sanitized = prev.replace(/[^-()\d/*+.]/g, '');
        const val = Number(eval(sanitized));
        if (isNaN(val)) return 'Erro';
        const res = val / 100;
        const resStr = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString();
        addEventLog('calcular_porcentagem()', 'self.visor', `Porcentagem de ${val}% = ${resStr}`);
        setIsNewCalculation(true);
        return resStr;
      } catch {
        addEventLog('calcular_porcentagem()', 'self.visor', 'Erro ao calcular porcentagem');
        return 'Erro';
      }
    });
  }, [soundEnabled]);

  const handleCalculate = useCallback(() => {
    triggerAudio('enter');
    setActiveKey('=');
    setTimeout(() => setActiveKey(null), 150);

    setExpression((prev) => {
      if (prev === '0' || prev.includes('Erro')) return prev;

      let cleanExpr = prev;
      // If ends with operator, trim it
      if (['+', '-', '*', '/'].includes(cleanExpr.slice(-1))) {
        cleanExpr = cleanExpr.slice(0, -1);
      }

      // Detect division by zero
      if (/\/0(?!\.)/.test(cleanExpr)) {
        addEventLog('ZeroDivisionError', 'try...except', 'Detectada divisão por zero: Erro!');
        setSubDisplay(cleanExpr + ' =');
        setIsNewCalculation(true);
        return 'Erro: Divisão por 0';
      }

      try {
        // Safe arithmetic evaluation
        const sanitized = cleanExpr.replace(/[^-()\d/*+.]/g, '');
        // eslint-disable-next-line no-eval
        const rawResult = eval(sanitized);

        if (!isFinite(rawResult)) {
          addEventLog('ZeroDivisionError', 'try...except', 'Resultado não é finito (Divisão por 0)');
          setSubDisplay(cleanExpr + ' =');
          setIsNewCalculation(true);
          return 'Erro: Divisão por 0';
        }

        let formattedResult = '';
        if (Number.isInteger(rawResult)) {
          formattedResult = rawResult.toString();
        } else {
          // avoid floating point noise like 0.1 + 0.2 = 0.30000000000000004
          formattedResult = parseFloat(rawResult.toFixed(10)).toString();
        }

        // Add to history
        const record: CalculationRecord = {
          id: Date.now().toString(),
          expression: cleanExpr.replace(/\*/g, '×').replace(/\//g, '÷'),
          result: formattedResult,
          timestamp: new Date()
        };
        setHistory((h) => [record, ...h.slice(0, 14)]);

        setSubDisplay(cleanExpr.replace(/\*/g, '×').replace(/\//g, '÷') + ' =');
        addEventLog('eval() seguro', 'Python Runtime', `eval('${cleanExpr}') = ${formattedResult}`);
        setIsNewCalculation(true);
        return formattedResult;
      } catch {
        addEventLog('SyntaxError', 'try...except', 'Expressão matemática inválida');
        setIsNewCalculation(true);
        return 'Erro de sintaxe';
      }
    });
  }, [soundEnabled]);

  // Physical keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in a textarea or input field outside
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault();
        handleOperator(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handlePoint();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handlePoint, handleCalculate, handleBackspace, handleClear, handlePercentage]);

  const copyResultToClipboard = () => {
    navigator.clipboard.writeText(expression);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Format expression for visor display
  const displayExpression = expression.replace(/\*/g, '×').replace(/\//g, '÷');

  return (
    <div id="simulador" className="w-full">
      {/* Control bar above the simulator */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Simulador Interativo Tkinter</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Janela gráfica virtual com comportamento autêntico do Python Tkinter, renderização de widgets e atalhos de teclado.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setTheme('modern')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                theme === 'modern' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tkinter Moderno
            </button>
            <button
              onClick={() => setTheme('classic')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                theme === 'classic' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tkinter Clássico
            </button>
            <button
              onClick={() => setTheme('retro-win98')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                theme === 'retro-win98' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Retrô Win98
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              soundEnabled
                ? 'border-slate-700 bg-slate-900 text-amber-400'
                : 'border-slate-800 bg-slate-950 text-slate-500'
            }`}
            title={soundEnabled ? 'Som mecânico ativado' : 'Som silenciado'}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Cliques ON' : 'Cliques OFF'}</span>
          </button>

          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showHistory
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Histórico ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Stage (Tkinter Window) + Right Deck (Python Inspector & Event Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tkinter Window Container (Stage) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Physical Keyboard Notice */}
          <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <KeyboardIcon className="h-3.5 w-3.5 text-amber-400" />
              <span>Use o teclado físico do seu computador</span>
            </span>
            <span className="text-slate-500 font-mono">0-9, +, -, *, /, Enter</span>
          </div>

          {/* Simulated Tkinter Window Frame */}
          <div
            className={`w-full max-w-sm transition-all duration-200 select-none shadow-2xl ${
              theme === 'classic'
                ? 'bg-[#d4d0c8] text-black border-2 border-slate-400 rounded-none tk-raised'
                : theme === 'retro-win98'
                ? 'bg-[#c0c0c0] text-black border-2 border-[#dfdfdf] rounded-none tk-raised'
                : 'bg-[#1e1e24] text-slate-100 rounded-xl border border-slate-700/80 shadow-slate-950/80'
            }`}
          >
            {/* Window Title Bar */}
            <div
              className={`flex items-center justify-between px-3 py-2 ${
                theme === 'classic'
                  ? 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold'
                  : theme === 'retro-win98'
                  ? 'bg-gradient-to-r from-[#008080] to-[#03a89e] text-white font-bold'
                  : 'bg-[#16171b] text-slate-200 border-b border-slate-800 rounded-t-xl'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Python icon representation */}
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-400 text-slate-950">
                  Py
                </div>
                <span className="text-xs font-medium tracking-tight truncate">
                  Calculadora Python - Tkinter (root)
                </span>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                {theme === 'modern' ? (
                  <>
                    <button
                      onClick={handleClear}
                      className="w-3 h-3 rounded-full bg-amber-500/70 hover:bg-amber-500 transition-colors"
                      title="Minimizar (Limpar)"
                    />
                    <button
                      onClick={copyResultToClipboard}
                      className="w-3 h-3 rounded-full bg-emerald-500/70 hover:bg-emerald-500 transition-colors"
                      title="Maximizar (Copiar)"
                    />
                    <button
                      onClick={handleClear}
                      className="w-3 h-3 rounded-full bg-rose-500/70 hover:bg-rose-500 transition-colors"
                      title="Fechar Janela (Reset)"
                    />
                  </>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={handleClear}
                      className="w-4 h-4 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black text-[9px] font-bold flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                      title="Minimizar"
                    >
                      _
                    </button>
                    <button
                      onClick={copyResultToClipboard}
                      className="w-4 h-4 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black text-[9px] font-bold flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                      title="Maximizar"
                    >
                      □
                    </button>
                    <button
                      onClick={handleClear}
                      className="w-4 h-4 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black text-[9px] font-bold flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                      title="Fechar"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Tkinter Menu Bar */}
            <div
              className={`flex items-center gap-4 px-3 py-1 text-[11px] border-b ${
                theme === 'modern'
                  ? 'border-slate-800 text-slate-400 bg-[#16171b]/60'
                  : 'border-[#808080] text-black bg-[#d4d0c8]'
              }`}
            >
              <button
                onClick={handleClear}
                className="hover:underline focus:outline-none"
              >
                Arquivo
              </button>
              <button
                onClick={copyResultToClipboard}
                className="hover:underline focus:outline-none"
              >
                Copiar
              </button>
              <button
                onClick={onDownloadPy}
                className="hover:underline focus:outline-none"
              >
                Exportar .py
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('anatomia');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:underline focus:outline-none"
              >
                Ajuda
              </button>
            </div>

            {/* Window Content (Tkinter Root Frame) */}
            <div className="p-4">
              {/* Visor: tk.Entry simulated */}
              <div
                className={`relative mb-4 p-3 rounded-lg transition-all ${
                  theme === 'classic'
                    ? 'bg-white text-black border-2 border-slate-600 tk-sunken font-mono'
                    : theme === 'retro-win98'
                    ? 'bg-white text-black border-2 border-black tk-sunken font-mono'
                    : 'bg-[#121316] border border-slate-800 text-white rounded-lg shadow-inner'
                }`}
              >
                {/* Micro Subtitle (Expression calculation trail) */}
                <div className="h-5 text-right font-mono text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                  {subDisplay || '\u00A0'}
                </div>

                {/* Main Entry Value */}
                <div className="flex items-center justify-end gap-1">
                  <span
                    className={`font-mono text-3xl font-bold tracking-tight text-right overflow-x-auto whitespace-nowrap scrollbar-none tabular-nums ${
                      expression.includes('Erro')
                        ? 'text-rose-400 text-xl'
                        : theme === 'modern'
                        ? 'text-amber-400'
                        : 'text-slate-900'
                    }`}
                  >
                    {displayExpression}
                  </span>
                  {/* Blinking Entry Cursor (Authentic Tkinter) */}
                  <span className="w-0.5 h-6 bg-amber-400 animate-pulse ml-0.5 inline-block opacity-75" />
                </div>

                {/* Copy Feedback */}
                {copiedNotification && (
                  <span className="absolute left-3 top-3 text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                    Copiado!
                  </span>
                )}
              </div>

              {/* Grid of Buttons: 5 rows x 4 columns */}
              <div className="grid grid-cols-4 gap-2">
                {/* Row 0: C, ⌫, %, ÷ */}
                <button
                  onClick={handleClear}
                  className={getButtonClass('clear', activeKey === 'C', theme)}
                  title="Limpar tudo (Esc)"
                >
                  C
                </button>
                <button
                  onClick={handleBackspace}
                  className={getButtonClass('fn', activeKey === '⌫', theme)}
                  title="Apagar último caractere (Backspace)"
                >
                  ⌫
                </button>
                <button
                  onClick={handlePercentage}
                  className={getButtonClass('fn', activeKey === '%', theme)}
                  title="Porcentagem (%)"
                >
                  %
                </button>
                <button
                  onClick={() => handleOperator('/')}
                  className={getButtonClass('op', activeKey === '/', theme)}
                  title="Divisão (/)"
                >
                  ÷
                </button>

                {/* Row 1: 7, 8, 9, × */}
                <button
                  onClick={() => handleDigit('7')}
                  className={getButtonClass('num', activeKey === '7', theme)}
                >
                  7
                </button>
                <button
                  onClick={() => handleDigit('8')}
                  className={getButtonClass('num', activeKey === '8', theme)}
                >
                  8
                </button>
                <button
                  onClick={() => handleDigit('9')}
                  className={getButtonClass('num', activeKey === '9', theme)}
                >
                  9
                </button>
                <button
                  onClick={() => handleOperator('*')}
                  className={getButtonClass('op', activeKey === '*', theme)}
                  title="Multiplicação (*)"
                >
                  ×
                </button>

                {/* Row 2: 4, 5, 6, - */}
                <button
                  onClick={() => handleDigit('4')}
                  className={getButtonClass('num', activeKey === '4', theme)}
                >
                  4
                </button>
                <button
                  onClick={() => handleDigit('5')}
                  className={getButtonClass('num', activeKey === '5', theme)}
                >
                  5
                </button>
                <button
                  onClick={() => handleDigit('6')}
                  className={getButtonClass('num', activeKey === '6', theme)}
                >
                  6
                </button>
                <button
                  onClick={() => handleOperator('-')}
                  className={getButtonClass('op', activeKey === '-', theme)}
                  title="Subtração (-)"
                >
                  -
                </button>

                {/* Row 3: 1, 2, 3, + */}
                <button
                  onClick={() => handleDigit('1')}
                  className={getButtonClass('num', activeKey === '1', theme)}
                >
                  1
                </button>
                <button
                  onClick={() => handleDigit('2')}
                  className={getButtonClass('num', activeKey === '2', theme)}
                >
                  2
                </button>
                <button
                  onClick={() => handleDigit('3')}
                  className={getButtonClass('num', activeKey === '3', theme)}
                >
                  3
                </button>
                <button
                  onClick={() => handleOperator('+')}
                  className={getButtonClass('op', activeKey === '+', theme)}
                  title="Adição (+)"
                >
                  +
                </button>

                {/* Row 4: ±, 0, ., = */}
                <button
                  onClick={handleToggleSign}
                  className={getButtonClass('fn', activeKey === '±', theme)}
                  title="Inverter Sinal (±)"
                >
                  ±
                </button>
                <button
                  onClick={() => handleDigit('0')}
                  className={getButtonClass('num', activeKey === '0', theme)}
                >
                  0
                </button>
                <button
                  onClick={handlePoint}
                  className={getButtonClass('num', activeKey === '.', theme)}
                  title="Ponto decimal (.)"
                >
                  .
                </button>
                <button
                  onClick={handleCalculate}
                  className={getButtonClass('equal', activeKey === '=', theme)}
                  title="Calcular resultado (Enter)"
                >
                  =
                </button>
              </div>

              {/* Status bar */}
              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>geometry("340x480")</span>
                <span>grid: 5×4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stage: Python Inspector & Live Execution Log */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Active State Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-amber-400" />
                <span>Estado Interno do Tkinter</span>
              </span>
              <button
                onClick={copyResultToClipboard}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
              >
                <Copy className="h-3 w-3" />
                <span>Copiar visor</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">self.expressao:</span>
                <span className="text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  "{expression}"
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">self.novo_calculo:</span>
                <span className="text-cyan-400 font-semibold">{isNewCalculation ? 'True' : 'False'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Tipo de Dado:</span>
                <span className="text-slate-300">str (Entry widget)</span>
              </div>
            </div>
          </div>

          {/* History Panel (if open or collapsed) */}
          {showHistory && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-amber-400" />
                  <span>Histórico de Cálculos</span>
                </span>
                <button
                  onClick={() => setHistory([])}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Limpar
                </button>
              </div>

              {history.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">Nenhum cálculo realizado ainda.</p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setExpression(item.result);
                        setIsNewCalculation(true);
                        addEventLog('historico', 'self.visor', `Reutilizado valor ${item.result}`);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-colors group"
                      title="Clique para reutilizar este resultado"
                    >
                      <span className="text-slate-400 font-mono group-hover:text-slate-200">
                        {item.expression}
                      </span>
                      <span className="font-mono font-bold text-amber-400">
                        = {item.result}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Real-time Tkinter Event Log */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Console de Eventos Tkinter</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">root.mainloop()</span>
            </div>

            <div
              ref={logRef}
              className="max-h-60 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]"
            >
              {eventLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded bg-slate-950 border border-slate-800/60 flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="text-amber-400 font-semibold">{log.action}</span>
                    <span className="text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-300 break-words">
                    <span className="text-cyan-400">[{log.widget}]</span> {log.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button styling helper according to theme
function getButtonClass(
  kind: 'num' | 'op' | 'fn' | 'clear' | 'equal',
  isActive: boolean,
  theme: CalculatorTheme
): string {
  const base = 'h-12 text-sm font-bold transition-all flex items-center justify-center select-none active:scale-[0.97]';

  if (theme === 'classic') {
    let bg = 'bg-[#ece9d8] text-black tk-raised hover:bg-[#f5f5f5]';
    if (kind === 'clear') bg = 'bg-[#f0d0d0] text-[#900] tk-raised hover:bg-[#f8dada]';
    if (kind === 'op') bg = 'bg-[#e0e8f0] text-[#003366] tk-raised hover:bg-[#eef3f8]';
    if (kind === 'equal') bg = 'bg-[#d8edd8] text-[#006600] tk-raised hover:bg-[#e5f5e5]';

    return `${base} rounded-none font-sans ${bg} ${isActive ? 'tk-sunken bg-slate-300' : ''}`;
  }

  if (theme === 'retro-win98') {
    let bg = 'bg-[#c0c0c0] text-black tk-raised';
    if (kind === 'clear') bg = 'bg-[#c0c0c0] text-[#800000] tk-raised font-bold';
    if (kind === 'op') bg = 'bg-[#c0c0c0] text-[#000080] tk-raised font-bold';
    if (kind === 'equal') bg = 'bg-[#c0c0c0] text-[#008000] tk-raised font-bold';

    return `${base} rounded-none font-sans ${bg} ${isActive ? 'tk-sunken' : ''}`;
  }

  // Modern Dark Theme
  let modernBg = 'bg-[#282c34] text-slate-100 hover:bg-[#32363e] border border-slate-700/50';

  if (kind === 'clear') {
    modernBg = 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30';
  } else if (kind === 'fn') {
    modernBg = 'bg-[#3e4451]/60 text-slate-200 hover:bg-[#3e4451] border border-slate-700/40';
  } else if (kind === 'op') {
    modernBg = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30';
  } else if (kind === 'equal') {
    modernBg = 'bg-emerald-600 text-white hover:bg-emerald-500 font-bold shadow-sm shadow-emerald-950/50';
  }

  return `${base} rounded-lg ${modernBg} ${isActive ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 scale-95' : ''}`;
}
