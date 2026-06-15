---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---

<style>
/* ── shared variables ── */
.abt-badges {
  display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 18px;
}
.abt-badge {
  display: inline-block;
  padding: 5px 14px; border-radius: 5px;
  font-size: 0.82rem; font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.abt-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0,0,0,0.12);
}
.abt-badge a {
  color: #fff !important; text-decoration: none !important;
  border-bottom: none !important;
}

/* ── intro ── */
.abt-intro {
  font-size: 1.02rem; line-height: 1.65;
  margin-bottom: 6px;
}

/* ── research tags ── */
.abt-tags {
  display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 18px;
}
.abt-tag {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.8rem; padding: 5px 12px;
  border-radius: 20px; font-weight: 500;
  border: 1px solid var(--card-border, #e0e0e0);
  background: var(--card-bg, #fafafa);
  color: var(--text-color, #333);
  transition: border-color 0.2s, background 0.2s;
}
.abt-tag:hover { border-color: #999; background: var(--sidebar-hover-bg, #f0f0f0); }

/* ── publications ── */
.abt-pubs { list-style: none; padding-left: 0; margin: 12px 0 0; }
.abt-pubs li {
  position: relative; padding: 8px 0 8px 18px;
  border-bottom: 1px solid rgba(128,128,128,0.12);
  font-size: 0.88rem; line-height: 1.55;
}
.abt-pubs li:last-child { border-bottom: none; }
.abt-pubs li::before {
  content: ''; position: absolute; left: 0; top: 15px;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--text-muted, #bbb);
}
.abt-pubs li.highlight::before {
  background: var(--link-color, #2a7ae2);
  box-shadow: 0 0 5px rgba(42,122,226,0.25);
}
.abt-jrn {
  font-weight: 700; font-size: 0.78rem; letter-spacing: 0.3px;
  display: inline-block; margin: 0 2px;
}
.abt-doi {
  font-size: 0.72rem; color: var(--text-muted, #999); margin-left: 2px;
}
.abt-doi a { color: var(--text-muted, #999); }
.abt-doi a:hover { color: var(--link-color, #2a7ae2); }

/* ── skills ── */
.abt-skills {
  display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 10px;
}
.abt-skill {
  font-size: 0.8rem; padding: 5px 14px;
  border-radius: 20px; font-weight: 500;
  background: var(--card-bg, #f5f5f5);
  border: 1px solid var(--card-border, #e0e0e0);
  color: var(--text-color, #444);
}

/* ── interests ── */
.abt-interests {
  display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 0;
}
.abt-interest {
  font-size: 0.82rem; padding: 5px 14px;
  border-radius: 20px; font-weight: 500;
  background: var(--card-bg, #fafafa);
  border: 1px solid var(--card-border, #e0e0e0);
  color: var(--text-color, #444);
  transition: transform 0.2s ease;
}
.abt-interest:hover { transform: scale(1.04); }

/* ── projects (refined from earlier) ── */
.prj-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 12px 0;
}
@media (max-width: 640px) { .prj-grid { grid-template-columns: 1fr; } }
.prj-card {
  display: flex; gap: 14px; align-items: flex-start;
  background: var(--card-bg, #fff);
  border: 1px solid var(--card-border, #e0e0e0);
  border-radius: 10px; padding: 18px 16px;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.prj-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.prj-icon {
  width: 48px; height: 48px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.prj-icon.qr  { background: #eef7ff; }
.prj-icon.agt { background: #f0fdf4; }
.prj-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 2px; }
.prj-desc {
  font-size: 0.8rem; color: var(--text-muted, #666);
  line-height: 1.45; margin-bottom: 6px;
}
.prj-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
.prj-tag {
  font-size: 0.65rem; padding: 2px 8px; border-radius: 3px; font-weight: 500;
  background: var(--tag-bg, #f0f0f0); color: var(--tag-color, #555);
}
.prj-link {
  font-size: 0.75rem; font-weight: 600;
  color: var(--link-color, #2a7ae2); text-decoration: none;
}
.prj-link:hover { text-decoration: underline; }

/* ── responsive ── */
@media (max-width: 500px) {
  .abt-badges { flex-direction: column; }
  .abt-badge { text-align: center; }
}
</style>

---

## 👋 Welcome

<p class="abt-intro">
I am <strong>Yihao Hu</strong>, a Ph.D. at the department of Physics, Westlake University & Zhejiang University, Hangzhou, Zhejiang, China.
</p>

<div class="abt-badges">
  <span class="abt-badge" style="background: linear-gradient(120deg, #2c3e50, #3498db);">
    <a href="/assets/files/cv_20260615.pdf" target="_blank">📄 CV / 简历</a>
  </span>
  <span class="abt-badge" style="background: linear-gradient(120deg, #00498F, #34A853);">
    <a href="https://scholar.google.com/citations?hl=zh-CN&authuser=1&user=JHcBJxIAAAAJ">📚 Google Scholar</a>
  </span>
</div>

## 🔬 Research Interests

<div class="abt-tags">
  <span class="abt-tag">⚛️ Multi-scale simulations of ferroelectrics</span>
  <span class="abt-tag">🤖 Machine learning force field development</span>
  <span class="abt-tag">📈 Quantitative Investment</span>
</div>

## 📄 Publications

<ul class="abt-pubs">
  <li class="highlight">
    <b><u>Yihao Hu</u></b>*, and Shi Liu*,
    "Double Helix of Atomic Displacements in Ferroelectric PbTiO<sub>3</sub>",
    <span class="abt-jrn" style="color:#e70012;">Chin. Phys. Lett.</span> 42, 120707 (2025)
    <span class="abt-doi"><a href="https://doi.org/10.1088/0256-307X/42/12/120707">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li>
    Yonghao Yao, Hui Liu*, <b><u>Yihao Hu</u></b>, Kaustuv Datta, Jiagang Wu, Yuanpeng Zhang, Matthew G. Tucker, Shi Liu, Joerg C. Neuefeind, Shujun Zhang, and Jun Chen*,
    "Fluctuating local polarization: a generic fingerprint for enhanced piezoelectricity in Pb-based and Pb-free perovskite ferroelectrics",
    <span class="abt-jrn" style="color:#008B8B;">Nat. Commun.</span> 16, 7442 (2025)
    <span class="abt-doi"><a href="https://doi.org/10.1038/s41467-025-62701-1">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li class="highlight">
    Ching-Che Lin, <b><u>Yihao Hu</u></b>, Jaegyu Kim, Djamila Lou, Ashwath Bhat, Pravin Kavle, Tae Yeon Kim, Chris Dames, Shi Liu*, and Lane W. Martin*,
    "Domain-wall enhanced pyroelectricity",
    <span class="abt-jrn" style="color:#F18B1C;">Phys. Rev. X</span> 15, 011063 (2025)
    <span class="abt-doi"><a href="https://doi.org/10.1103/PhysRevX.15.011063">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li>
    Hao Luo, Qi Liang, Anan Guo, Yimeng Yu, Haoyang Peng, Xiaoyi Gao, <b><u>Yihao Hu</u></b>, Xianli Su, Ctirad Uher, Yu Zheng, Dongwang Yang, Xiaolin Wang, Qingjie Zhang, Xinfeng Tang, Shi Liu, Gustaaf Van Tendeloo, Shujun Zhang* & Jinsong Wu*,
    "Current induced electromechanical strain in thin antipolar Ag<sub>2</sub>Se semiconductor",
    <span class="abt-jrn" style="color:#008B8B;">Nat. Commun.</span> 16, 1818 (2025)
    <span class="abt-doi"><a href="https://doi.org/10.1038/s41467-025-57057-5">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li class="highlight">
    <b><u>Yihao Hu</u></b>, Jiyuan Yang, Shi Liu*,
    "Giant Piezoelectric Effects of Topological Structures in Stretched Ferroelectric Membranes",
    <span class="abt-jrn" style="color:#F18B1C;">Phys. Rev. Lett.</span> 133, 046802
    (<span style="color:#e70012;font-weight:700;font-style:italic;">Editors' Suggestion</span>)
    <span class="abt-doi"><a href="https://doi.org/10.1103/PhysRevLett.133.046802">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li>
    Tingting Luo, Fanjie Xia, Quansheng Guo, Shi Liu*, <b><u>Yihao Hu</u></b>, Yaqiong Zhong, Junhao Qiu, Lin Liao, Wei Ji, Xianli Su, Jinsong Wu*, and Xinfeng Tang*,
    "Enhancing Thermoelectric Performance in Cubic CuCdInSe<sub>3</sub> Compounds via Pressure-Induced Twin Boundary Engineering",
    <span class="abt-jrn" style="color:#555;">ACS Appl. Energy Mater.</span> 6, 24, 12379–12388
    <span class="abt-doi"><a href="https://doi.org/10.1021/acsaem.3c02233">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li>
    Tingting Luo<sup>†</sup>, <b><u>Yihao Hu</u></b><sup>†</sup>, Shi Liu, Fanjie Xia, Junhao Qiu, Haoyang Peng, Keke Liu, Quansheng Guo, XingZhong Li, Dongwang Yang, Xianli Su*, Jinsong Wu*, Xinfeng Tang*,
    "Entropy-driven structural transition from tetragonal to cubic phase: High thermoelectric performance of CuCdInSe<sub>3</sub> compound",
    <span class="abt-jrn" style="color:#555;">Mater. Today Phys.</span> 37, 101211
    <span class="abt-doi"><a href="https://doi.org/10.1016/j.mtphys.2023.101211">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li>
    Changming Ke, <b><u>Yihao Hu</u></b> and Shi Liu*,
    "Depolarization Induced III-V Triatomic Layers with Tristable Polarization States",
    <span class="abt-jrn" style="color:#555;">Nanoscale Horiz.</span> 8, 616-623
    <span class="abt-doi"><a href="https://doi.org/10.1039/D3NH00026E">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li>
    Jiawei Huang<sup>†</sup>, <b><u>Yihao Hu</u></b><sup>†</sup>, and Shi Liu*,
    "Origin of ferroelectricity in magnesium doped zinc oxide",
    <span class="abt-jrn" style="color:#F18B1C;">Phys. Rev. B</span> 106, 144106
    <span class="abt-doi"><a href="https://doi.org/10.1103/PhysRevB.106.144106">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li>
    Zijun Zhang<sup>†</sup>, Xing Chen<sup>†</sup>, Xiaoming Shi<sup>†</sup>, <b><u>Yihao Hu</u></b>, Jiawei Huang, Shi Liu, Zhaohui Ren, Houbing Huang, Gaorong Han, Gustaaf Van Tendeloo, Ze Zhang, He Tian*,
    "Morphotropic phase boundary in pure perovskite lead titanate at room temperature",
    <span class="abt-jrn" style="color:#555;">Mater. Today Nano</span> 20, 100275
    <span class="abt-doi"><a href="https://doi.org/10.1016/j.mtnano.2022.100275">DOI <i class="fas fa-book-open" style="font-size:0.7rem;opacity:0.7;"></i></a></span>
  </li>
  <li class="highlight">
    <span style="color:#F18B1C;font-weight:700;font-style:italic;">[Book]</span> "电子材料计算", 刘仕 (<b><u>Yihao Hu</u></b>: 全局整合编写), 施建章, 彭仁赐, etc., 清华大学出版社, ISBN: 978-7-3026-7887-8
  </li>
  <li class="highlight">
    <span style="color:#F18B1C;font-weight:700;font-style:italic;">[Book Chapter]</span> "Multiscale simulations of ferroelectric oxides", Jiawei Huang, Zhuang Qian, <b><u>Yihao Hu</u></b>, Qisheng Yu and Shi Liu, Ferroelectrics: Advances in fundamental studies and emerging applications, ISBN: 978-0-7503-3975-9
  </li>
</ul>

---

{% include dipole-spiral-poster.html %}

## 🛠 Skills

<div class="abt-skills">
  <span class="abt-skill">🐍 Python3 (ASE, Pymatgen)</span>
  <span class="abt-skill">⚡ VASP · DFT calculations</span>
  <span class="abt-skill">🧠 Deep Potential · ML force fields</span>
  <span class="abt-skill">📊 LAMMPS · MD simulations</span>
  <span class="abt-skill">🤖 AI-assisted workflows</span>
</div>

## 🚀 Projects

<div class="prj-grid" markdown="0">

<div class="prj-card">
  <div class="prj-icon qr">📱</div>
  <div>
    <div class="prj-name"><a href="https://github.com/huiihao/QRSync" target="_blank" rel="noopener">QRSync</a></div>
    <div class="prj-desc">基于二维码序列的离线文件传输工具，无需安装、无需网络、无需服务器。</div>
    <div class="prj-tags">
      <span class="prj-tag">Browser-based</span>
      <span class="prj-tag">Zero-install</span>
      <span class="prj-tag">Air-gapped</span>
    </div>
    <a class="prj-link" href="https://github.com/huiihao/QRSync" target="_blank" rel="noopener">📦 GitHub →</a>
  </div>
</div>

<div class="prj-card">
  <div class="prj-icon agt">🏘️</div>
  <div>
    <div class="prj-name"><a href="https://github.com/huiihao/agent-street" target="_blank" rel="noopener">Agent Street</a></div>
    <div class="prj-desc">像素风生成式智能体模拟小镇，内置股票市场。探索 AI agent 经济交互与涌现行为。</div>
    <div class="prj-tags">
      <span class="prj-tag">Generative Agents</span>
      <span class="prj-tag">Pixel-art</span>
      <span class="prj-tag">Simulation</span>
    </div>
    <a class="prj-link" href="https://github.com/huiihao/agent-street" target="_blank" rel="noopener">📦 GitHub →</a>
  </div>
</div>

</div>

## 🏔 Interests

<div class="abt-interests">
  <span class="abt-interest">🧗 Rock climbing</span>
  <span class="abt-interest">🎣 Fishing</span>
  <span class="abt-interest">🚣 Rowing</span>
  <span class="abt-interest">🍺 Drinking</span>
</div>
