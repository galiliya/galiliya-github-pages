---
title: Lab
layout: default
description: "围绕 RAG、智能体与工程判断的轻量交互实验室。"
permalink: /lab/
scripts:
  - /assets/js/lab.js
---

<section class="page-header">
  <div class="shell-inner">
    <p class="eyebrow">Lab</p>
    <h1>轻量交互实验室</h1>
    <p class="page-copy">这里不是小游戏合集，而是几个和当前方向相关的小实验：偏一点判断、偏一点流程，也保留一点轻松感。</p>
  </div>
</section>

<section class="section">
  <div class="shell-inner lab-hero">
    <div class="content-card">
      <p class="eyebrow">玩法说明</p>
      <h2>更像工程师主页里的技术彩蛋</h2>
      <p>所有互动都在浏览器本地运行，不接后端。当前会记录最佳成绩和完成状态，适合轻量体验，也方便以后继续扩展。</p>
    </div>
    <div class="content-card lab-scoreboard">
      <p class="eyebrow">本地记录</p>
      <div class="score-badges">
        <span id="lab-best-rag">RAG 最佳：0</span>
        <span id="lab-best-prompt">Prompt 最佳：0</span>
        <span id="lab-best-workflow">Workflow 最佳：0</span>
      </div>
      <p class="panel-note">记录保存在当前浏览器本地，不会上传。</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell-inner lab-grid">
    <article class="content-card lab-card" id="rag-hit-test">
      <div class="lab-card-head">
        <div>
          <p class="eyebrow">01 / RAG 命中测试</p>
          <h2>选出最该被召回的结果</h2>
        </div>
        <span class="lab-record" id="rag-record">最佳 0</span>
      </div>
      <p class="lab-intro">给你一个问题和 3 条候选检索结果，选最合理的一条。答对会自动切换下一题。</p>
      <div class="lab-status">
        <span id="rag-score">当前连对：0</span>
        <button class="button button-secondary lab-reset" type="button" data-reset="rag">重置</button>
      </div>
      <div class="lab-question" id="rag-question"></div>
      <div class="lab-options" id="rag-options"></div>
      <p class="lab-feedback" id="rag-feedback"></p>
    </article>

    <article class="content-card lab-card" id="prompt-debug">
      <div class="lab-card-head">
        <div>
          <p class="eyebrow">02 / Prompt Debug</p>
          <h2>找出最容易出问题的点</h2>
        </div>
        <span class="lab-record" id="prompt-record">最佳 0</span>
      </div>
      <p class="lab-intro">给一段提示词或 agent 配置，判断它最可能在哪个地方失控。更偏排错和边界感。</p>
      <div class="lab-status">
        <span id="prompt-score">当前连对：0</span>
        <button class="button button-secondary lab-reset" type="button" data-reset="prompt">重置</button>
      </div>
      <div class="lab-question" id="prompt-question"></div>
      <div class="lab-options" id="prompt-options"></div>
      <p class="lab-feedback" id="prompt-feedback"></p>
    </article>

    <article class="content-card lab-card" id="workflow-runner">
      <div class="lab-card-head">
        <div>
          <p class="eyebrow">03 / Workflow Runner</p>
          <h2>让请求走对流程</h2>
        </div>
        <span class="lab-record" id="workflow-record">最佳 0</span>
      </div>
      <p class="lab-intro">从请求、检索、工具调用到输出之间走出合理路径。更像轻量版的流程判断题。</p>
      <div class="lab-status">
        <span id="workflow-score">当前进度：0</span>
        <button class="button button-secondary lab-reset" type="button" data-reset="workflow">重置</button>
      </div>
      <div class="lab-question" id="workflow-question"></div>
      <div class="lab-options" id="workflow-options"></div>
      <p class="lab-feedback" id="workflow-feedback"></p>
    </article>
  </div>
</section>

<section class="section">
  <div class="shell-inner">
    <article class="content-card trace-card" id="trace-dodger">
      <div class="trace-copy">
        <p class="eyebrow">04 / Trace Dodger</p>
        <h2>在噪声和异常线之间活下来</h2>
        <p class="lab-intro">鼠标移动控制节点，避开噪声块和扫描线。每存活一段时间就进入下一阶段，速度和压力都会上升。</p>
        <div class="trace-stats">
          <span id="trace-stage">阶段 1</span>
          <span id="trace-time">存活 0.0s</span>
          <span id="trace-record">最佳阶段 1 / 0.0s</span>
        </div>
        <div class="trace-actions">
          <button class="button button-primary" type="button" id="trace-start">开始运行</button>
          <button class="button button-secondary" type="button" id="trace-reset">重置</button>
        </div>
        <p class="lab-feedback" id="trace-feedback">准备好后点击开始，把节点留在安全区域内。</p>
      </div>

      <div class="trace-stage-wrap">
        <div class="trace-stage-panel">
          <canvas id="trace-canvas" width="720" height="360" aria-label="Trace Dodger 游戏画布"></canvas>
        </div>
      </div>
    </article>
  </div>
</section>
