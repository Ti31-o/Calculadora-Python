export type CalculatorTheme = 'classic' | 'modern' | 'retro-win98';

export interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface TkEventLog {
  id: string;
  timestamp: string;
  action: string;
  widget: string;
  detail: string;
}

export type CodeVersion = 'poo' | 'simples' | 'customtkinter';
