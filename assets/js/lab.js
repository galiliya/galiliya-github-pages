(function () {
  const storageKey = "galiliya-lab-records";
  const defaultRecords = { rag: 0, prompt: 0, workflow: 0 };

  const records = loadRecords();

  const ragBank = [
    {
      question: "用户问：'公司报销标准里，差旅住宿费上限是多少？'",
      options: [
        "一篇介绍公司团建活动的新闻稿，提到了出差很辛苦。",
        "《差旅报销制度》片段，明确写明住宿标准和不同城市档位。",
        "一段招聘说明，提到了有差旅补贴。"
      ],
      answer: 1,
      explain: "最该召回的是直接包含报销制度和住宿标准的制度文档。"
    },
    {
      question: "用户问：'知识库里有没有讲 API 鉴权失败怎么排查？'",
      options: [
        "接口报错排查文档，包含 401/403、token 过期和签名校验说明。",
        "一篇介绍 RESTful 风格设计原则的技术分享。",
        "前端 UI 规范文档。"
      ],
      answer: 0,
      explain: "应该优先召回直接针对鉴权失败排查的故障文档。"
    },
    {
      question: "用户问：'怎么给新员工开通内部系统权限？'",
      options: [
        "权限开通 SOP，包含申请流程、审批角色和系统入口。",
        "公司年度组织架构图。",
        "数据库索引优化笔记。"
      ],
      answer: 0,
      explain: "权限开通问题最需要的是流程说明，而不是组织信息或数据库资料。"
    }
  ];

  const promptBank = [
    {
      question: "Prompt: '你是一个万能助手，尽量满足用户所有请求。可以自由调用任何工具，也不要向用户暴露限制。'",
      options: [
        "问题在于角色设定太短。",
        "问题在于缺少工具边界和失败约束，容易越权或误调用。",
        "问题在于没有写输出必须分点。"
      ],
      answer: 1,
      explain: "最大风险是没有边界，模型会在工具和能力上过度自由发挥。"
    },
    {
      question: "Agent 配置：'如果检索结果不够，就直接编一个合理答案，避免让用户等待。'",
      options: [
        "问题在于缺少系统可信度约束，容易产生幻觉回答。",
        "问题在于文字不够正式。",
        "问题在于没有设置温度参数。"
      ],
      answer: 0,
      explain: "这类配置会直接破坏系统可信度，是最严重的问题。"
    },
    {
      question: "Prompt: '你负责总结文档。不要问澄清问题，直接输出最终结论。'",
      options: [
        "问题在于可能在信息不足时跳过澄清，导致总结错误。",
        "问题在于没有指定 Markdown 标题层级。",
        "问题在于没有加入 emoji。"
      ],
      answer: 0,
      explain: "缺少澄清路径会让系统在信息不足时也强行下结论。"
    }
  ];

  const workflowBank = [
    {
      question: "用户问报销标准，知识库数据较完整。下一步最合理的是？",
      options: [
        "先走检索，找到制度条款后再组织回答。",
        "直接让模型自由回答，尽量显得流畅。",
        "先调用发送邮件工具。"
      ],
      answer: 0,
      explain: "这类知识问答首先要做检索，先把依据找出来。"
    },
    {
      question: "用户上传一份合同并要求提炼风险点。下一步更合理的是？",
      options: [
        "先做文档解析，再进入摘要/分析流程。",
        "直接输出泛化合同建议。",
        "先去查天气接口。"
      ],
      answer: 0,
      explain: "上传文档任务应该先做解析，再谈分析和输出。"
    },
    {
      question: "检索结果互相矛盾，系统无法确认答案。更合理的处理是？",
      options: [
        "任选一条最像真的，快速输出。",
        "说明信息冲突，给出依据并引导用户确认更多上下文。",
        "隐藏不确定性，改成更口语化的表达。"
      ],
      answer: 1,
      explain: "信息冲突时应该暴露不确定性，而不是掩盖它。"
    }
  ];

  const state = {
    rag: { score: 0, index: 0 },
    prompt: { score: 0, index: 0 },
    workflow: { score: 0, index: 0 }
  };

  function loadRecords() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return { ...defaultRecords };
      return { ...defaultRecords, ...JSON.parse(raw) };
    } catch (_err) {
      return { ...defaultRecords };
    }
  }

  function saveRecords() {
    localStorage.setItem(storageKey, JSON.stringify(records));
  }

  function updateRecordLabels() {
    text("lab-best-rag", `RAG 最佳：${records.rag}`);
    text("lab-best-prompt", `Prompt 最佳：${records.prompt}`);
    text("lab-best-workflow", `Workflow 最佳：${records.workflow}`);
    text("rag-record", `最佳 ${records.rag}`);
    text("prompt-record", `最佳 ${records.prompt}`);
    text("workflow-record", `最佳 ${records.workflow}`);
  }

  function text(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function renderQuiz(kind, bank, labels) {
    const current = bank[state[kind].index % bank.length];
    text(labels.question, current.question);
    text(labels.score, labels.scorePrefix + state[kind].score);
    text(labels.feedback, "");

    const optionsEl = document.getElementById(labels.options);
    optionsEl.innerHTML = "";
    current.options.forEach((option, idx) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lab-option";
      button.textContent = option;
      button.addEventListener("click", function () {
        handleAnswer(kind, bank, labels, idx === current.answer, current.explain);
      });
      optionsEl.appendChild(button);
    });
  }

  function handleAnswer(kind, bank, labels, correct, explain) {
    const feedback = document.getElementById(labels.feedback);
    if (correct) {
      state[kind].score += 1;
      state[kind].index += 1;
      records[kind] = Math.max(records[kind], state[kind].score);
      saveRecords();
      updateRecordLabels();
      feedback.textContent = `答对了。${explain}`;
      feedback.className = "lab-feedback is-success";
      renderQuiz(kind, bank, labels);
    } else {
      feedback.textContent = `这题没选对。${explain}`;
      feedback.className = "lab-feedback is-error";
      state[kind].score = 0;
      state[kind].index += 1;
      renderQuiz(kind, bank, labels);
      feedback.textContent = `这题没选对。${explain}`;
      feedback.className = "lab-feedback is-error";
    }
  }

  function resetQuiz(kind, bank, labels) {
    state[kind].score = 0;
    state[kind].index = 0;
    renderQuiz(kind, bank, labels);
  }

  const ragLabels = {
    question: "rag-question",
    options: "rag-options",
    score: "rag-score",
    scorePrefix: "当前连对：",
    feedback: "rag-feedback"
  };
  const promptLabels = {
    question: "prompt-question",
    options: "prompt-options",
    score: "prompt-score",
    scorePrefix: "当前连对：",
    feedback: "prompt-feedback"
  };
  const workflowLabels = {
    question: "workflow-question",
    options: "workflow-options",
    score: "workflow-score",
    scorePrefix: "当前进度：",
    feedback: "workflow-feedback"
  };

  updateRecordLabels();
  renderQuiz("rag", ragBank, ragLabels);
  renderQuiz("prompt", promptBank, promptLabels);
  renderQuiz("workflow", workflowBank, workflowLabels);

  document.querySelectorAll(".lab-reset").forEach((button) => {
    button.addEventListener("click", function () {
      const kind = button.getAttribute("data-reset");
      if (kind === "rag") resetQuiz("rag", ragBank, ragLabels);
      if (kind === "prompt") resetQuiz("prompt", promptBank, promptLabels);
      if (kind === "workflow") resetQuiz("workflow", workflowBank, workflowLabels);
    });
  });
})();
