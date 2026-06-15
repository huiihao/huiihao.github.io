---
title: A-Share Realtime Dashboard
date: 2026-06-15 09:30:00 +0800
categories: [A-Share Dashboard]
tags: [dashboard, a-share, quant, finance, flask]
description: A股实时看盘面板 — 5207只股票、4路数据源、8秒全量刷新。Bloomberg Terminal风格，Light/Dark主题。量化投资数据基础设施。
toc: true
---

<p align="center">
  <span style="font-size: 4rem;">📊</span>
</p>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Coverage](https://img.shields.io/badge/A股-5207只-35a86b?style=for-the-badge)](https://github.com/huiihao/a-share-realtime-dashboard)
[![Data](https://img.shields.io/badge/数据源-4路-58a6ff?style=for-the-badge)](https://github.com/huiihao/a-share-realtime-dashboard)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://img.shields.io/badge/License-MIT-green)

<p align="center">
  <b>A-Share Realtime Dashboard</b> 是一个 Bloomberg Terminal 风格的 A 股实时看盘面板，覆盖 5207 只股票，聚合 4 路数据源，8 秒全量刷新。既是可视化面板，更是量化投资的底层数据基础设施。
</p>


## 🚀 快速开始

```bash
git clone https://github.com/huiihao/a-share-realtime-dashboard.git
cd a-share-realtime-dashboard
pip install -r requirements.txt
python app.py
```

🌐 浏览器打开 **`http://127.0.0.1:5000`**

---

## 💡 为什么做这个

量化投资的第一步永远是 **可靠的数据**。

| 层级 | 说明 |
|------|------|
| 🖥️ **看盘面板** | 可视化验证层 — 确认数据及时、准确 |
| ⚙️ **数据管道** | 多源采集、清洗、存储 — 5207 只 × 日 K 线 |
| 📈 **量化策略** | 因子分析、回测、组合优化 — 终极目标 |

> **Dashboard is the mirror; the data pipeline is the engine.**

---

## 🎛️ 面板功能

### 📐 整体布局

```
┌──────────────────────────────────────────────────────────┐
│  📈 指数: 上证 4053 +0.5% │ 深证 15153 +1.3% │ ...       │
├──────────────────────────────────────────────────────────┤
│  🏛️ 分段: 沪主板 +1.3% │ 科创板 +3.3% │ 创业板 +2.8% │...  │
├────────────┬────────────┬────────────┬───────────────────┤
│ 📊 5207    │ 📈 3371↑   │ 🎯 196↑   │ 📉 均 +1.64%      │
│   追踪     │ 📉 1691↓   │ 💥 12↓    │ 💰 26430 亿       │
├────────────┴────────────┼────────────┴───────────────────┤
│ 📈 涨幅榜 (不含涨停)     │ 🚀 涨停板 (全部 278 只)        │
│ 📉 跌幅榜 (不含跌停)     │ 💥 跌停板 (全部 12 只)         │
├─────────────────────────┼───────────────────────────────┤
│ 💰 成交额 TOP-N          │ 🏭 行业板块 (独立刷新)         │
└─────────────────────────┴───────────────────────────────┘
```

### 🎮 交互控件

| 🎛️ 控件 | 位置 | 选项 |
|---------|------|------|
| 📏 **TOP-N** | 涨跌幅 / 成交额 | 20 · 50 · 100 |
| 📡 **数据源** | 顶部导航 | 新浪财经 · 东方财富 · 同花顺 iFinD |
| ⏱️ **刷新间隔** | 顶部导航 | 3s · 5s · 10s · 30s · 60s |
| 🏭 **板块刷新** | 行业面板 | 5min · 10min · 30min (独立定时器) |
| 🌓 **主题** | 右上角 | Light ↔ Dark (localStorage 持久化) |
| 🔴🟢 **颜色** | 右上角 | 红涨绿跌 ↔ 绿涨红跌 (一键互换) |

---

## ✨ 设计亮点

| 特性 | 说明 |
|------|------|
| 🚀💥 **涨跌停分离** | 涨停板/跌停板独立面板，涨跌榜自动排除 ≥9.9% 极限涨跌 |
| ♿ **色盲友好** | 上涨=青绿 `#3fb950`，下跌=暖红 `#f85149` |
| 🧹 **数据清洗** | 自动过滤停牌股 (price=0)、退市股 (pct=-100%) |
| 🦴 **骨架屏** | 首次加载 shimmer 动画，减少感知等待感 |
| 📱 **响应式** | 1024px / 640px 双断点，平板手机均可使用 |
| 💾 **本地回退** | 东方财富 API 不可用时，自动读取同花顺本地数据 |
| 🌓 **双主题** | Light/Dark 一键切换，localStorage 持久化 |

---

## 📡 数据管道

看盘面板只是冰山一角 🌊。下面的采集管道才是量化研究的真正基础：

### 🔬 生产级脚本

| 📜 脚本 | 📡 数据源 | 📦 产出 | ⭐ 可靠性 |
|----------|----------|--------|-----------|
| `fetch_baostock.py` | Baostock | **5207 只全量日 K 线** (9 MB) | ⭐⭐⭐⭐⭐ |
| `market_analysis_v2.py` | 本地 CSV | 全市场看盘分析报告 | ⭐⭐⭐⭐⭐ |
| `monitor_hexin.py` | 同花顺进程 | 网络连接 / 数据流实时监控 | ⭐⭐⭐⭐ |
| `test_ifind.py` | pywencai | 财务·技术·资金流向全方位查询 | ⭐⭐⭐⭐ |
| `setup_mitmproxy.py` | mitmproxy | HTTP 流量拦截，API 逆向分析 | ⭐⭐⭐ |

### 🔀 数据流向

```
┌─────────────┐
│ 新浪财经 API  │── 实时行情 (5,207 只, ~8s 全量) ──┐
├─────────────┤                                    │
│ 东方财富 API  │── 行业板块 (优先, 网络可达时) ────┼──→ Flask API ──→ 🖥️ 看盘面板
├─────────────┤                                    │
│ 同花顺 iFinD │── 财务因子 (PE/ROE/利润增速) ─────┤
├─────────────┤                                    │
│ Baostock    │── 日 K 线 (全历史, 无限制) ────────┴──→ 💾 CSV ──→ 📊 pandas 量化
└─────────────┘
```

### 🆚 数据源对比

| 🎯 | 🔵 新浪 | 🟠 东方财富 | 🟣 iFinD | 🟢 Baostock |
|---|---------|------------|---------|------------|
| **实时行情** | ✅ 极快 | ✅ | ✅ | ❌ |
| **日 K 线** | ❌ | ✅ | ✅ | ✅ 最稳定 |
| **财务报表** | ❌ | ✅ | ✅ 最全 | ✅ |
| **技术指标** | ❌ | ❌ | ✅ MACD/KDJ | ❌ |
| **频率限制** | 低 | 中 | 需付费 | ⭐ 无限制 |

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────┐
│              Frontend (HTML/CSS/JS)           │
│  Bloomberg Terminal UI · SSE 实时推送         │
├─────────────────────────────────────────────┤
│              Backend (Flask)                  │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  │
│  │ API 路由   │  │ SSE 推送  │  │ 缓存层   │  │
│  └───────────┘  └──────────┘  └──────────┘  │
├─────────────────────────────────────────────┤
│            Data Pipeline                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌─────────┐  │
│  │新浪   │  │东方   │  │同花顺  │  │Baostock │  │
│  │财经   │  │财富   │  │iFinD  │  │         │  │
│  └──────┘  └──────┘  └──────┘  └─────────┘  │
├─────────────────────────────────────────────┤
│              Storage                          │
│  CSV · JSON · SQLite · localStorage          │
└─────────────────────────────────────────────┘
```

---

## 📦 项目结构

```
a-share-realtime-dashboard/
├── app.py              # Flask 主程序
├── templates/          # HTML 模板
│   └── dashboard.html  # 看盘主页面
├── run.bat             # Windows 一键启动
├── requirements.txt    # Python 依赖
└── README.md           # 文档
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request
