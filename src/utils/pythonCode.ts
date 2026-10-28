export const CODIGO_POO = `"""
====================================================================
 Calculadora Gráfica em Python com Tkinter (Orientada a Objetos)
====================================================================
Funcionalidades:
 - Operações Básicas: Soma (+), Subtração (-), Multiplicação (*), Divisão (/)
 - Operações extras: Porcentagem (%), Inversão de Sinal (±), Ponto Decimal (.)
 - Suporte total ao teclado físico (0-9, +, -, *, /, Enter, Backspace, Esc)
 - Tratamento seguro de divisão por zero e erros de sintaxe
 - Layout responsivo usando o gerenciador de geometria Grid
====================================================================
"""

import tkinter as tk
from tkinter import font
import re

class CalculadoraTkinter:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Calculadora Python - Tkinter")
        self.root.geometry("340x480")
        self.root.minsize(300, 420)
        self.root.configure(bg="#1e1e24")

        # Estado da calculadora
        self.expressao = ""
        self.novo_calculo = False

        # Construção da interface e eventos
        self.configurar_fontes()
        self.criar_interface()
        self.vincular_teclado()

    def configurar_fontes(self):
        """Define fontes legíveis para o visor e botões."""
        self.fonte_visor = font.Font(family="Consolas", size=24, weight="bold")
        self.fonte_botoes = font.Font(family="Segoe UI", size=13, weight="bold")

    def criar_interface(self):
        """Cria os componentes gráficos da calculadora (Visor e Botões)."""
        # 1. Visor de Exibição (Entry)
        self.visor = tk.Entry(
            self.root,
            font=self.fonte_visor,
            bg="#16171b",
            fg="#61afef",
            bd=0,
            justify="right",
            relief="flat",
            insertbackground="#ffffff"
        )
        self.visor.insert(0, "0")
        self.visor.config(state="readonly")
        self.visor.pack(fill="x", padx=16, pady=(20, 14), ipady=12)

        # 2. Container da Grade de Botões (Frame)
        grade = tk.Frame(self.root, bg="#1e1e24")
        grade.pack(fill="both", expand=True, padx=12, pady=(0, 16))

        # Configura as 5 linhas e 4 colunas com pesos iguais para expandirem
        for r in range(5):
            grade.rowconfigure(r, weight=1)
        for c in range(4):
            grade.columnconfigure(c, weight=1)

        # Definição dos botões: (Texto, Linha, Coluna, Cor Fundo, Cor Texto, Função)
        layout_botoes = [
            ("C",  0, 0, "#e06c75", "#ffffff", self.limpar_tudo),
            ("⌫",  0, 1, "#4b5263", "#ffffff", self.apagar_ultimo),
            ("%",  0, 2, "#4b5263", "#ffffff", self.calcular_porcentagem),
            ("÷",  0, 3, "#d19a66", "#ffffff", lambda: self.inserir_operador("/")),

            ("7",  1, 0, "#282c34", "#ffffff", lambda: self.inserir_numero("7")),
            ("8",  1, 1, "#282c34", "#ffffff", lambda: self.inserir_numero("8")),
            ("9",  1, 2, "#282c34", "#ffffff", lambda: self.inserir_numero("9")),
            ("×",  1, 3, "#d19a66", "#ffffff", lambda: self.inserir_operador("*")),

            ("4",  2, 0, "#282c34", "#ffffff", lambda: self.inserir_numero("4")),
            ("5",  2, 1, "#282c34", "#ffffff", lambda: self.inserir_numero("5")),
            ("6",  2, 2, "#282c34", "#ffffff", lambda: self.inserir_numero("6")),
            ("-",  2, 3, "#d19a66", "#ffffff", lambda: self.inserir_operador("-")),

            ("1",  3, 0, "#282c34", "#ffffff", lambda: self.inserir_numero("1")),
            ("2",  3, 1, "#282c34", "#ffffff", lambda: self.inserir_numero("2")),
            ("3",  3, 2, "#282c34", "#ffffff", lambda: self.inserir_numero("3")),
            ("+",  3, 3, "#d19a66", "#ffffff", lambda: self.inserir_operador("+")),

            ("±",  4, 0, "#3e4451", "#ffffff", self.inverter_sinal),
            ("0",  4, 1, "#282c34", "#ffffff", lambda: self.inserir_numero("0")),
            (".",  4, 2, "#3e4451", "#ffffff", self.inserir_ponto),
            ("=",  4, 3, "#98c379", "#1e1e24", self.calcular_resultado),
        ]

        # Instanciação dos botões no Grid
        for texto, l, c, bg_cor, fg_cor, comando in layout_botoes:
            btn = tk.Button(
                grade,
                text=texto,
                font=self.fonte_botoes,
                bg=bg_cor,
                fg=fg_cor,
                activebackground="#5c6370",
                activeforeground="#ffffff",
                bd=0,
                relief="flat",
                cursor="hand2",
                command=comando
            )
            btn.grid(row=l, column=c, padx=4, pady=4, sticky="nsew")

    def vincular_teclado(self):
        """Habilita atalhos para usar teclado numérico e padrão do computador."""
        self.root.bind("<Return>", lambda e: self.calcular_resultado())
        self.root.bind("<KP_Enter>", lambda e: self.calcular_resultado())
        self.root.bind("<BackSpace>", lambda e: self.apagar_ultimo())
        self.root.bind("<Escape>", lambda e: self.limpar_tudo())
        self.root.bind("<Key>", self.tratar_pressionamento_teclado)

    def tratar_pressionamento_teclado(self, evento):
        """Processa caracteres digitados no teclado."""
        tecla = evento.char
        if tecla in "0123456789":
            self.inserir_numero(tecla)
        elif tecla in "+-*/":
            self.inserir_operador(tecla)
        elif tecla in ".,":
            self.inserir_ponto()
        elif tecla == "%":
            self.calcular_porcentagem()

    def atualizar_visor(self, texto: str):
        """Altera o texto exibido no visor de forma segura."""
        self.visor.config(state="normal")
        self.visor.delete(0, tk.END)
        self.visor.insert(0, texto)
        self.visor.config(state="readonly")

    def inserir_numero(self, num: str):
        """Adiciona um dígito numérico à expressão."""
        if self.novo_calculo or self.expressao in ("0", "Erro", "Divisão por 0"):
            self.expressao = num
            self.novo_calculo = False
        else:
            self.expressao += num
        self.atualizar_visor(self.expressao)

    def inserir_operador(self, op: str):
        """Adiciona um operador (+, -, *, /) validando duplicidades."""
        self.novo_calculo = False
        if not self.expressao or self.expressao in ("Erro", "Divisão por 0"):
            if op == "-":
                self.expressao = "-"
                self.atualizar_visor(self.expressao)
            return

        # Substitui operador caso o usuário digite outro logo em seguida
        if self.expressao[-1] in "+-*/":
            self.expressao = self.expressao[:-1] + op
        else:
            self.expressao += op

        self.atualizar_visor(self.expressao)

    def inserir_ponto(self):
        """Garante que apenas um ponto decimal seja inserido por número."""
        if self.novo_calculo or not self.expressao or self.expressao in ("Erro", "Divisão por 0"):
            self.expressao = "0."
            self.novo_calculo = False
            self.atualizar_visor(self.expressao)
            return

        # Separa a expressão pelos operadores para analisar o último número
        termos = re.split(r'[\\+\\-\\*/]', self.expressao)
        ultimo_termo = termos[-1] if termos else ""

        if "." not in ultimo_termo:
            if self.expressao[-1] in "+-*/":
                self.expressao += "0."
            else:
                self.expressao += "."
            self.atualizar_visor(self.expressao)

    def inverter_sinal(self):
        """Inverte o sinal do valor atual (positivo <-> negativo)."""
        if not self.expressao or self.expressao in ("Erro", "Divisão por 0"):
            return
        try:
            val = float(eval(self.expressao))
            val = -val
            if val.is_integer():
                val = int(val)
            self.expressao = str(val)
            self.atualizar_visor(self.expressao)
        except Exception:
            pass

    def calcular_porcentagem(self):
        """Calcula o valor percentual da expressão atual."""
        if not self.expressao or self.expressao in ("Erro", "Divisão por 0"):
            return
        try:
            val = float(eval(self.expressao))
            res = val / 100
            if res.is_integer():
                res = int(res)
            self.expressao = str(res)
            self.atualizar_visor(self.expressao)
            self.novo_calculo = True
        except Exception:
            self.expressao = "Erro"
            self.atualizar_visor("Erro")

    def limpar_tudo(self):
        """Restaura a calculadora para o estado zero inicial."""
        self.expressao = ""
        self.novo_calculo = False
        self.atualizar_visor("0")

    def apagar_ultimo(self):
        """Remove o último caractere digitado (Backspace)."""
        if self.expressao and self.expressao not in ("Erro", "Divisão por 0"):
            self.expressao = self.expressao[:-1]
            self.atualizar_visor(self.expressao if self.expressao else "0")

    def calcular_resultado(self):
        """Executa o cálculo matemático da expressão com validação e segurança."""
        if not self.expressao or self.expressao in ("Erro", "Divisão por 0"):
            return

        # Impede cálculo se terminar com operador
        if self.expressao[-1] in "+-*/":
            self.expressao = self.expressao[:-1]

        try:
            # Segurança: permite apenas dígitos e operadores válidos
            if not re.match(r'^[0-9\\+\\-\\*/\\.\\s]+$', self.expressao):
                raise ValueError("Expressão inválida")

            # Avalia a expressão
            resultado = eval(self.expressao)

            # Formata inteiros sem o '.0'
            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)
            elif isinstance(resultado, float):
                # Arredonda dízimas longas para 8 casas decimais
                resultado = round(resultado, 8)

            self.expressao = str(resultado)
            self.atualizar_visor(self.expressao)
            self.novo_calculo = True

        except ZeroDivisionError:
            self.expressao = "Divisão por 0"
            self.atualizar_visor("Erro: Divisão por 0")
            self.novo_calculo = True
        except Exception:
            self.expressao = "Erro"
            self.atualizar_visor("Erro de sintaxe")
            self.novo_calculo = True


if __name__ == "__main__":
    # Inicializa a janela principal do Tkinter
    janela_principal = tk.Tk()
    app = CalculadoraTkinter(janela_principal)
    # Inicia o loop de eventos da interface gráfica
    janela_principal.mainloop()
`;

