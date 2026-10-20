/**
 * /stats/ 页面：把构建时写进来的 JSON 渲染成曲线、地图和条形图。
 *
 * 数据在 <script type="application/json" id="stats-data"> 里，结构见
 * tools/fetch-analytics.rb：
 *   { available, generated_at, source, totals:{visitors, days},
 *     daily:[{d:"2026-10-01", v:12}, ...],
 *     countries:[{c:"CN", n:"中国", v:120}, ...] }
 */

(function () {
  'use strict';

  var node = document.getElementById('stats-data');
  if (!node) return;

  var data;
  try {
    data = JSON.parse(node.textContent);
  } catch (e) {
    return;
  }

  var daily = data.daily || [];
  var countries = data.countries || [];

  renderChart(daily);

  // 宽度变了要重画（viewBox 跟着容器走）
  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { renderChart(daily); }, 150);
  });

  // 地图数据里带中文国名（world.json 的 NAME_ZH），先取它，
  // 条形图和地图就能用同一套名字；取不到就退回 GoatCounter 的英文名。
  var mapHost = document.getElementById('stats-map');
  var mapSrc = (mapHost && mapHost.dataset.src) || '/assets/data/world.json';

  fetch(mapSrc)
    .then(function (r) { return r.json(); })
    .catch(function () { return null; })
    .then(function (world) {
      renderBars(countries, world);
      renderMap(world, countries);
    });

  // ------------------------------------------------------------ 曲线
  function renderChart(rows) {
    var host = document.getElementById('stats-chart');
    if (!host) return;
    if (!rows.length) { host.innerHTML = '<p class="stats-none">暂无数据</p>'; return; }

    // viewBox 的宽度直接取容器宽度：这样 1 个 SVG 单位 = 1 个 CSS 像素，
    // 坐标轴文字不会跟着缩小。固定 viewBox 的话，720 单位的图在 320px 屏上
    // 只剩 0.44 倍，11px 的字实际不到 5px，完全看不清。
    var W = Math.round(host.clientWidth || 720);
    W = Math.max(260, Math.min(760, W));
    var H = Math.round(Math.min(260, Math.max(200, W * 0.55)));
    var padL = 40, padR = 10, padT = 14, padB = 26;
    var iw = W - padL - padR;
    var ih = H - padT - padB;

    // GoatCounter 的统计接口只给访客数（按天去重），没有 pageviews，
    // 所以这里只有一条线。
    var rawMax = Math.max.apply(null, rows.map(function (r) { return r.v; }));
    // 刻度取整：让 max/4 是整数，轴上不会出现 23、15 这种数字
    var max = Math.max(4, Math.ceil(rawMax / 4) * 4);

    var x = function (i) {
      return padL + (rows.length === 1 ? iw / 2 : (i / (rows.length - 1)) * iw);
    };
    var y = function (v) { return padT + ih - (v / max) * ih; };

    function series(key) {
      return rows.map(function (r, i) {
        return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(r[key]).toFixed(1);
      }).join('');
    }

    var lineV = series('v');
    var area = lineV + 'L' + x(rows.length - 1).toFixed(1) + ' ' + (padT + ih) +
               'L' + x(0).toFixed(1) + ' ' + (padT + ih) + 'Z';

    var parts = [];
    parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" class="stats-svg">');

    for (var g = 0; g <= 4; g++) {
      var gy = padT + (ih / 4) * g;
      parts.push('<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) +
                 '" y2="' + gy.toFixed(1) + '" class="stats-grid"/>');
      parts.push('<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) +
                 '" class="stats-axis" text-anchor="end">' + fmt(Math.round(max - (max / 4) * g)) + '</text>');
    }

    parts.push('<path d="' + area + '" class="stats-area"/>');
    parts.push('<path d="' + lineV + '" class="stats-line"/>');

    var idx = rows.length > 2 ? [0, Math.floor((rows.length - 1) / 2), rows.length - 1] : [0, rows.length - 1];
    idx.forEach(function (i) {
      parts.push('<text x="' + x(i).toFixed(1) + '" y="' + (H - 8) +
                 '" class="stats-axis" text-anchor="middle">' + rows[i].d.slice(5) + '</text>');
    });

    parts.push('</svg>');
    parts.push('<div class="stats-legend">' +
      '<span><i class="stats-swatch"></i>访客数（按天）</span>' +
      '</div>');
    host.innerHTML = parts.join('');
  }

  // ------------------------------------------------------------ 条形图
  function renderBars(list, world) {
    var host = document.getElementById('stats-bars');
    if (!host) return;
    if (!list.length) { host.innerHTML = '<li class="stats-none">暂无数据</li>'; return; }

    var top = list.slice(0, 12);
    var max = top[0].v || 1;
    var sum = list.reduce(function (a, b) { return a + b.v; }, 0) || 1;

    host.innerHTML = top.map(function (c) {
      var pct = (c.v / sum) * 100;
      var w = Math.max(2, (c.v / max) * 100);
      var name = NAME_FALLBACK[c.c] || (world && world.countries[c.c] && world.countries[c.c].n) || c.n;
      var cc = FLAG_OVERRIDE[c.c] || c.c;
      return '<li class="stats-bar">' +
        '<span class="stats-bar-name">' + flag(cc) + ' ' + esc(name) + '</span>' +
        '<span class="stats-bar-track"><span class="stats-bar-fill" style="width:' +
          w.toFixed(1) + '%"></span></span>' +
        '<span class="stats-bar-num">' + fmt(c.v) + ' · ' + pct.toFixed(pct < 10 ? 1 : 0) + '%</span>' +
        '</li>';
    }).join('');
  }

  // ------------------------------------------------------------ 地图
  function renderMap(world, list) {
    var host = document.getElementById('stats-map');
    if (!host) return;

    var byCode = {};
    list.forEach(function (c) { byCode[c.c.toUpperCase()] = c.v; });
    var counts = list.map(function (c) { return c.v; }).sort(function (a, b) { return b - a; });
    if (!counts.length) { host.innerHTML = '<p class="stats-none">暂无数据</p>'; return; }

    // 分档：按排序取位次，避免少数几个大值把其余全压成最低档
    var lv = function (v) {
      if (!v) return 0;
      var i = counts.indexOf(v);
      var q = counts.length <= 1 ? 0 : i / (counts.length - 1);
      if (q < 0.08) return 5;
      if (q < 0.2) return 4;
      if (q < 0.4) return 3;
      if (q < 0.65) return 2;
      return 1;
    };

    if (!world) { host.innerHTML = '<p class="stats-none">地图数据加载失败</p>'; return; }
    (function () {
        var svg = ['<svg viewBox="0 0 ' + world.w + ' ' + world.h + '" class="stats-svg stats-world">'];
        Object.keys(world.countries).forEach(function (code) {
          var c = world.countries[code];
          var v = byCode[code] || 0;
          svg.push('<path d="' + c.d + '" data-lv="' + lv(v) + '"' +
                   (v ? ' data-v="' + v + '"' : '') + '><title>' +
                   esc(c.n) + (v ? ' · ' + fmt(v) : '') + '</title></path>');
        });
        svg.push('</svg>');
        host.innerHTML = svg.join('');
    })();
  }

  // ------------------------------------------------------------ 工具
  // 地图用的 110m 数据里没有的一些小地方（新加坡太小、港澳台在该分辨率下
  // 不单独成块），补一份名字，免得条形图里中英文混排。
  var NAME_FALLBACK = {
    SG: '新加坡',
    HK: '中国香港', MO: '中国澳门', TW: '中国台湾',
    MT: '马耳他', LU: '卢森堡', BH: '巴林', MU: '毛里求斯'
  };

  // 上面这几个的国旗也统一用五星红旗，免得「中国台湾 🇹🇼」这种自相矛盾的组合
  var FLAG_OVERRIDE = { HK: 'CN', MO: 'CN', TW: 'CN' };

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ISO 3166-1 alpha-2 -> 国旗 emoji（两个区域指示符）
  function flag(code) {
    if (!code || code.length !== 2) return '';
    var base = 0x1F1E6;
    return String.fromCodePoint(
      base + code.toUpperCase().charCodeAt(0) - 65,
      base + code.toUpperCase().charCodeAt(1) - 65
    );
  }
})();
