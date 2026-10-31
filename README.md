🧮 Calculadora Interativa Desktop em Python

Potência, estabilidade e nostalgia em uma única aplicação!

Uma calculadora desktop desenvolvida em Python com Tkinter, que combina operações matemáticas, interface gráfica interativa, atalhos de teclado e temas visuais inspirados em diferentes gerações do Windows.

O projeto foi desenvolvido com auxílio do Google AI Studio, durante a imersão da Alura, como uma oportunidade de explorar programação, desenvolvimento de interfaces gráficas e recursos de inteligência artificial.

---

📸 Demonstração do Projeto

A aplicação apresenta três estilos visuais que permitem personalizar a experiência do usuário.

┌──────────────────────────────────────┐
│       🧮 CALCULADORA DESKTOP          │
├──────────────────────────────────────┤
│                                      │
│                 125,50               │
│                                      │
├────────┬────────┬────────┬───────────┤
│   C    │   ⌫    │   %    │     ±     │
├────────┼────────┼────────┼───────────┤
│   7    │   8    │   9    │     ÷     │
├────────┼────────┼────────┼───────────┤
│   4    │   5    │   6    │     ×     │
├────────┼────────┼────────┼───────────┤
│   1    │   2    │   3    │     −     │
├────────┼────────┼────────┼───────────┤
│   0    │   .    │   =    │     +     │
└────────┴────────┴────────┴───────────┘

Representação ilustrativa da interface.

---

🎨 1. Temas Visuais

A interface oferece diferentes estilos visuais para tornar a utilização mais personalizada.

Tema| Características
🌙 Moderno| Dark Mode, fundo escuro e display em verde neon.
🪟 Windows XP| Visual inspirado nas cores e interfaces clássicas do Windows XP.
💾 Windows 98| Aparência retrô, com tons de cinza e botões em relevo.

Fluxo de personalização

       ┌───────────────────┐
       │  Abrir Calculadora│
       └─────────┬─────────┘
                 │
                 ▼
       ┌───────────────────┐
       │ Selecionar Tema   │
       └─────────┬─────────┘
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
   ┌────────┐ ┌──────┐ ┌────────┐
   │Moderno │ │ XP   │ │ Win 98 │
   └────────┘ └──────┘ └────────┘

---

⚙️ 2. Funcionalidades

Operações matemáticas

- ➕ Adição.
- ➖ Subtração.
- ✖️ Multiplicação.
- ➗ Divisão.
- 💯 Cálculo de porcentagem.
- ➕➖ Inversão de sinal.
- 🔢 Entrada de números decimais.
- 🧹 Limpeza completa do visor.
- ⌫ Exclusão do último caractere.

⌨️ Atalhos de teclado

A aplicação permite realizar operações utilizando o teclado físico do computador.

Tecla| Ação
"0–9"| Inserir números
"+ - * /"| Inserir operadores
"Enter"| Calcular resultado
"Backspace"| Apagar o último caractere
"Esc"| Limpar a tela
"."| Inserir separador decimal

---

🛡️ 3. Tratamento de Erros

A aplicação utiliza tratamento de exceções para lidar com entradas inválidas e situações inesperadas durante os cálculos.

Fluxo de tratamento

     Entrada do usuário
             │
             ▼
      Processamento
             │
             ▼
    ┌─────────────────┐
    │ Expressão válida?│
    └────────┬────────┘
             │
       ┌─────┴─────┐
       ▼           ▼
      SIM         NÃO
       │           │
       ▼           ▼
  Resultado     Mensagem
  no visor      de erro

Benefícios:

- Tratamento de divisão por zero.
- Identificação de expressões inválidas.
- Exibição controlada de mensagens de erro.
- Maior estabilidade durante a utilização.

---

📊 4. Visão Geral dos Recursos

RECURSOS DA APLICAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Operações matemáticas  ██████████  100%
Temas visuais          ██████████  100%
Atalhos de teclado     ██████████  100%
Tratamento de erros    ██████████  100%
Logs de eventos        ██████████  100%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gráfico ilustrativo de funcionalidades previstas no projeto, não de métricas de desempenho ou resultados de testes.

---

🔊 5. Monitoramento de Eventos

O projeto conta com registros de eventos no terminal, permitindo acompanhar as interações realizadas durante a utilização da calculadora.

Exemplo ilustrativo:

[INFO] Clique: 7
[INFO] Clique: +
[INFO] Clique: 5
[INFO] Operação executada
[INFO] Resultado: 12

Esse recurso facilita a observação do comportamento da aplicação e ajuda a compreender o fluxo de execução.

---

💻 6. Tecnologias Utilizadas

Tecnologia| Aplicação no projeto
🐍 Python| Lógica de programação e operações matemáticas
🖥️ Tkinter| Desenvolvimento da interface gráfica
🤖 Google AI Studio| Auxílio no desenvolvimento do projeto
📦 PyInstaller| Empacotamento para distribuição, quando configurado
🐙 Git e GitHub| Versionamento e hospedagem do código

---

📈 7. Fluxo de Funcionamento

┌─────────────────────┐
│   Interface Tkinter │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Entrada do Usuário  │
│ Botões ou Teclado   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Processamento Python│
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Validação e Cálculo │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Exibição do Resultado│
└─────────────────────┘

---

🚀 8. Como Executar o Projeto

Pré-requisitos

- Python instalado.
- Tkinter disponível na instalação do Python.
- Git, caso deseje clonar o repositório.

Passo 1 — Clonar o repositório

git clone https://github.com/Ti31-o/Calculadora-Python.git

Passo 2 — Entrar na pasta

cd Calculadora-Python

Passo 3 — Executar a aplicação

O nome do arquivo abaixo é um exemplo. Utilize o nome real do script existente no repositório.

python calculadora.py

No Windows, também pode ser necessário utilizar:

py calculadora.py

Gerar um executável para Windows

Se o projeto estiver preparado para empacotamento, instale o PyInstaller:

pip install pyinstaller

Depois, execute:

pyinstaller --onefile --noconsole calculadora.py

O executável será gerado na pasta "dist", desde que a compilação seja concluída com sucesso. A distribuição deve ser testada no ambiente de destino.

---

🎯 9. Objetivo do Projeto

Consolidar conhecimentos em Python, lógica de programação, interfaces gráficas, manipulação de eventos, tratamento de exceções e organização de aplicações desktop.

O desenvolvimento também proporcionou contato prático com ferramentas de inteligência artificial como apoio à criação de software.

---

📚 10. Aprendizados

- Desenvolvimento de interfaces gráficas com Tkinter.
- Manipulação de eventos de teclado e botões.
- Organização da lógica de uma aplicação.
- Tratamento de erros e exceções.
- Personalização de interfaces por meio de temas.
- Utilização de inteligência artificial como apoio ao desenvolvimento.
- Versionamento e publicação de projetos no GitHub.

---

👨‍💻 Sobre o Projeto

Este projeto faz parte da minha jornada de aprendizado contínuo em tecnologia e desenvolvimento de software.

Acredito que a prática é fundamental para transformar conhecimento em experiência, construir um portfólio e evoluir profissionalmente na área de tecnologia.

🔗 Repositório: https://github.com/Ti31-o/Calculadora-Python

⭐ Se gostou do projeto, deixe uma estrela no repositório!

Tecnologias e interesses

"Python" · "Tkinter" · "GitHub" · "Desenvolvimento de Software" · "Inteligência Artificial" · "Programação" 