export const CODIGO_SIMPLES = `"""
====================================================================
 Calculadora Simples em Python com Tkinter (Procedural para Iniciantes)
====================================================================
Ideal para quem está começando a aprender Python e Tkinter!
====================================================================
"""

import tkinter as tk

# Inicialização da janela principal
janela = tk.Tk()
janela.title("Calculadora Simples")
janela.geometry("300x380")
janela.resizable(False, False)

# Variável global para armazenar a conta
expressao = ""

def atualizar_visor(valor):
    visor.delete(0, tk.END)
    visor.insert(0, valor)

def clicar(numero_ou_operador):
    global expressao
    expressao += str(numero_ou_operador)
    atualizar_visor(expressao)

def limpar():
    global expressao
    expressao = ""
    atualizar_visor("0")

def calcular():
    global expressao
    try:
        resultado = eval(expressao)
        if isinstance(resultado, float) and resultado.is_integer():
            resultado = int(resultado)
        expressao = str(resultado)
        atualizar_visor(expressao)
    except ZeroDivisionError:
        atualizar_visor("Erro: Divisão por 0")
        expressao = ""
    except Exception:
        atualizar_visor("Erro")
        expressao = ""

# Visor da calculadora (Entry)
visor = tk.Entry(janela, font=("Arial", 20), justify="right", bd=4, relief="ridge")
visor.grid(row=0, column=0, columnspan=4, padx=10, pady=15, ipady=8, sticky="nsew")
visor.insert(0, "0")

# Lista com a ordem dos botões: (texto, linha, coluna)
botoes = [
    ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('/', 1, 3),
    ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
    ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('-', 3, 3),
    ('0', 4, 0), ('.', 4, 1), ('=', 4, 2), ('+', 4, 3),
]

# Configura as linhas e colunas para expandirem uniformemente
for r in range(6):
    janela.rowconfigure(r, weight=1)
for c in range(4):
    janela.columnconfigure(c, weight=1)

# Criação dinâmica dos botões numéricos e operadores
for texto, linha, coluna in botoes:
    if texto == '=':
        btn = tk.Button(janela, text=texto, font=("Arial", 14, "bold"), bg="#4CAF50", fg="white", command=calcular)
    else:
        btn = tk.Button(janela, text=texto, font=("Arial", 14), command=lambda t=texto: clicar(t))
    btn.grid(row=linha, column=coluna, padx=3, pady=3, sticky="nsew")

# Botão Limpar (C) que ocupa toda a linha inferior
btn_limpar = tk.Button(janela, text="Limpar (C)", font=("Arial", 12, "bold"), bg="#f44336", fg="white", command=limpar)
btn_limpar.grid(row=5, column=0, columnspan=4, padx=10, pady=(4, 12), sticky="nsew")

# Mantém a janela aberta e respondendo aos cliques
janela.mainloop()
`;

