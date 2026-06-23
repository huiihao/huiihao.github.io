---
title: EchoWave Music
date: 2026-06-23 12:00:00 +0800
categories: [EchoWave Music]
tags: [echowave, music, html, python, flask]
description: Online music search & playback platform with 5-source aggregation. Dark editorial-luxe UI, streaming with lyrics sync, playlist system. Lite version deployable on GitHub Pages.
toc: true
---

<p align="center">
  <span style="font-size: 4rem;">🎵</span>
</p>

[![Version](https://img.shields.io/badge/version-1.0-7b6cf6?style=flat-square)](https://github.com/huiihao/EchoWave-Music)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://img.shields.io/badge/License-MIT-green)
[![Sources](https://img.shields.io/badge/sources-5-blueviolet?style=flat-square)](https://github.com/huiihao/EchoWave-Music)
[![GitHub Stars](https://img.shields.io/github/stars/huiihao/EchoWave-Music?style=social)](https://github.com/huiihao/EchoWave-Music)

<p align="center">
  <b>EchoWave Music</b> 是一个在线音乐搜索与播放平台，聚合 5 大音源，提供流媒体播放、歌词同步、歌单管理等功能。完整版支持本地部署，精简版可直接部署于 GitHub Pages。
</p>

## 🌐 在线体验

**👉 [精简版 (GitHub Pages)](https://huiihao.github.io/EchoWave-Music/)**

仅需浏览器，零依赖，立即搜索试听。

**完整版**：

```bash
git clone https://github.com/huiihao/EchoWave-Music.git
cd EchoWave-Music
pip install musicdl
python server.py
# → http://localhost:5000
```

---

## 📦 版本说明

| 🚀 版本 | 📄 文件 | 🎸 音源 | 🌐 部署 |
|:---|:---|:---|:---|
| **完整版** | `index.html` + `server.py` | 网易云 · QQ · 酷我 · 酷狗 · 咪咕 | `python server.py` |
| **精简版** | `docs/index.html` | 网易云 · QQ | [GitHub Pages](https://huiihao.github.io/EchoWave-Music/) |

---

## ✨ 功能特点

| 特性 | 说明 |
|------|------|
| 🔍 **聚合搜索** | 5 音源并行搜索，交替展示结果 |
| 🎵 **流媒体播放** | CDN 直链，歌词高亮同步 |
| 📋 **歌单系统** | 收藏 / 自定义歌单 / JSON 导入导出 |
| 🎨 **暗色专业风** | Editorial-luxe 设计，侧栏 + 主视图布局 |
| 📱 **响应式** | 桌面 / 平板 / 手机全适配 |
| ⌨️ **快捷键** | Space 播放暂停 · ←→ 快进退 · N/P 切歌 · F 收藏 |
| 🔄 **双版本** | 完整版 5 音源 + 精简版 GitHub Pages 零后端部署 |

---

## 📖 使用方法

### 完整版

```bash
pip install musicdl
python server.py
# 浏览器自动打开 → 全部音源可用
```

### 精简版

浏览器直接访问 [GitHub Pages](https://huiihao.github.io/EchoWave-Music/)，即刻使用网易云 + QQ 音源。

### ⌨️ 快捷键

| 按键 | 功能 |
|:---|------|
| `Space` | 播放 / 暂停 |
| `←` `→` | 快退 / 快进 |
| `N` `P` | 上一首 / 下一首 |
| `F` | 收藏当前歌曲 |

---

## 🏗️ 技术架构

```
浏览器前端 (index.html)
  │
  ├── 网易云 / QQ ──────────→ 直接 API（meting / tang）
  │
  └── 酷我 / 酷狗 / 咪咕 ──→ localhost:5000 → musicdl → CDN 直链
```

---

## 📦 项目结构

```
EchoWave-Music/
├── index.html      # 完整版前端（5 音源）
├── server.py       # Flask 代理后端
├── lite.html       # 精简版（纯前端）
├── docs/           # GitHub Pages 部署目录
├── .env.example    # 环境变量模板
└── README.md       # 文档
```

---

## 🙏 致谢

基于 [@CharlesPikachu](https://github.com/CharlesPikachu) 的开源项目构建：

- 🎵 [**MusicSquare**](https://github.com/CharlesPikachu/musicsquare) — 浏览器端音乐搜索与播放
- 🎶 [**musicdl**](https://github.com/CharlesPikachu/musicdl) — Python 多源音乐下载库

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request
