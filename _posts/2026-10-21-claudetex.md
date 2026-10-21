---
title: ClaudeTex
date: 2026-10-21 12:00:00 +0800
categories: [ClaudeTex]
tags: [llm, tricks]
description: 给 Claude Code 写的 LaTeX 渲染插件：终端里把公式排成 Unicode 二维块，/tex 再用 KaTeX 在浏览器里精确排版。无需装 TeX，无外部依赖。
toc: true
---

<p align="center">
  <span style="font-size: 4rem;">🧮</span>
</p>

[![Release](https://img.shields.io/github/v/release/huiihao/ClaudeTex?style=flat-square&color=D97757&label=release)](https://github.com/huiihao/ClaudeTex/releases)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-2.1.287%2B-191919?style=flat-square&labelColor=D97757)](https://github.com/huiihao/ClaudeTex)
[![Tests](https://img.shields.io/badge/tests-38%20passing-D97757?style=flat-square)](https://github.com/huiihao/ClaudeTex)
[![License](https://img.shields.io/github/license/huiihao/ClaudeTex?style=flat-square&color=191919)](https://github.com/huiihao/ClaudeTex)

<p align="center">
  <b>ClaudeTex</b> = Claude + TeX。一个真正的 Claude Code 插件，不是套壳、不用 VS Code、不用装 TeX 发行版。
</p>

## 🤔 为什么做这个

Claude Code 的终端本质上是**字符网格**，它不会排版公式。现有的方案大多依赖 kitty / Ghostty 这类终端的图形协议，而 Windows Terminal 根本不支持。

ClaudeTex 直接挂到渲染器上，给两层互补的体验：

<div class="box-info" markdown="1">

**1️⃣ 终端里** —— 行内公式变成 Unicode（`x²`、`α`、`√`），独立公式排成二维块：真正的分数线、根号、上下标的求和号、矩阵、`cases`、`aligned`、`boxed`。**任何终端都能用。**

**2️⃣ 浏览器里** —— `/tex` 把当前回复写成一个本地 HTML 页面，用 **KaTeX** 精确排版。字符网格里怎么排都别扭的复杂公式，在那里是完全正确的。

</div>

> **设计原则：永远不要弄丢回复。** 公式写坏了、太大、嵌套太深，ClaudeTex 就原样保留 LaTeX，而不是把会话搞崩。

---

## 🎬 效果

```text
You  ❯  对 f(x) = x² sin x 求导

●  f′(x) = 2x sin x + x² cos x

You  ❯  写一下二次方程求根公式

          −b ± √(b² − 4ac)
          ────────────────
                      2a

You  ❯  /tex
   KaTeX 预览已在浏览器中打开：…/claudetex-preview-….html
```

---

## ✨ 特性

| | |
|---|---|
| **终端自动排版** | Claude Code 绘制回复之前，`$...$` 和 `\(...\)` 就已经被转换。 |
| **真正的二维公式** | 分数、根号、`\sum` / `\prod` 的上下限、矩阵、`cases`、`aligned`、`boxed`、`\binom`。 |
| **按需 KaTeX** | `/tex` 打开最新一条含公式的回复；`/tex all` 包含本次会话的全部回复。 |
| **懂 Markdown** | 代码块和行内代码原样不动；`$5`、`$10`、`$PATH`、`$and$` 不会被误判成公式。 |
| **跨平台** | Windows Terminal / macOS / Linux，终端、桌面端和 VS Code 扩展都能用。 |
| **零运行时依赖** | 跑在 Claude Code 进程内，不需要 Node.js、不需要 TeX 发行版、不起外部进程。 |
| **默认加固** | 输入有上限、出错不抛异常、CDN 资源走 SRI 校验、严格 CSP + DOMPurify。 |

---

## 🚀 快速开始

```bash
claude plugin marketplace add huiihao/ClaudeTex
claude plugin install tex@claudetex
```

开一个新会话，随便问一道数学题就行。

<div class="box-tip" markdown="1">

**💡 三个名字别搞混**

项目/仓库叫 **ClaudeTex**，marketplace id 是小写 `claudetex`，安装后的插件 id 是 `tex`，命令是 `/tex`。这样内部 id 保持 DNS 安全，品牌名又能正常阅读。

</div>

**要求**：Claude Code **2.1.287+**（从这个版本起插件默认启用），以及一个能联网的浏览器（`/tex` 预览从 cdnjs 加载 KaTeX）。

本地开发：

```bash
git clone https://github.com/huiihao/ClaudeTex
cd ClaudeTex
claude --plugin-dir .
```

---

## 📖 用法

正常提问即可。ClaudeTex 会在每个上下文窗口的第一条 prompt 后面加一句提示，让模型用 LaTeX 写公式。

```text
/tex          # 最新一条含数学的回复
/tex all      # 本次会话的全部回复
/tex-preview  # /tex 的别名
```

预览写在系统临时目录，用默认浏览器打开；命令会打印文件路径，浏览器没自动弹出来也能手动打开。

---

## ⚙️ 配置

```bash
/plugin configure tex@claudetex
```

或者直接改 `~/.claude/settings.json`：

```json
{
  "pluginConfigs": {
    "tex": {
      "options": {
        "inline": true,
        "display": true,
        "teach_claude": true,
        "max_width": 0
      }
    }
  }
}
```

| 选项 | 默认 | 说明 |
|------|------|------|
| `inline` | `true` | 把 `$...$` 和 `\(...\)` 转成 Unicode 数学符号 |
| `display` | `true` | 把 `$$...$$` 和 `\[...\]` 排成二维块 |
| `teach_claude` | `true` | 在每个上下文窗口的第一条 prompt 里提示模型用 LaTeX |
| `max_width` | `0` | 二维公式的最大宽度（终端格数），`0` 表示跟随终端 |

---

## 📐 支持范围

| 类别 | 例子 |
|------|------|
| 希腊字母与符号 | `\alpha \beta \pi \infty \partial \nabla \forall \exists` |
| 运算符与关系 | `\pm \times \cdot \le \ge \ne \approx \equiv \in \subset \cup \cap \to` |
| 上下标 | `x_i^2`、`\sum_{i=1}^n`、`\int_0^1` |
| 分数与根号 | `\frac{a+b}{c}`、`\dfrac`、`\sqrt{x}`、`\sqrt[3]{x}` |
| 大型运算符 | `\sum \prod \int \iint \oint \bigcup \bigcap` |
| 环境 | `pmatrix` `bmatrix` `Bmatrix` `vmatrix` `cases` `aligned` `align` `gather` |
| 字体 | `\mathbb` `\mathcal` `\mathfrak` `\mathbf` `\boldsymbol` `\mathsf` `\mathtt` |
| 重音 | `\hat` `\bar` `\vec` `\dot` `\ddot` `\tilde` `\overline` `\underline` |
| 工具 | `\text{}` `\boxed{}` `\binom{n}{k}` `\operatorname{}` `\left( \right)` |

---

## 🔧 工作原理

ClaudeTex 是一个标准的 Claude Code **插件**：它的 hooks 模块注册的函数直接跑在 Claude Code 自己的进程里。

| Hook | 作用 |
|------|------|
| `ui.render`（`AssistantMessage`） | 绘制之前改写回复：行内公式转 Unicode，独立公式排版成二维块 |
| `ui.render`（`CommandOutput`） | 对 `/btw` 这类命令输出做同样处理 |
| `prompt.submit` | 每个上下文窗口注入一次「用 LaTeX 写公式」的提示 |
| `session.start` | 注册 `/tex` 和 `/tex-preview` |
| `session.compact` / `session.end` | 压缩或 `/clear` 之后重置提示状态 |
| `command.run` | `/tex`：读会话消息 → 写 HTML → 打开浏览器 |

解析、排版、生成 HTML 全部在 hooks 模块内完成，**没有外部进程，也没有 npm 运行时依赖**。

---

## 🛡️ 健壮性

渲染器是按「优雅降级」设计的，宁可原样显示也不破坏对话：

- **解析有界** —— 超过 8000 字符或嵌套超过 64 层的公式原样保留；解析器保证向前推进，`\frac{` 没闭合、`\begin{matrix}` 没关闭、多余的 `}` 都不会死循环
- **排版有界** —— 超过 200 行或 1000 列的二维块退回折行文本
- **扫描有界** —— 超过 20 万字符的回复直接放行；代码跨度只在精确的反引号处闭合；CRLF 会被归一化
- **保守的公式识别** —— 货币、shell 变量、正文单词、空的 `$$ $$` 都不改写
- **不抛异常** —— 每个变换都包了保护，失败就返回原文
- **预览加固** —— 所有 CDN 资源走 SRI，严格 CSP（`connect-src 'none'`），DOMPurify 清洗，Markdown 原文存在惰性的 `<template>` 里
- **38 个测试** —— 覆盖非法输入、深度嵌套、超大回复、CRLF、代码跨度、货币启发式、命令失败和注册

---

## ⚠️ 它刻意不做的事

- **终端不是像素级的 KaTeX** —— 字符网格就是字符网格，分数和矩阵是 Unicode 近似。要精确排版请用 `/tex`
- **不画终端图片** —— Windows Terminal 不支持 kitty 图形协议
- **行内公式是启发式的** —— 极少数货币、URL、shell 变量可能误判，用反引号包起来即可退出
- **不是完整的 TeX 引擎** —— 冷门宏、TikZ、外部宏包不在范围内，未知命令按名字显示
- **预览需要联网** —— KaTeX / marked / DOMPurify 从 cdnjs 加载，离线时退回显示 Markdown 原文

---

## 🔒 隐私

- ClaudeTex **自己不发起任何网络请求**，解析、排版、HTML 生成全在本地
- `/tex` 页面从 `cdnjs.cloudflare.com` 加载 KaTeX 等资源（SRI 固定），**回复内容不出你的浏览器**
- Markdown 插入页面前经 DOMPurify 清洗
- 预览文件写在系统临时目录

---

## 📄 许可

MIT。ClaudeTex 是独立的社区项目，与 Anthropic 无关；Claude 是 Anthropic, PBC 的商标。
