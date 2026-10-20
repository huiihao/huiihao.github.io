---
title: Agent Street
date: 2026-05-22 12:00:00 +0800
categories: [Agent Street]
tags: [python, llm, quant]
description: 3D 生成式智能体小镇：16 位 MBTI 交易员在真实 K 线回放中交易，策略基因组靠盈亏强化、模仿与突变自我演化，四位观察者从不同学科视角解读涌现行为。
toc: true
---

<p align="center">
  <span style="font-size: 4rem;">🏘️</span>
</p>

[![Python](https://img.shields.io/badge/python-3.10+-blue?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/huiihao/agent-street)
[![GitHub Stars](https://img.shields.io/github/stars/huiihao/agent-street?style=social)](https://github.com/huiihao/agent-street)
[![Agents](https://img.shields.io/badge/agents-20-ff69b4?style=flat-square)](https://github.com/huiihao/agent-street)
[![Three.js](https://img.shields.io/badge/renderer-Three.js%20r160-5ad1ff?style=flat-square)](https://threejs.org/)
[![Tests](https://img.shields.io/badge/tests-21-success?style=flat-square)](https://github.com/huiihao/agent-street)

<p align="center">
  <b>Agent Street</b> 是一个 3D 生成式智能体小镇。16 位 MBTI 交易员在同一份真实行情回放里交易、交谈、互相模仿；四位观察者——物理学家、数学家、社会工程师、神秘主义者——各自给出对这个系统的解读。
</p>

## 🎬 核心命题

<div class="box-info" markdown="1">

**策略不该是配置文件里的一个常数。**

它应该是智能体**赚来的、借来的、变异出来的，有时还会输掉**的东西。Agent Street 把一段真实行情回放变成一个小社会，让这件事在光天化日下发生——在可以旋转的地图上，在可以点开的图里，在一本必须收支平衡的账本上。

</div>

---

## 🏙️ 小镇

一个 20×14 的立体模型，路网真的连通（寻路用的 `TOWN_MAP` 和渲染用的是同一份数据），共 15 个地点。

| 地点 | 作用 |
|------|------|
| 🔵🔴🟢🟤 四栋屋顶 | 16 位交易员的住处，按 MBTI 分组 |
| ☕ Morning Brew | 社交中心，情绪传染、羊群行为 |
| 📚 Data Library | 安静分析 |
| 📊 Trading Floor | 快速反应 |
| 🌿 Willow Park | 独立思考 |
| 🌳 Town Square | 群体勇气 |
| 🔭 天文台 · 📐 数学塔 · 🔮 占卜帐篷 | 三位观察者的驻地 |
| 📰 **Rumor Mill** | 羊群 +25%，反应更快——叙事在这里变响 |
| 🧪 **Quant Lab** | 分析权重提升，持仓周期拉长；**在实验室平仓可获得 1.7× 学习率加成** |
| 🏛️ **Guild Hall** | 辩论、结盟与模仿，社会工程师的大本营 |

昼夜循环独立于行情时钟：每个回放日都从黎明走到黄昏再到夜晚，有自发光窗户、路灯、星空、萤火虫，偶尔下雨。渲染用 Three.js r160，本地内置，**没有构建步骤**。

---

## 🧬 策略演化

每个交易员都有一份可查看的基因组：

```
信号权重：  trend · reversion · RSI · herding · influence · memory   （和为 1）
性格参数：  risk · patience · contrarian · noise
谱系信息：  generation · wins · losses · adaptations · last adaptation
```

**1. 先验** —— `genome_from_persona()` 把 MBTI 参数翻译成初始基因组。逆向的内向者一开始 reversion 权重就高；外向的情感型则更依赖 herding 和 memory。但基因组只是**先验，不是宿命**。

**2. 经验** —— 每一笔买入都携带产生它的信号上下文。平仓时，已实现收益变成奖励：

```
reward    = clip(trade_return / 2%, -1, 1)
Δw_signal = η · reward · entry_signal
```

赚钱时支持性信号被强化，亏钱时被削弱，risk 和 patience 也会自适应。

**3. 模仿** —— 一次对话之后，适应度较低的交易员可能借走强者的一部分策略：

```
learner_gene ← 0.76 · learner_gene + 0.24 · teacher_gene + mutation
```

信任关系图决定模仿概率，实验室加成很大，公会大厅加成较小。**策略公会就是这样形成的。**

**4. 突变** —— 每 20 tick，一小部分基因组会随机探索。改变主导信号的突变，会以「公会漂移」的形式出现在观察者的报告里。

**5. 公会** —— 基因组被归类为 **动量 / 均值回归 / 情绪 / 逆向 / 均衡**。结果不是一份固定性格的排行榜，而是一个会分裂、聚集、模仿、漂移的种群。

---

## 🔭 四位观察者

| 观察者 | 视角 | 读什么 | 置信度 |
|--------|------|--------|--------|
| 🔭 **物理学家** | 统计力学 | 序参量、离散度、磁化率、关联长度、策略多样性 | 70–85% |
| 📐 **数学家** | 图论 | 信任连通分量、中心性、情绪划分、公会构成 | 75–95% |
| 🧩 **社会工程师** | 社会系统 | 信任密度、中介集中度、聚集系数、极化、模仿流、级联风险 | 66–90% |
| 🔮 **神秘主义者** | 茶叶 | 宇宙共振、业力债务、市场耦合之道 | 5–45% |

观察者不交易，大约每 20 tick 发布一次报告。社会工程师还会读取整个**策略生态**：公会数量、主导流派、突变与模仿事件，并给出可执行的干预建议——比如叙事锁定风险上升时，建议「在 Rumor Mill 播下一颗不同意见的种子」。

---

## ⚖️ 一本必须平的账

- 限价检查、价格/时间优先、部分成交、智能体之间直接撮合
- 撮合不完的残量由 **House 做市商**按 `真实价格 ± 半价差` 吸收——所以小镇报价始终等于真实回放价格
- 每边收费，费用计入持仓成本；卖出实现盈亏
- 每 20 tick 校验一次：

```
Σ 智能体现金 + Σ 持仓×价格 + House 现金 + House 持仓×价格 + 手续费 = 常数
```

这个不变量在整个开发过程中保持了零次失败，测试套件覆盖了手续费、部分成交、平均成本、已实现盈亏、胜率和守恒。

---

## 📡 数据管道

- **一条时间线** —— 所有标的在同一个对齐的时间戳索引上回放，横截面关系是真实的
- **先校验再模拟** —— 剔除非法价格、重复时间戳、自相矛盾的 OHLC，high/low 必须包住 open/close
- **缓存而非侥幸** —— 对齐后的 bar 原子写入 `.cache/`，热启动约 50ms，雅虎挂了也能撑住
- **诚实的降级** —— `yfinance → Yahoo chart → iFinD（可选）→ 旧缓存 → 相关性合成数据`，界面永远标注 **LIVE / CACHED / SYNTHETIC**，合成数据绝不冒充真实行情

---

## 🚀 快速开始

```bash
git clone https://github.com/huiihao/agent-street.git
cd agent-street
pip install -r requirements.txt
python run.py
```

打开 **http://localhost:8766**，按 Start。

- ✅ **不需要任何 API key**
- 🎨 Three.js 已内置在 `frontend/vendor/three`，不需要 npm 或打包器
- 🧪 离线时会明确降级到带标注的合成数据
- ⌨️ 空格启动/暂停 · R 重置 · C 复位相机

可选的 LLM 增强（对话与反思质量更高，默认关闭）：

```bash
export LLM_API_KEY=sk-xxx
export LLM_ENABLED=true
```

<div class="box-tip" markdown="1">

**💡 关于成本**

LLM 是纯可选项。不开也能完整跑完整个模拟——交易、策略演化、公会形成都不依赖语言模型，只是对话会变成预设模板。

</div>

---

## 🏗️ 技术栈

| 层 | 实现 |
|----|------|
| 前端 | 原生 JS + Three.js r160（本地内置），无框架、无构建 |
| 后端 | Python 3.10+ / FastAPI / WebSocket |
| 引擎 | 指标 → 基因组加权决策 → 撮合与 House → 策略演化，闭环 |
| 数据 | yfinance / Yahoo chart / iFinD / 缓存 / 合成，五级降级 |
| 测试 | `python -m unittest discover -s tests -v`，21 个测试 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request