export const CODIGO_CUSTOM_TKINTER = `"""
====================================================================
 Calculadora Moderna com CustomTkinter
====================================================================
Para executar esta versão moderna, instale antes o pacote:
    pip install customtkinter
====================================================================
"""

import customtkinter as ctk

ctk.set_appearance_mode("dark")  # Opções: "dark", "light" ou "system"
ctk.set_default_color_theme("blue")

class CalculadoraModerna(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Calculadora CustomTkinter")
        self.geometry("340x480")
        self.resizable(False, False)

        self.expressao = ""

        # Visor moderno arredondado
        self.visor = ctk.CTkEntry(
            self,
            font=("Consolas", 26, "bold"),
            justify="right",
            height=60,
            corner_radius=12
        )
        self.visor.pack(padx=16, pady=20, fill="x")
        self.visor.insert(0, "0")

        # Container para os botões
        grade = ctk.CTkFrame(self, fg_color="transparent")
        grade.pack(padx=12, pady=(0, 20), fill="both", expand=True)

        for i in range(5):
            grade.rowconfigure(i, weight=1)
        for j in range(4):
            grade.columnconfigure(j, weight=1)

        botoes = [
            ("C", 0, 0, "#e74c3c", self.limpar),
            ("⌫", 0, 1, "#34495e", self.apagar),
            ("%", 0, 2, "#34495e", self.porcentagem),
            ("÷", 0, 3, "#f39c12", lambda: self.inserir("/")),

            ("7", 1, 0, "#2c3e50", lambda: self.inserir("7")),
            ("8", 1, 1, "#2c3e50", lambda: self.inserir("8")),
            ("9", 1, 2, "#2c3e50", lambda: self.inserir("9")),
            ("×", 1, 3, "#f39c12", lambda: self.inserir("*")),

            ("4", 2, 0, "#2c3e50", lambda: self.inserir("4")),
            ("5", 2, 1, "#2c3e50", lambda: self.inserir("5")),
            ("6", 2, 2, "#2c3e50", lambda: self.inserir("6")),
            ("-", 2, 3, "#f39c12", lambda: self.inserir("-")),

            ("1", 3, 0, "#2c3e50", lambda: self.inserir("1")),
            ("2", 3, 1, "#2c3e50", lambda: self.inserir("2")),
            ("3", 3, 2, "#2c3e50", lambda: self.inserir("3")),
            ("+", 3, 3, "#f39c12", lambda: self.inserir("+")),

            ("±", 4, 0, "#34495e", self.inverter),
            ("0", 4, 1, "#2c3e50", lambda: self.inserir("0")),
            (".", 4, 2, "#34495e", lambda: self.inserir(".")),
            ("=", 4, 3, "#27ae60", self.calcular),
        ]

        for txt, l, c, cor, cmd in botoes:
            btn = ctk.CTkButton(
                grade,
                text=txt,
                font=("Segoe UI", 16, "bold"),
                fg_color=cor,
                hover_color="#555555",
                corner_radius=10,
                command=cmd
            )
            btn.grid(row=l, column=c, padx=4, pady=4, sticky="nsew")

    def inserir(self, val):
        self.expressao += val
        self.atualizar(self.expressao)

    def limpar(self):
        self.expressao = ""
        self.atualizar("0")

    def apagar(self):
        self.expressao = self.expressao[:-1]
        self.atualizar(self.expressao if self.expressao else "0")

    def inverter(self):
        try:
            v = -float(eval(self.expressao))
            self.expressao = str(int(v) if v.is_integer() else v)
            self.atualizar(self.expressao)
        except Exception:
            pass

    def porcentagem(self):
        try:
            v = float(eval(self.expressao)) / 100
            self.expressao = str(int(v) if v.is_integer() else v)
            self.atualizar(self.expressao)
        except Exception:
            pass

    def calcular(self):
        try:
            res = eval(self.expressao)
            self.expressao = str(int(res) if isinstance(res, float) and res.is_integer() else res)
            self.atualizar(self.expressao)
        except ZeroDivisionError:
            self.atualizar("Erro: Divisão por 0")
            self.expressao = ""
        except Exception:
            self.atualizar("Erro")
            self.expressao = ""

    def atualizar(self, texto):
        self.visor.delete(0, "end")
        self.visor.insert(0, texto)

if __name__ == "__main__":
    app = CalculadoraModerna()
    app.mainloop()
`;
