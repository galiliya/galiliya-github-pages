(function () {
  const storageKey = "galiliya-lab-records";
  const defaultRecords = { rag: 0, prompt: 0, workflow: 0, traceStage: 1, traceTime: 0 };

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
    text("trace-record", `最佳阶段 ${records.traceStage} / ${records.traceTime.toFixed(1)}s`);
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

  initTraceDodger();

  function initTraceDodger() {
    const canvas = document.getElementById("trace-canvas");
    const startButton = document.getElementById("trace-start");
    const resetButton = document.getElementById("trace-reset");
    const feedback = document.getElementById("trace-feedback");
    const stageLabel = document.getElementById("trace-stage");
    const timeLabel = document.getElementById("trace-time");

    if (!canvas || !startButton || !resetButton) return;

    const ctx = canvas.getContext("2d");
    const state = {
      running: false,
      animationId: 0,
      lastFrame: 0,
      elapsed: 0,
      stage: 1,
      player: { x: canvas.width * 0.2, y: canvas.height * 0.5, radius: 10 },
      pointer: { x: canvas.width * 0.2, y: canvas.height * 0.5 },
      blocks: [],
      lines: [],
      spawnTimer: 0,
      lineTimer: 0
    };

    function resetTrace(keepMessage) {
      cancelAnimationFrame(state.animationId);
      state.running = false;
      state.lastFrame = 0;
      state.elapsed = 0;
      state.stage = 1;
      state.player.x = canvas.width * 0.2;
      state.player.y = canvas.height * 0.5;
      state.pointer.x = state.player.x;
      state.pointer.y = state.player.y;
      state.blocks = [];
      state.lines = [];
      state.spawnTimer = 0;
      state.lineTimer = 0;
      stageLabel.textContent = "阶段 1";
      timeLabel.textContent = "存活 0.0s";
      if (!keepMessage) {
        feedback.textContent = "准备好后点击开始，把节点留在安全区域内。";
        feedback.className = "lab-feedback";
      }
      drawTrace();
    }

    function startTrace() {
      resetTrace(true);
      state.running = true;
      feedback.textContent = "运行中：跟随鼠标移动，避开异常噪声和扫描线。";
      feedback.className = "lab-feedback";
      state.animationId = requestAnimationFrame(loop);
    }

    function loop(timestamp) {
      if (!state.running) return;
      if (!state.lastFrame) state.lastFrame = timestamp;
      const delta = Math.min((timestamp - state.lastFrame) / 1000, 0.032);
      state.lastFrame = timestamp;
      state.elapsed += delta;
      state.stage = Math.max(1, Math.floor(state.elapsed / 8) + 1);
      stageLabel.textContent = `阶段 ${state.stage}`;
      timeLabel.textContent = `存活 ${state.elapsed.toFixed(1)}s`;

      movePlayer(delta);
      updateHazards(delta);
      if (checkCollision()) {
        endTrace();
        return;
      }
      drawTrace();
      state.animationId = requestAnimationFrame(loop);
    }

    function movePlayer(delta) {
      state.player.x = clamp(state.pointer.x, 16, canvas.width - 16);
      state.player.y = clamp(state.pointer.y, 16, canvas.height - 16);
    }

    function updateHazards(delta) {
      state.spawnTimer += delta;
      state.lineTimer += delta;

      const blockInterval = Math.max(0.45, 1.15 - state.stage * 0.08);
      const lineInterval = Math.max(1.05, 2.2 - state.stage * 0.1);

      if (state.spawnTimer >= blockInterval) {
        state.spawnTimer = 0;
        spawnBlock();
      }

      if (state.lineTimer >= lineInterval) {
        state.lineTimer = 0;
        spawnLine();
      }

      state.blocks.forEach((block) => {
        block.x -= block.speed * delta;
      });
      state.lines.forEach((line) => {
        line.progress += line.speed * delta;
      });

      state.blocks = state.blocks.filter((block) => block.x + block.w > -20);
      state.lines = state.lines.filter((line) => line.progress < 1.2);
    }

    function spawnBlock() {
      const h = random(26, 66);
      const w = random(24, 72);
      state.blocks.push({
        x: canvas.width + w,
        y: random(8, canvas.height - h - 8),
        w,
        h,
        speed: 140 + state.stage * 26 + random(0, 24)
      });
    }

    function spawnLine() {
      state.lines.push({
        y: random(20, canvas.height - 20),
        thickness: random(4, 7),
        speed: 1.4 + state.stage * 0.14,
        progress: 0
      });
    }

    function checkCollision() {
      for (const block of state.blocks) {
        if (
          state.player.x + state.player.radius > block.x &&
          state.player.x - state.player.radius < block.x + block.w &&
          state.player.y + state.player.radius > block.y &&
          state.player.y - state.player.radius < block.y + block.h
        ) {
          return true;
        }
      }

      for (const line of state.lines) {
        const headX = canvas.width * line.progress;
        if (headX > 0 && headX < canvas.width) {
          const withinX = Math.abs(state.player.x - headX) < 10;
          const withinY = Math.abs(state.player.y - line.y) < 14;
          if (withinX && withinY) return true;
        }
      }

      return false;
    }

    function endTrace() {
      state.running = false;
      cancelAnimationFrame(state.animationId);
      records.traceStage = Math.max(records.traceStage, state.stage);
      records.traceTime = Math.max(records.traceTime, state.elapsed);
      saveRecords();
      updateRecordLabels();
      feedback.textContent = `已中断。你到达了阶段 ${state.stage}，存活 ${state.elapsed.toFixed(1)} 秒。`;
      feedback.className = "lab-feedback is-error";
      drawTrace(true);
    }

    function drawTrace(failed) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(255,255,255,0.96)");
      gradient.addColorStop(1, "rgba(223,240,236,0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      state.lines.forEach((line) => {
        const headX = canvas.width * line.progress;
        const tailX = headX - 120;
        const lg = ctx.createLinearGradient(tailX, 0, headX, 0);
        lg.addColorStop(0, "rgba(215, 72, 72, 0)");
        lg.addColorStop(1, "rgba(215, 72, 72, 0.78)");
        ctx.strokeStyle = lg;
        ctx.lineWidth = line.thickness;
        ctx.beginPath();
        ctx.moveTo(tailX, line.y);
        ctx.lineTo(headX, line.y);
        ctx.stroke();
      });

      state.blocks.forEach((block) => {
        ctx.fillStyle = "rgba(160, 75, 45, 0.16)";
        ctx.strokeStyle = "rgba(160, 75, 45, 0.24)";
        ctx.lineWidth = 1.5;
        roundRect(ctx, block.x, block.y, block.w, block.h, 10, true, true);
      });

      ctx.beginPath();
      ctx.fillStyle = failed ? "#a04b2d" : "#0b766e";
      ctx.shadowColor = failed ? "rgba(160,75,45,0.28)" : "rgba(11,118,110,0.26)";
      ctx.shadowBlur = 18;
      ctx.arc(state.player.x, state.player.y, state.player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.strokeStyle = "rgba(11,118,110,0.24)";
      ctx.lineWidth = 2;
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawGrid() {
      ctx.strokeStyle = "rgba(15, 23, 32, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    function roundRect(ctxRef, x, y, width, height, radius, fill, stroke) {
      ctxRef.beginPath();
      ctxRef.moveTo(x + radius, y);
      ctxRef.lineTo(x + width - radius, y);
      ctxRef.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctxRef.lineTo(x + width, y + height - radius);
      ctxRef.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctxRef.lineTo(x + radius, y + height);
      ctxRef.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctxRef.lineTo(x, y + radius);
      ctxRef.quadraticCurveTo(x, y, x + radius, y);
      ctxRef.closePath();
      if (fill) ctxRef.fill();
      if (stroke) ctxRef.stroke();
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    canvas.addEventListener("mousemove", function (event) {
      const rect = canvas.getBoundingClientRect();
      state.pointer.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      state.pointer.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    });

    canvas.addEventListener("mouseenter", function (event) {
      const rect = canvas.getBoundingClientRect();
      state.pointer.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      state.pointer.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    });

    startButton.addEventListener("click", startTrace);
    resetButton.addEventListener("click", function () {
      resetTrace(false);
    });

    resetTrace(false);
    updateRecordLabels();
  }
})();
