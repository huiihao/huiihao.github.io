---
title: Agent Street
date: 2026-05-22 12:00:00 +0800
categories: [Agent Street]
tags: [agent-street, python, simulation, agent, llm]
description: A pixel-art simulation town where 16 MBTI-driven AI agents live, trade stocks, chat, and form fragile market equilibria — powered by LLMs and real stock data.
toc: true
---

<p align="center">
  <span style="font-size: 4rem;">🏘️</span>
</p>

[![Python](https://img.shields.io/badge/python-3.10+-blue?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://img.shields.io/badge/License-MIT-green)
[![GitHub Stars](https://img.shields.io/github/stars/huiihao/agent-street?style=social)](https://github.com/huiihao/agent-street)
[![Agents](https://img.shields.io/badge/agents-19-ff69b4?style=flat-square)](https://github.com/huiihao/agent-street)

<p align="center">
  <b>Agent Street</b> 是一个像素风生成式智能体模拟小镇。19 位 AI 交易员（16 MBTI 性格 + 3 位观察者）在真实行情驱动下交易、交谈、形成脆弱的市场均衡。
</p>


## 🌐 在线体验

**👉 [点击访问 Agent Street](https://github.com/huiihao/agent-street)**

```bash
git clone https://github.com/huiihao/agent-street.git
cd agent-street
pip install -r requirements.txt
python run.py
```

---

## 💡 核心概念

```
真实 K 线  ──强制映射──→  🏪 小镇股市
                              │
 ┌────────────────────────────┼────────────────────────┐
 ▼                ▼           ▼            ▼           ▼
🧠 观察·反思·记忆  💬 聊天·传播  📈 性格驱动  🔭📐🔮 观察者
                  情绪         交易        报告
 │                │           │            │
 └────────────────┼───────────┘            │
                  ▼                        │
        ⚖️ 对冲引擎 (House MM)              │
        吸收净不平衡 → 价格 ≡ 真实价格       │
                  │                        │
                  ▼                        │
  🔄 脆弱均衡 → 打破 → 新均衡 → 再打破 → ……
```

> 历史 K 线逐 tick 推进。智能体观察价格变化、形成反思、相互交谈、下达订单。所有净不平衡由 House 做市商吸收，保证小镇股价 ≡ 真实股价。智能体情绪与真实市场走势之间的张力，形成一个**不断被打破的脆弱均衡**。

---

## 🗺️ 小镇地图

```
Actual 20×14 tile map:

Legend:  . grass  = road  | road_v  # building  * tree  ~ water

***..............***
*..................*
..###...###...###...
..###...###...###...
::::::::::::::::::::
....................
..##....###....##...
..##....###....##...
::::::::::::::::::::
...*....~~....*....
...*....~~....*....
::::::::::::::::::::
........###.........
.**..*..###..*..**..
```

| 🏠 建筑 | 坐标 | 居民 |
|---------|------|------|
| 🔵 Blue Roof | (2,2) | INTJ · INTP · ENTJ · ENTP |
| 🔴 Red Roof | (9,2) | INFJ · INFP · ENFJ · ENFP |
| 🟢 Green Roof | (14,2) | ISTJ · ISFJ · ESTJ · ESFJ |
| 🟡 Yellow Roof | (2,6) | ISTP · ISFP · ESTP · ESFP |
| ☕ Morning Brew | (9,6) | 社交中心 |
| 📚 Data Library | (15,6) | 数据查询 |
| 🏢 Trading Floor | (2,9) | 订单执行 |
| 🌳 Willow Park | (9,9) | 休闲区 |
| 📐 Math Tower | (18,2) | 观察者 🔭 |
| 🔮 Fortune Tent | (1,11) | 观察者 |

---

## ✨ 功能特点

| 特性 | 说明 |
|------|------|
| 🧠 **16 MBTI 性格** | 每种性格独特的交易策略和风险偏好 |
| 💬 **Agent 间对话** | 实时聊天传播情绪，形成群体心理 |
| 📈 **真实行情驱动** | 历史 K 线逐 tick 推进市场 |
| ⚖️ **House 做市商** | 吸收净不平衡，保证价格一致性 |
| 🔄 **脆弱均衡** | 智能体情绪 vs 真实市场的动态张力 |
| 🤖 **LLM 驱动** | 可选 LLM 为智能体提供语言和推理能力 |
| 🎨 **像素风 UI** | 20×14 tile 小镇地图，复古游戏风格 |
| 🔭 **观察者系统** | 独立 Agent 监控市场并生成分析报告 |

---

## 📖 使用方法

### 快速启动

```bash
# 安装依赖
pip install -r requirements.txt

# 启动后端
python run.py
```

### 配置 LLM（可选）

Agent Street 可在无 LLM 模式下运行，智能体使用预设性格模板。启用 LLM 以获得更丰富的对话和推理：

```bash
export OPENAI_API_KEY=sk-xxx
# 或在 .env 文件中配置
```

### 观察市场

1. 浏览器打开 `http://127.0.0.1:8000`
2. 观察 16 位 MBTI 交易员在小镇中移动、交谈、交易
3. 查看观察者生成的实时市场报告
4. 追踪脆弱均衡的形成与打破

---

## 🏗️ 技术架构

```
┌────────────────────────────────────────────────┐
│                  Frontend (Web)                 │
│  20×14 Tile Map · Agent Chat · Market Board    │
├────────────────────────────────────────────────┤
│                  Backend (Python)               │
│  ┌─────────┐  ┌─────────┐  ┌────────────────┐  │
│  │  Agent  │  │  Town   │  │  Market Engine │  │
│  │ Engine  │  │  World  │  │  (House MM)    │  │
│  └─────────┘  └─────────┘  └────────────────┘  │
│  ┌─────────────────────────────────────────┐   │
│  │           LLM Interface (optional)       │   │
│  └─────────────────────────────────────────┘   │
├────────────────────────────────────────────────┤
│               Data Layer                        │
│  Stock K-lines · Agent Memory · Event Logs     │
└────────────────────────────────────────────────┘
```

---

## 📦 项目结构

```
agent-street/
├── frontend/          # Web 前端（像素风 UI）
├── backend/           # Python 后端
│   ├── agents/        # 智能体引擎
│   ├── models/        # 小镇地图与市场模型
│   └── tools/         # 工具脚本
├── docs/              # 文档与截图
├── run.py             # 启动入口
├── requirements.txt   # Python 依赖
├── README.md          # 英文文档
└── README_CN.md       # 中文文档
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request
