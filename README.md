# 🤖 Assistente de Registros Acadêmicos

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Licença](https://img.shields.io/badge/licen%C3%A7a-propriet%C3%A1ria-0E2A63)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Dependências](https://img.shields.io/badge/depend%C3%AAncias-zero-brightgreen)

Chatbot em **HTML5, CSS3 e JavaScript puros** que conduz docentes, em formato de conversa, pela criação de registros acadêmicos (feedback ou observação) prontos para colar no Sistema Educacional — sem instalação, sem build e sem nenhuma biblioteca externa.

---

## 📋 Sobre o projeto

O **Assistente de Registros Acadêmicos** recria, em formato de chatbot, a jornada do *Gerador de Registros Educacionais* utilizado pelo corpo docente para padronizar os registros de acompanhamento pedagógico do estudante (frequência, avaliação, recuperação, faltas, atestados, entre outros), conforme o Regimento Escolar vigente.

Em vez de um formulário tradicional, o(a) docente é guiado(a) por uma conversa: escolhe o perfil do(a) discente, informa se houve conversa pessoal, seleciona os assuntos aplicáveis num painel dedicado e recebe um texto já formatado — editável e pronto para revisão antes de ser copiado ao Sistema Educacional.

**Por que existe:** reduzir o tempo de preenchimento, padronizar a linguagem institucional e reforçar a importância de personalizar cada registro, sem abrir mão da agilidade.

---
# Mapeamento de Situações para Registros Educacionais (Feedbacks e Observações)

Esta documentação apresenta a estrutura de situações mapeadas no sistema para orientação, formalização de feedbacks e registros de observações no processo de ensino-aprendizagem. Os itens estão categorizados em eixos temáticos para facilitar a seleção correlacionada por parte do corpo docente.

---

## 1. Eixo: Assiduidade e Pontualidade
* **Descrição do Eixo:** Reúne as situações voltadas ao acompanhamento do cumprimento do cronograma escolar, controle de faltas e impactos da frequência no percurso formativo.
* **Item 1:** Necessidade de FREQUÊNCIA nas atividades conforme cronograma.
* **Item 2:** AUSÊNCIA nas atividades previstas em cronograma.
* **Item 3:** SAÍDA ANTECIPADA (com recorrência).
* **Item 4:** REPROVA por FREQUÊNCIA.

---

## 2. Eixo: Amparo Legal, Faltas e Atestados
* **Descrição do Eixo:** Contempla as orientações relativas à justificativa e ao abono de ausências, regras para protocolo de documentos na Secretaria e os enquadramentos previstos na legislação educacional e regimental.
* **Item 5:** FALTAS para situações não previstas no Regimento.
* **Item 6:** Faltas com AMPARO LEGAL.
* **Item 7:** Envio de ATESTADOS.

---

## 3. Eixo: Processo Avaliativo, Recuperação e Resultados
* **Descrição do Eixo:** Agrupa as situações focadas na sistemática de avaliação da aprendizagem, registro de menções/indicadores, oportunidades de recuperação contínua e procedimentos formais de divulgação, revisão e recurso.
* **Item 8:** Critérios de AVALIAÇÃO nas Unidades Curriculares.
* **Item 9:** NÃO ENTREGA de atividades propostas.
* **Item 10:** Oportunidade de RECUPERAÇÃO da APRENDIZAGEM.
* **Item 11:** REPROVA por MENÇÃO.
* **Item 12:** Divulgação de frequência.
* **Item 13:** REVISÃO e RECURSO de frequência, menções ou notas.

---

## 4. Eixo: Convivência, Clima Escolar e Saúde Mental
* **Descrição do Eixo:** Focado nas relações interpessoais, desenvolvimento de competências socioemocionais (*soft skills*), acolhimento de questões de saúde mental, combate ao bullying e promoção da cultura de paz no ambiente presencial ou virtual.
* **Item 14:** CONVIVÊNCIA e respeito às normas institucionais.
* **Item 15:** PREVENÇÃO ao BULLYING e CYBERBULLYING no ambiente escolar.
* **Item 16:** CULTURA DE PAZ e NÃO DISCRIMINAÇÃO na comunidade escolar.
* **Item 17:** ACOMPANHAMENTO PEDAGÓGICO em questões de Saúde Mental.
* **Item 18:** DESEMPENHO e COLABORAÇÃO em atividades de grupo (Soft Skills).

---

## 5. Eixo: Conduta, Segurança e Patrimônio
* **Descrição do Eixo:** Trata do cumprimento das diretrizes operacionais e disciplinares da instituição, zelando pela segurança física e digital, integridade do patrimônio e conformidade com as normas e políticas institucionais (como a Política de Segurança da Informação - PSI).
* **Item 19:** PROIBIÇÃO do uso de SUBSTÂNCIAS PSICOATIVAS.
* **Item 20:** Uso adequado dos RECURSOS TECNOLÓGICOS e PSI.
* **Item 21:** PRESERVAÇÃO do PATRIMÔNIO e ambientes de aprendizagem.

---

## 🖥️ Demonstração (Para Usuários em Geral)

> Versão publicada (live) na Vercel. 
[https://qualified-record-chat-generator.vercel.app/](https://qualified-record-chat-generator.vercel.app/)

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica da aplicação |
| **CSS3** | Layout (Flexbox), variáveis nativas (Custom Properties), responsividade |
| **JavaScript (ES5+)** | Motor da conversa, geração de texto, Clipboard API com fallback |

Nenhum framework, biblioteca ou dependência externa (sem jQuery, sem CDN, sem *build step*) — o objetivo é rodar em qualquer navegador e ambiente, inclusive offline.

---

## 🚀 Como executar (Para desenvolvedores)

Pré-requisito: apenas um navegador atualizado (Chrome, Edge, Firefox ou Safari).

```bash
# 1. Clone o repositório
git clone https://github.com/<organizacao>/<repositorio>.git

# 2. Acesse a pasta do projeto
cd <repositorio>

# 3. Abra o index.html diretamente no navegador
#    (duplo clique no arquivo, ou:)
open index.html        # macOS
start index.html        # Windows
```

Opcionalmente, para simular um servidor local (recomendado ao testar a Clipboard API em `https`/`localhost`):

```bash
# Com Python 3 instalado
python3 -m http.server 8000
# Acesse http://localhost:8000
```

---

## 💬 Como usar

1. **Perfil do(a) discente** — selecione Aluno ou Aluna.
2. **Tipo de registro** — informe se houve conversa pessoal (define entre *Ações de Feedback* ou *Observações do Aluno*).
3. **Itens do registro** — no painel lateral, marque um ou mais assuntos (frequência, avaliação, recuperação, faltas, atestados etc.) e toque em **Gerar Registro**.
4. **Texto revisado** — releia e personalize o texto sugerido no campo editável.
5. **Copiar** — no primeiro clique, é exibido um lembrete para personalizar o texto; no clique seguinte, o conteúdo é copiado para a área de transferência, pronto para colar no Sistema Educacional.

A qualquer momento é possível tocar em **Novo registro** para recomeçar, ou no botão **(i)** para consultar o aviso sobre uso de dados (LGPD).

---

## 📁 Estrutura do projeto

```
registro-chat/
├── index.html   # Estrutura da tela principal e do painel lateral
├── style.css    # Estilos, tema de cores institucional e responsividade
├── script.js    # Lógica da conversa, dados dos itens e geração do texto
└── README.md    # Este arquivo
```

---

## 🤝 Como contribuir

Este é um projeto **institucional de uso restrito** (veja [Licença](#-licença)). Contribuições são bem-vindas apenas de colaboradores(as) autorizados(as) pela instituição.

1. Abra uma **issue** descrevendo o problema encontrado ou a melhoria sugerida.
2. Após alinhamento com o(a) responsável pelo projeto, crie um branch a partir de `main`:
   ```bash
   git checkout -b ajuste/nome-da-alteracao
   ```
3. Faça commits pequenos e descritivos.
4. Abra um **Pull Request** referenciando a issue correspondente, para revisão antes do merge.

Pessoas fora da instituição podem relatar problemas por meio de uma issue, mas o código-fonte não aceita contribuições externas sem autorização prévia.

---

## 📄 Licença

Este projeto é de **propriedade exclusiva da instituição** à qual o(a) desenvolvedor(a) está vinculado(a). O código é disponibilizado neste repositório **exclusivamente para fins de transparência, avaliação técnica e colaboração previamente autorizada**.

Não é permitido copiar, redistribuir, sublicenciar ou utilizar este código, total ou parcialmente, fora do contexto institucional, sem autorização expressa e por escrito da instituição responsável. Todos os direitos reservados.

---

## ✉️ Autoria

Arquitetura original de concepção do autor (Adilson G Andrade). [https://github.com/labSenacSor/qualified-record-generator](https://github.com/labSenacSor/qualified-record-generator)

Mecânica Chat inspirada no projeto [https://github.com/eduardotkoller/convform](https://github.com/eduardotkoller/convform).

Desenvolvido por **Adilson G Andrade** (Senac SOR).

&copy; 2026 — Todos os direitos reservados.
