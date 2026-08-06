/* =========================================================================
   Assistente de Registros Acadêmicos
   Recriação, em formato de chatbot, do "Gerador de Registros Educacionais"
   (index.html / js/script.js originais, LabSenac / Adilson Andrade).
  ========================================================================= */

(function () {
  "use strict";

  /* ---------- Elementos ---------- */
  var chatEl = document.getElementById("chat");
  var optionsEl = document.getElementById("options");
  var progressEl = document.getElementById("progress");
  var restartBtn = document.getElementById("restartBtn");
  var infoBtn = document.getElementById("infoBtn");
  var footerActionsEl = document.getElementById("footerActions");
  var sidePanelEl = document.getElementById("sidePanel");
  var panelTitleEl = document.getElementById("panelTitle");
  var panelBodyEl = document.getElementById("panelBody");
  var panelFooterEl = document.getElementById("panelFooter");
  var panelCloseBtn = document.getElementById("panelCloseBtn");

  /* ---------- Estado ---------- */
  var state = {
    discente: null,     // "Aluno orientado" | "Aluna orientada"
    tipoRegistro: null, // "feedback" | "observacao"
    itensSelecionados: [], // array de ids
    avisoVisto: false,  // já viu o aviso "antes de copiar" para este registro?
    step: "perfil"
  };

  var copyBtnEl = null;   // referência ao botão de copiar, no rodapé fixo
  var panelMode = null;   // qual conteúdo está aberto no painel lateral: "itens" | "aviso-copia" | "info"

  /* ---------- Dados: perfil do(a) discente ---------- */
  var PERFIS = [
    { label: "Aluno", value: "Aluno orientado" },
    { label: "Aluna", value: "Aluna orientada" }
  ];

  /* ---------- Dados: tipo de registro (igual ao radio "tipoRegistro" original) ---------- */
  var TIPOS_REGISTRO = {
    feedback: {
      label: "Sim",
      titulo: "AÇÕES DE FEEDBACK",
      explicacao: "O feedback é uma devolutiva ao estudante sobre o resultado de uma avaliação, esse registro deve evidenciar os avanços e desafios do estudante no seu processo de aprendizagem.\n\nÉ possível realizar quantos registros de feedback forem necessários ao longo da unidade curricular.",
      prefixo: function (discente) { return discente + " "; },
      ctrlV: "Pressione CTRL + V no Sistema Educacional para registrar seu FEEDBACK.\nSiga as orientações apresentadas acima.\n\nCaminho de acesso no Senac Solution: Autoatendimento > Nota/Menções e Atividades > Selecionar o período letivo e clicar em continuar > Clicar no ícone Avaliação do Processo > Acessar o link Ações de Recuperação/Feedbacks > Acessar o link Ações de Feedback e preencher o campo.\n\nDúvidas acesse: https://www.intranet.sp.senac.br/arquivos/GDs/supervisao_educacional/Principais_Registros_no_Diario_de_Classe.pdf"
    },
    observacao: {
      label: "Não",
      titulo: "OBSERVAÇÕES DO ALUNO",
      explicacao: "O campo Observações do aluno auxilia os docentes e as equipes técnicas e de secretaria a acompanharem e entenderem o processo educacional.\n\nRegistre informações adicionais ao processo de aprendizagem do estudante, você sempre DEVE ESCLARECER o que foi perdido ou comprometido ao registrar suas observações.",
      prefixo: function () { return "Constatou-se necessário acompanhamento "; },
      ctrlV: "Pressione CTRL + V no Sistema Educacional para registrar sua OBSERVAÇÃO.\nSiga as orientações apresentadas acima.\n\nCaminho de acesso no Senac Solution: Autoatendimento > Nota/Menções e Atividades > Selecionar o período letivo e clicar em continuar > Clicar no ícone Avaliação do Processo > Acessar o link Registro Parcial do Indicador > Clicar no link observação docente e registrar.\n\nDúvidas acesse: https://www.intranet.sp.senac.br/arquivos/GDs/supervisao_educacional/Principais_Registros_no_Diario_de_Classe.pdf"
    }
  };

    /* ---------- Dados: de feedback e observações ---------- */
  var ITENS = [
    {
      id: "item1",
      label: "FREQUÊNCIA mínima nas atividades.",
      value: "sobre a necessidade de FREQUÊNCIA nas atividades conforme cronograma: Orientação que A frequência mínima de 75% é obrigatória para aprovação e é apurada na carga horária total ministrada em cada componente curricular., conforme Título VI - Da Avaliação do Estudante, Capítulo II – dos Critérios e Formas de Avaliação, Seção I – Da Frequência - Artigo 55 do Regimento Escolar Vigente."
    },
    {
      id: "item2",
      label: "AUSÊNCIA nas atividades previstas.",
      value: "sobre a AUSÊNCIA nas atividades previstas em cronograma: Orientação que a AUSÊNCIA compromete (...) O resultado da avaliação do desempenho do estudante, na perspectiva do desenvolvimento das competências profissionais, é expresso por menções relativas aos componentes curriculares descritos nos planos de curso., conforme Capítulo II - Dos critérios e formas de avaliação, Seção II - Do desempenho – Artigo 60 do Regimento Escolar vigente."
    },
    {
      id: "item3",
      label: "SAÍDA ANTECIPADA (com recorrência).",
      value: "sobre a SAÍDA ANTECIPADA (com recorrência): Orientação que a SAÍDA ANTECIPADA recorrente compromete (...) O resultado da avaliação do desempenho do estudante, na perspectiva do desenvolvimento das competências profissionais, é expresso por menções relativas aos componentes curriculares descritos nos planos de curso., conforme Capítulo II - Dos critérios e formas de avaliação, Seção II - Do desempenho – Artigo 60 do Regimento Escolar vigente."
    },
    {
      id: "item4",
      label: "Critérios de AVALIAÇÃO nas UC´s.",
      value: "sobre os CRITÉRIOS DE AVALIAÇÃO nas Unidades Curriculares: Orientação que (...) Será considerado aprovado o estudante que obtiver a menção Desenvolvida e a frequência igual ou superior a 75% em cada componente curricular, de acordo com o Plano de Curso., conforme Capítulo II - Dos critérios e formas de avaliação, Seção II - Do desempenho – Artigo 61 do Regimento Escolar vigente."
    },
    {
      id: "item5",
      label: "NÃO ENTREGA de atividades propostas.",
      value: "sobre NÃO ENTREGA de atividades propostas: Orientação que (...) Para acompanhar o desenvolvimento de ensino e aprendizagem e o desempenho dos estudantes nos cursos (...) serão feitos registros parciais por componente curricular com foco nos indicadores descritos nos planos de curso. A NÃO ENTREGA de atividades ensejará registro como Não Atendido durante o desenvolvimento do componente curricular. - Conforme Capítulo II - Dos critérios e formas de avaliação, Seção II - Do desempenho – Artigo 59 do Regimento Escolar vigente."
    },
    {
      id: "item6",
      label: "Divulgação de FREQUÊNCIA.",
      value: "sobre DIVULGAÇÃO de frequência: Orientação que Os resultados sobre, menções ou notas são divulgados na área exclusiva no endereço eletrônico www.sp.senac.br. Orientação de utilizar a Área Exclusiva no Portal ou APP Senac - conforme Título VII - Do Registro Escolar - Capítulo I - Da divulgação dos resultados. - Artigo 70 do Regimento Escolar Vigente."
    },
    {
      id: "item7",
      label: "RECUPERAÇÃO da Aprendizagem.",
      value: "sobre a oportunidade de RECUPERAÇÃO da APRENDIZAGEM: Orientação que Atendendo ao princípio da avaliação contínua e qualitativa, devem ser oferecidas aos estudantes, oportunidades de recuperação no decorrer do processo educacional, organizadas em diferentes formatos que possibilitem novas situações de aprendizagem. Conforme Título VI - Da Avaliação do Estudante, Capítulo II – dos Critérios e Formas de Avaliação, Seção I – Da Frequência - Artigo 54 - Parágrafo 3º do Regimento Escolar Vigente."
    },
    {
      id: "item8",
      label: "REPROVA por FREQUÊNCIA.",
      value: "sobre REPROVA POR FREQUÊNCIA: Constatou-se que as FALTAS INJUSTIFICADAS, EXCEDERAM O LIMITE REGIMENTAL, se não houver documentação com amparo legal, esta UC quando de seu encerramento, ensejará REPROVA POR FREQUÊNCIA, conforme Título VI - Da Avaliação do Estudante, Capítulo II – dos Critérios e Formas de Avaliação, Seção I – Da Frequência - Artigo 55 do Regimento Escolar Vigente. Se configurar-se a Reprova por Frequência, esta UC poderá ser refeita em turma futura atendendo as exigências do Plano de Curso vigente na época. Estudante orientado a sempre verificar junto à Secretaria Educacional o andamento da análise de documentos encaminhados na Área Exclusiva do Portal ou APP Senac."
    },
    {
      id: "item9",
      label: "REPROVA por MENÇÃO.",
      value: "sobre REPROVA POR MENÇÃO: Orientação que mesmo após oportunidades de recuperação de aprendizagem, NÃO ATENDEU integralmente os indicadores propostos, restando a menção final como NÃO DESENVOLVIDA (ND) (...) O resultado da avaliação do desempenho do estudante, na perspectiva do desenvolvimento das competências profissionais, é expresso por menções relativas aos componentes curriculares descritos nos planos de curso., conforme Capítulo II - Dos critérios e formas de avaliação, Seção II - Do desempenho – Artigo 60 do Regimento Escolar vigente. Orientação que esta UC poderá ser refeita em turma futura atendendo as exigências do Plano de Curso vigente na época."
    },
    {
      id: "item10",
      label: "REVISÃO e RECURSO (frequência ou menções).",
      value: "sobre REVISÃO e RECURSO: Orientação que o pedido de revisão consiste exclusivamente na verificação, pelos docentes, dos resultados relativos a frequência, menções ou notas. (...) Os estudantes poderão solicitar a revisão na Secretaria Escolar ou na área exclusiva no endereço eletrônico www.sp.senac.br, no prazo de até 20 (vinte) dias corridos a partir da data de término dos componentes curriculares. - Conforme Capítulo II - Da Revisão e do Recurso - Artigos 73 e 74 do Regimento Escolar Vigente."
    },
    {
      id: "item11",
      label: "FALTAS para situações não previstas.",
      value: "sobre FALTAS para situações não previstas: Orientação que Faltas motivadas por razões não previstas na legislação educacional ou no Regimento Escolar vigente, como saúde ou falecimento de familiares, participação em júris, eleições e doações de sangue, devem ser registradas e contabilizadas dentro do limite de 25% permitido para ausência dos estudantes. - conforme Capitulo II - Dos Critérios e Forma de Avaliação, Seção I - Da Frequência - Subseção I - Do Amparo Legal de Faltas - Artigo 58 do Regimento Escolar vigente."
    },
    {
      id: "item12",
      label: "Faltas com AMPARO LEGAL.",
      value: "sobre FALTA COM AMPARO LEGAL: Orientação que Os estudantes podem requerer amparo legal, com tratamento excepcional, mediante documentos comprobatórios para análise e deferimento do Setor Técnico, exclusivamente para faltas motivadas pelos motivos a seguir: I - estudantes impossibilitados de frequentar as aulas em razão de tratamento de saúde ou de condição de saúde que impossibilite o acesso à instituição de ensino, nos termos do Decreto-lei nº 1.044/1969, atualizado pela Lei nº 14.952/24; II - gestantes, 90 (noventa) dias a partir do 8º (oitavo) mês de gestação, nos termos da Lei nº 6.202/1975; III - adotantes, nos termos da Lei nº 10.421/2002; IV - atividade desportiva, nos termos da Lei nº 9.615/1998; V - crença religiosa, nos termos da Lei nº 13.796/2019; VI - licença-paternidade, excepcionalmente, nos termos da Consolidação das Leis do Trabalho (CLT); VII - estudantes do Ensino Médio Técnico Integrado, nos termos da Lei de Diretrizes e Bases da Educação Nacional (LDB), para faltas nas atividades práticas de Educação Física; VIII - serviço militar, exclusivamente com abono de faltas, nos termos da Lei nº 4.375/1964. IX - lactantes até o 6º mês de lactação, nos termos da Lei nº 6.202/1975 e da Lei nº 14.952/24 - conforme Capitulo II - Dos Critérios e Forma de Avaliação, Seção I - Da Frequência - Subseção I - Do Amparo Legal de Faltas - Artigo 56 do Regimento Escolar vigente."
    },
    {
      id: "item13",
      label: "Envio de ATESTADOS.",
      value: "sobre o ENVIO DE ATESTADOS: Orientação que Os estudantes podem requerer amparo legal, com tratamento excepcional, mediante documentos comprobatórios para análise e deferimento do Setor Técnico (...) recomenda-se encaminhar cópia digital/escaneada no caso de ATESTADOS DE AFASTAMENTO, com assinatura física ou digital do médico inscrito no CRM, no prazo de até sete dias corridos através da Área Exclusiva do Portal ou APP Senac. Salienta-se que ATESTADOS DE COMPARECIMENTO não são documentos hábeis para tratamento excepcional pois não se enquadram no item I do Artigo 56 do Regimento Escolar vigente, conforme Capítulo II - Dos Critérios e Forma de Avaliação, Seção I - Da Frequência - Subseção I - Do Amparo Legal de Faltas."
    }
  ];

  var originalFeedback = "";

  /* ---------- Passo 1: perfil do(a) discente ---------- */
  function perguntaPerfil() {
    setStep("perfil");
    botMessage("Olá! Eu sou o assistente de registros educacionais. Vou te ajudar a montar o texto revisado, do jeitinho que o Sistema Educacional espera. Para começar: selecione o perfil discente.", function () {
      showOptions(PERFIS.map(function (p) {
        return { label: p.label, onClick: function () { escolherPerfil(p); } };
      }));
    });
  }

  function escolherPerfil(perfil) {
    userMessage(perfil.label);
    state.discente = perfil.value;
    perguntaTipoRegistro();
  }

  /* ---------- Passo 2: conversou pessoalmente? (feedback x observação) ---------- */
  function perguntaTipoRegistro() {
    setStep("tipo");
    botMessage("Você conversou pessoalmente com o(a) estudante?", function () {
      showOptions([
        { label: "Sim", onClick: function () { escolherTipoRegistro("feedback"); } },
        { label: "Não", onClick: function () { escolherTipoRegistro("observacao"); } }
      ]);
    });
  }

  function escolherTipoRegistro(tipo) {
    var info = TIPOS_REGISTRO[tipo];
    userMessage(info.label);
    state.tipoRegistro = tipo;
    botMessage(info.titulo + "\n\n" + info.explicacao, function () {
      perguntaItens();
    });
  }

  /* ---------- Passo 3: itens do registro (multisseleção, na tela lateral) ---------- */
  function perguntaItens() {
    setStep("itens");
    state.itensSelecionados = [];
    footerActionsEl.hidden = true;
    botMessage("Perfeito. Selecione um ou mais assuntos no painel ao lado. Marque quantos precisar e, quando terminar, toque em \"Gerar Registro\".", function () {
      renderItensChips();
    });
  }

  function trocarItens() {
    setStep("itens");
    footerActionsEl.hidden = true;
    botMessage("Claro! Ajuste os itens selecionados no painel ao lado.", function () {
      renderItensChips();
    });
  }

  function renderItensChips() {
    panelBodyEl.innerHTML = "";

    var hint = document.createElement("p");
    hint.className = "panel-hint";
    hint.textContent = "Marque quantos assuntos precisar.";
    panelBodyEl.appendChild(hint);

    ITENS.forEach(function (item) {
      var selecionado = state.itensSelecionados.indexOf(item.id) !== -1;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn chip" + (selecionado ? " selected" : "");
      btn.innerHTML = (selecionado ? "☑ " : "☐ ") + item.label;
      btn.addEventListener("click", function () {
        toggleItem(item.id);
      });
      panelBodyEl.appendChild(btn);
    });

    panelFooterEl.innerHTML = "";

    var limparBtn = document.createElement("button");
    limparBtn.type = "button";
    limparBtn.className = "option-btn ghost";
    limparBtn.textContent = "Limpar seleção";
    limparBtn.addEventListener("click", function () {
      state.itensSelecionados = [];
      renderItensChips();
    });

    var gerarBtn = document.createElement("button");
    gerarBtn.type = "button";
    gerarBtn.className = "option-btn action";
    gerarBtn.textContent = "Gerar Registro (" + state.itensSelecionados.length + ")";
    gerarBtn.disabled = state.itensSelecionados.length === 0;
    gerarBtn.addEventListener("click", confirmarItens);

    panelFooterEl.appendChild(limparBtn);
    panelFooterEl.appendChild(gerarBtn);

    showPanel("Selecionar itens do registro", "itens");
  }

  function toggleItem(id) {
    var idx = state.itensSelecionados.indexOf(id);
    if (idx === -1) state.itensSelecionados.push(id);
    else state.itensSelecionados.splice(idx, 1);
    renderItensChips();
  }

  function confirmarItens() {
    if (state.itensSelecionados.length === 0) return;
    var labels = ITENS.filter(function (i) { return state.itensSelecionados.indexOf(i.id) !== -1; })
      .map(function (i) { return i.label; });
    hidePanel();
    userMessage(labels.join(" · "));
    mostrarResultado();
  }

  /* ---------- Geração do texto final (igual à lógica original) ---------- */
  function gerarTexto() {
    var info = TIPOS_REGISTRO[state.tipoRegistro];
    var texto = info.prefixo(state.discente);
    ITENS.forEach(function (item) {
      if (state.itensSelecionados.indexOf(item.id) !== -1) {
        texto += item.value + "\n";
      }
    });
    return texto.trim();
  }

  /* ---------- Passo 4: resultado ---------- */
  function mostrarResultado() {
    setStep("final");
    originalFeedback = gerarTexto();
    state.avisoVisto = false;

    botMessage("Prontinho! Aqui está o texto sugerido. Antes de copiar, releia e personalize o que fizer sentido — o registro deve esclarecer, valorizar, sugerir e, se possível, questionar, não apenas repetir um texto padrão.", function () {
      renderResultado();
    });
  }

  function renderResultado() {
    optionsEl.innerHTML = "";

    var wrap = document.createElement("div");
    wrap.className = "msg result";
    var label = document.createElement("span");
    label.className = "result-label";
    label.textContent = "Texto revisado (editável)";
    var ta = document.createElement("textarea");
    ta.id = "resultTextarea";
    ta.value = originalFeedback;
    ta.rows = 10;
    wrap.appendChild(label);
    wrap.appendChild(ta);
    chatEl.appendChild(wrap);
    scrollToBottom();

    buildFooterActions();
  }

  /* ---------- Barra fixa do rodapé (não é apagada por novas mensagens do bot) ---------- */
  function buildFooterActions() {
    footerActionsEl.innerHTML = "";
    footerActionsEl.hidden = false;

    var row1 = document.createElement("div");
    row1.className = "row";
    var copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "option-btn action wide";
    copyBtn.addEventListener("click", copiarTexto);
    row1.appendChild(copyBtn);
    copyBtnEl = copyBtn;
    atualizarBotaoCopiar();

    var row2 = document.createElement("div");
    row2.className = "row";
    var trocarBtn = document.createElement("button");
    trocarBtn.type = "button";
    trocarBtn.className = "option-btn ghost";
    trocarBtn.textContent = "Trocar itens";
    trocarBtn.addEventListener("click", trocarItens);

    var novoBtn = document.createElement("button");
    novoBtn.type = "button";
    novoBtn.className = "option-btn ghost";
    novoBtn.textContent = "Novo registro";
    novoBtn.addEventListener("click", reiniciar);

    row2.appendChild(trocarBtn);
    row2.appendChild(novoBtn);

    footerActionsEl.appendChild(row1);
    footerActionsEl.appendChild(row2);
  }

  function atualizarBotaoCopiar() {
    if (!copyBtnEl) return;
    copyBtnEl.textContent = state.avisoVisto
      ? "Copiar TEXTO REVISADO para o Sistema Educacional"
      : "Copiar TEXTO para o Sistema Educacional";
  }

  function marcarAvisoVisto() {
    state.avisoVisto = true;
    atualizarBotaoCopiar();
  }

  /* ---------- Painel lateral (segunda "tela", ao lado do chat principal) ---------- */
  function showPanel(title, mode) {
    panelMode = mode || null;
    panelTitleEl.textContent = title;
    sidePanelEl.classList.add("open");
    sidePanelEl.setAttribute("aria-hidden", "false");
  }

  function hidePanel() {
    sidePanelEl.classList.remove("open");
    sidePanelEl.setAttribute("aria-hidden", "true");
  }

  panelCloseBtn.addEventListener("click", function () {
    var modoFechado = panelMode;
    hidePanel();
    if (modoFechado === "itens" && state.step === "itens") {
      showOptions([{
        label: "Abrir seleção de itens (" + state.itensSelecionados.length + ")",
        wide: true,
        onClick: renderItensChips
      }]);
    } else if (modoFechado === "aviso-copia") {
      marcarAvisoVisto();
    }
  });

  /* ---------- Painel de informações (LGPD / natureza da ferramenta) ---------- */
  function mostrarInfo() {
    panelBodyEl.innerHTML = "";
    var p = document.createElement("p");
    p.className = "panel-tip";
    p.innerHTML = "Este assistente é uma ferramenta de apoio baseada em regras fixas e modelos de texto pré-definidos — <b>não utiliza inteligência artificial</b>, aprendizado de máquina ou qualquer processamento externo dos dados inseridos.<br>" +
    "Nenhum dado sensível ou informações que permitam a identificação de estudantes ficará fora do contexto do registro acadêmico institucional.<br>" +
    "Todo o conteúdo digitado é tratado exclusivamente no navegador do(a) usuário(a), não sendo armazenado, transmitido ou compartilhado com terceiros, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).<br>" +
    "<ul>" +
    "<strong>RECURSOS:</strong>" +
    "<li>Chatbot em HTML5, CSS e JavaScript puros.</li>" +
    "<li>Arquitetura original de concepção do autor <a href=\"https://github.com/labSenacSor/qualified-record-generator\" target=\"_blank\">(https://github.com/labSenacSor/qualified-record-generator\)</a></li>" +
    "<li>Mecânica Chat inspirada no projeto <a href=\"https://github.com/eduardotkoller/convform\" target=\"_blank\">https://github.com/eduardotkoller/convform\</a></li>" +
    "<li>Interface otimizada via claude.ai</li></ul>&copy; 2026, <em>Adilson G Andrade</em> (Senac SOR)";
    panelBodyEl.appendChild(p);

    panelFooterEl.innerHTML = "";
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "option-btn ghost wide";
    closeBtn.textContent = "Fechar";
    closeBtn.addEventListener("click", function () { panelCloseBtn.click(); });
    panelFooterEl.appendChild(closeBtn);

    showPanel("Sobre este assistente", "info");
  }

  infoBtn.addEventListener("click", mostrarInfo);

  /* ---------- Renderização do chat ---------- */
  function botMessage(text, then) {
    optionsEl.innerHTML = "";
    var typingEl = document.createElement("div");
    typingEl.className = "typing";
    typingEl.innerHTML = "<span></span><span></span><span></span>";
    chatEl.appendChild(typingEl);
    scrollToBottom();

    var delay = Math.min(1000, 350 + text.length * 3);
    setTimeout(function () {
      chatEl.removeChild(typingEl);
      var el = document.createElement("div");
      el.className = "msg bot";
      el.textContent = text;
      chatEl.appendChild(el);
      scrollToBottom();
      if (typeof then === "function") then();
    }, delay);
  }

  function userMessage(text) {
    optionsEl.innerHTML = "";
    var el = document.createElement("div");
    el.className = "msg user";
    el.textContent = text;
    chatEl.appendChild(el);
    scrollToBottom();
  }

  function showOptions(list) {
    optionsEl.innerHTML = "";
    list.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn" +
        (opt.wide ? " wide" : "") +
        (opt.action ? " action" : "") +
        (opt.ghost ? " ghost" : "");
      btn.textContent = opt.label;
      btn.addEventListener("click", opt.onClick);
      optionsEl.appendChild(btn);
    });
  }

  function scrollToBottom() {
    chatEl.scrollTop = chatEl.scrollHeight;
    requestAnimationFrame(function () {
      chatEl.scrollTop = chatEl.scrollHeight;
      setTimeout(function () {
        chatEl.scrollTop = chatEl.scrollHeight;
      }, 60);
    });
  }

  /* ---------- Progresso ---------- */
  var STEP_ORDER = ["perfil", "tipo", "itens", "final"];
  function setStep(step) {
    state.step = step;
    var idx = STEP_ORDER.indexOf(step);
    Array.prototype.forEach.call(progressEl.children, function (el, i) {
      el.classList.remove("active", "done");
      if (i < idx) el.classList.add("done");
      else if (i === idx) el.classList.add("active");
    });
  }

  /* ---------- Copiar: 1º clique sempre mostra o aviso; depois de visto, copia de fato ---------- */
  function copiarTexto() {
    if (!state.avisoVisto) {
      mostrarAvisoAntesDeCopiar();
      return;
    }

    var ta = document.getElementById("resultTextarea");
    var texto = ta.value;

    doCopy(texto, function (ok) {
      var info = TIPOS_REGISTRO[state.tipoRegistro];
      if (ok) {
        botMessage("Copiado! ✓ " + info.ctrlV);
      } else {
        botMessage("Não foi possível copiar automaticamente neste navegador. Selecione o texto acima e copie manualmente (Ctrl/Cmd + C).");
      }
    });
  }

  function mostrarAvisoAntesDeCopiar() {
    panelBodyEl.innerHTML = "";
    var tip = document.createElement("div");
    tip.className = "panel-tip";
    tip.innerHTML =
      "Antes de copiar, atualize o texto sugerido com o objetivo de:" +
      "<ul>" +
      "<li><strong>ESCLARECER:</strong> diga exatamente os aspectos mais relevantes do processo de avaliação.</li>" +
      "<li><strong>VALORIZAR:</strong> enfoque os aspectos mais relevantes do desenvolvimento do(a) estudante.</li>" +
      "<li><strong>SUGERIR:</strong> aponte o que pode ser aprimorado e as ações que contribuirão para o desenvolvimento.</li>" +
      "<li><strong>QUESTIONAR:</strong> faça perguntas que ajudem a identificar dificuldades percebidas no processo.</li>" +
      "</ul>" +
      "<p>Edite o texto acima, na tela principal, e toque em copiar novamente.</p>";
    panelBodyEl.appendChild(tip);

    panelFooterEl.innerHTML = "";
    var okBtn = document.createElement("button");
    okBtn.type = "button";
    okBtn.className = "option-btn action wide";
    okBtn.textContent = "Entendi, voltar para editar";
    okBtn.addEventListener("click", function () {
      hidePanel();
      marcarAvisoVisto();
      var taEl = document.getElementById("resultTextarea");
      if (taEl) {
        taEl.focus();
        taEl.select();
      }
    });
    panelFooterEl.appendChild(okBtn);

    showPanel("Antes de copiar…", "aviso-copia");
  }

  function doCopy(texto, callback) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(function () {
        callback(true);
      }, function () {
        fallbackCopy(texto, callback);
      });
    } else {
      fallbackCopy(texto, callback);
    }
  }

  function fallbackCopy(texto, callback) {
    var temp = document.createElement("textarea");
    temp.value = texto;
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(temp);
    callback(ok);
  }

  /* ---------- Reinício (equivalente a "Limpar Seleção" do original, que limpava tudo) ---------- */
  function reiniciar() {
    state = { discente: null, tipoRegistro: null, itensSelecionados: [], avisoVisto: false, step: "perfil" };
    originalFeedback = "";
    copyBtnEl = null;
    chatEl.innerHTML = "";
    optionsEl.innerHTML = "";
    footerActionsEl.hidden = true;
    footerActionsEl.innerHTML = "";
    hidePanel();
    panelBodyEl.innerHTML = "";
    panelFooterEl.innerHTML = "";
    perguntaPerfil();
  }

  restartBtn.addEventListener("click", reiniciar);

  /* ---------- Início ---------- */
  perguntaPerfil();
})();
