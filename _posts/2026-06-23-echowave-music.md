---
title: EchoWave Music
date: 2026-06-23 11:11:00 +0800
categories: [EchoWave Music]
tags: [echowave, music, html, python, flask]
description: Online music search & download platform with 5-source aggregation. Light/Dark theme, streaming with karaoke lyrics sync, playlist system. Lite version deployable on GitHub Pages.
toc: true
---

<p align="center">
  <span style="font-size: 4rem;">🎵</span>
</p>

[![Version](https://img.shields.io/badge/version-1.1-7b6cf6?style=flat-square)](https://github.com/huiihao/EchoWave-Music)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://img.shields.io/badge/License-MIT-green)
[![Sources](https://img.shields.io/badge/sources-5-blueviolet?style=flat-square)](https://github.com/huiihao/EchoWave-Music)
[![Theme](https://img.shields.io/badge/theme-dark%20%7C%20light-8b5cf6?style=flat-square)](https://github.com/huiihao/EchoWave-Music)
[![GitHub Stars](https://img.shields.io/github/stars/huiihao/EchoWave-Music?style=social)](https://github.com/huiihao/EchoWave-Music)

<p align="center">
  <b>EchoWave Music</b> 是一个在线音乐聚合搜索与下载平台，聚合 5 大音源，支持流媒体播放、Karaoke 歌词同步、歌单管理。完整版本地部署，精简版开箱即用，均支持 Light/Dark 主题。
</p>

## 🌐 在线体验

**👉 [精简版 (GitHub Pages)](https://huiihao.github.io/EchoWave-Music/)**

仅需浏览器，零依赖。完整版音源更多：

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
| 🔍 **聚合搜索** | 5 音源并行搜索 (Netease / QQ / Kuwo / Kugou / Migu)，交替展示 |
| 🎵 **流媒体播放** | CDN 直链，歌词 Karaoke 高亮同步 |
| 📋 **歌单系统** | 收藏 / 自定义歌单 / JSON 导入导出 / 删除管理 |
| 🌓 **Light / Dark** | 侧栏一键切换，偏好 localStorage 持久保存 |
| 🏷️ **音质 & VIP** | LOSSLESS / 320K / SVIP 标签实时显示 |
| 🖼️ **封面图展示** | 搜索结果 + 播放器大封面 + 侧栏迷你封面 |
| 🎨 **现代设计** | Space Grotesk + DM Sans 字体，玻璃态面板 |
| 📱 **全响应式** | 桌面 → 平板 → 手机，移动端底部标签栏 |
| ⌨️ **快捷键** | Space 播放暂停 · ←→ 快进退 5s · ↑↓ 音量 · N/P 切歌 · F 收藏 · L 歌词特效 |
| 🔌 **代理自动检测** | 同源 / localhost:5000 自动发现 musicdl 后端 |

---

## 📖 使用方法

### 完整版

```bash
pip install musicdl
python server.py
# 浏览器自动打开 → 全部音源可用
```

### 精简版

浏览器直接访问 [GitHub Pages](https://huiihao.github.io/EchoWave-Music/)。

### ⌨️ 快捷键

| 按键 | 功能 |
|:---|------|
| `Space` | 播放 / 暂停 |
| `←` `→` | 快退 / 快进 (5s) |
| `↑` `↓` | 音量升降 |
| `N` `P` | 上一首 / 下一首 |
| `F` | 收藏当前歌曲 |
| `L` | 歌词特效切换 |

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
├── server.py       # 一体化服务器 (静态 + 代理 API + 自动打开浏览器)
├── lite.html       # 精简版源文件
├── docs/
│   └── index.html  # GitHub Pages 部署 (精简版 + Light/Dark)
└── README.md
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
