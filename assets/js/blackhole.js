/**
 * 全页黑洞背景
 *
 * 做法：一个铺满屏幕的三角形 + fragment shader，逐像素反向积分光线在
 * 史瓦西时空中的零测地线（引力透镜），穿过赤道面时采样吸积盘。
 * 光子环、爱因斯坦环、盘面的上下两次成像都是积分自然产生的，不是画上去的。
 *
 * 三条硬性约束：
 *   1. 渲染分辨率低于显示分辨率（逐像素 ray marching 太贵），CSS 拉伸回去
 *   2. 页面不可见时停止渲染
 *   3. 帧时间过长时自动降分辨率，一路降到关掉
 */

import * as THREE from './lib/three.module.min.js';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uRes;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uLight;
  uniform vec3  uBg;
  uniform vec2  uCenter;
  uniform vec2  uSpread;

  #define STEPS 150
  #define RS 1.0            // 史瓦西半径（几何单位）

  const float DISK_IN  = 2.4;   // 吸积盘内缘，约 ISCO
  const float DISK_OUT = 9.5;

  // ---------------------------------------------------------------- 噪声
  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash13(i);
    float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * vnoise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return s;
  }

  // ---------------------------------------------------------------- 星空
  vec3 stars(vec3 dir) {
    vec3 col = vec3(0.0);
    for (int i = 0; i < 3; i++) {
      float sc = 90.0 * pow(2.2, float(i));
      vec3 p = dir * sc;
      vec3 id = floor(p);
      vec3 f  = fract(p) - 0.5;
      float h = hash13(id + float(i) * 23.7);
      if (h > 0.955) {
        float b = smoothstep(0.26, 0.0, length(f)) * (h - 0.955) / 0.045;
        vec3 tint = mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.86, 0.68), hash13(id + 5.1));
        col += b * tint;
      }
    }
    // 很淡的星云，避免太空太"空"
    float n = fbm(dir * 2.6 + 11.0);
    col += vec3(0.16, 0.19, 0.34) * pow(n, 3.0) * 0.55;
    col += vec3(0.20, 0.13, 0.26) * pow(fbm(dir * 1.3 - 4.0), 4.0) * 0.5;
    return col;
  }

  // ------------------------------------------------- 吸积盘：温度 -> 颜色
  vec3 diskColor(float r, float density, float doppler) {
    float t = clamp((r - DISK_IN) / (DISK_OUT - DISK_IN), 0.0, 1.0);
    // 内热外冷：白蓝 -> 金 -> 深橙
    vec3 hot   = vec3(1.00, 0.96, 0.90);
    vec3 mid   = vec3(1.00, 0.62, 0.22);
    vec3 cool  = vec3(0.62, 0.16, 0.05);
    vec3 col = mix(hot, mid, smoothstep(0.0, 0.42, t));
    col = mix(col, cool, smoothstep(0.42, 1.0, t));
    // 多普勒增亮：迎向观察者的一侧更亮更蓝
    float boost = pow(clamp(doppler, 0.0, 2.0), 2.6);
    col *= 0.50 + 1.5 * boost;
    col = mix(col, col * vec3(0.82, 0.90, 1.15), clamp(boost - 0.5, 0.0, 1.0));
    return col * density;
  }

  void main() {
    // 像素 -> 视线方向（带一点透视张角）
    vec2 p = (vUv - uCenter);
    p.x *= uRes.x / uRes.y;
    p /= uSpread;

    vec3 ro = vec3(0.0, 0.55, 20.0);          // 相机略高于赤道面，退远到黑洞在画面中占比合适
    vec3 fwd = normalize(vec3(0.0, 0.0, 0.0) - ro);
    vec3 rgt = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
    vec3 up  = cross(fwd, rgt);
    vec3 rd  = normalize(fwd + rgt * p.x + up * p.y);

    vec3 pos = ro;
    vec3 dir = rd;
    float h2 = dot(cross(pos, dir), cross(pos, dir));   // 角动量平方，守恒

    vec3  disk = vec3(0.0);
    float captured = 0.0;
    float prevY = pos.y;

    for (int i = 0; i < STEPS; i++) {
      float r2 = dot(pos, pos);
      float r  = sqrt(r2);

      if (r < RS) { captured = 1.0; break; }              // 落入视界
      if (r > 62.0 && dot(pos, dir) > 0.0) break;         // 逃逸（再远处偏折可忽略）

      // 靠近黑洞时步长收紧，保证光子环附近的分辨率
      float dt = clamp(r * 0.10, 0.02, 1.6);

      vec3 prev = pos;
      vec3 acc  = -1.5 * h2 * pos / (r2 * r2 * r);        // 史瓦西零测地线
      dir += acc * dt;
      pos += dir * dt;

      // 穿过赤道面 -> 采样吸积盘（可多次，形成上下两次成像）
      if (prevY * pos.y < 0.0) {
        float k = prevY / (prevY - pos.y);
        vec3 hit = mix(prev, pos, k);
        float rr = length(hit.xz);
        if (rr > DISK_IN && rr < DISK_OUT) {
          // 开普勒转动 + 噪声纹理
          float ang = atan(hit.z, hit.x);
          float omega = 1.6 / pow(rr, 1.5);
          float phase = ang * 3.0 - omega * uTime * 6.0;
          float tex = fbm(vec3(cos(phase), sin(phase), rr * 1.1) * 1.7);
          float edge = smoothstep(DISK_IN, DISK_IN + 0.7, rr)
                     * (1.0 - smoothstep(DISK_OUT - 3.2, DISK_OUT, rr));
          float density = tex * tex * 2.6 * edge;

          // 多普勒：转动速度与视线方向的夹角
          vec3 vel = normalize(vec3(-hit.z, 0.0, hit.x));  // 逆时针
          float doppler = 1.0 - dot(vel, normalize(dir)) * 0.62;

          disk += diskColor(rr, density, doppler);
        }
      }
      prevY = pos.y;
    }

    // 光子环外侧的辉光（在着色器里做，省一遍 bloom）。
    // 用冲击参数（光线到黑洞的最近距离）而不是固定步长处的半径，
    // 这样换相机距离不用重调。
    float tc = max(-dot(ro, rd), 0.0);
    float b  = length(ro + rd * tc);
    float glow = 0.05 / (0.08 + pow(max(b - 3.4, 0.0), 1.9));

    // 分开处理三类贡献，亮色模式下要区别对待：
    //   sky  逃逸光线看到的星空（亮色模式下必须丢掉，否则整页发灰）
    //   emis 吸积盘 + 光子环辉光（自发光，两种模式都保留）
    //   shadow 视界（1 = 被吞）
    vec3  sky    = captured > 0.5 ? vec3(0.0) : stars(normalize(dir)) + vec3(0.004, 0.005, 0.010);
    vec3  emis   = disk * 0.52 + vec3(1.0, 0.72, 0.42) * glow * 0.26;

    // 视界用冲击参数做软边：captured 是硬 0/1，直接拿去做阴影边界会有
    // 锯齿，而我们又是低分辨率渲染再放大，硬边会被放得很明显。
    // 临界冲击参数 b_crit ≈ 2.598 RS。
    float shadow = 1.0 - smoothstep(2.50, 2.80, b);

    vec3 skyT  = pow(sky  / (1.0 + sky),  vec3(0.4545));
    vec3 emisT = pow(emis / (1.0 + emis), vec3(0.4545));

    vec3 outc;
    if (uLight > 0.5) {
      // ── 亮色：粉白配色 ──
      // 关键：白底本身已经接近 1.0，任何"加光"都会立刻饱和成纯白
      // （上一版就是这么变成一片白的：光子环辉光在视界中心也最强，
      //  乘 1.45 直接顶到 255）。所以这里全程做减法——把白底"染"成粉，
      // 越该亮的地方染得越饱和：
      //   视界 -> 浅玫瑰灰的实心圆
      //   盘面 -> 按亮度从浅粉渐到玫红
      // lDisk 只取吸积盘、不含辉光，否则辉光会把视界内部也染粉。
      vec3  diskT   = pow(disk * 0.52 / (1.0 + disk * 0.52), vec3(0.4545));
      float lDisk   = dot(diskT, vec3(0.299, 0.587, 0.114));

      vec3  roseSoft = vec3(0.905, 0.730, 0.815);   // 浅玫瑰
      vec3  roseDeep = vec3(0.870, 0.480, 0.640);   // 玫红
      vec3  tint     = mix(roseSoft, roseDeep, smoothstep(0.10, 0.90, lDisk));

      outc  = mix(uBg, roseSoft, shadow * uIntensity * 0.62);      // 视界
      outc  = mix(outc, tint, pow(lDisk, 0.60) * uIntensity * 0.92); // 盘面压在上面
    } else {
      outc = mix(uBg, skyT * (1.0 - shadow) + emisT, uIntensity);
    }

    gl_FragColor = vec4(outc, 1.0);
  }
`;

function themeBackground() {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;';
  document.body.appendChild(probe);
  let bg = getComputedStyle(document.body).backgroundColor;
  if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
    bg = getComputedStyle(document.documentElement).backgroundColor;
  }
  probe.remove();
  const m = bg.match(/[\d.]+/g);
  if (!m || m.length < 3) return new THREE.Color(0x1b1b1e);
  const a = m.length > 3 ? parseFloat(m[3]) : 1;
  if (a === 0) return new THREE.Color(0x1b1b1e);
  return new THREE.Color(
    parseInt(m[0], 10) / 255,
    parseInt(m[1], 10) / 255,
    parseInt(m[2], 10) / 255,
  );
}

function isDark() {
  // Chirpy 7.6 起把配色开关从自定义的 data-mode 换成了 Bootstrap 的
  // data-bs-theme（theme.min.js 只写后者），7.5 及更早才是 data-mode。
  // 只认其中一个的话，在另一个版本上这里会一直退回「跟随系统」，
  // 于是站点切了深色而黑洞还按浅色渲染——深色页配一片粉白亮盘。
  const el = document.documentElement;
  const mode = el.getAttribute('data-bs-theme') || el.getAttribute('data-mode');
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function init() {
  const canvas = document.getElementById('blackhole-canvas');
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
    });
  } catch (err) {
    canvas.remove(); // 没有 WebGL 就退回主题默认背景
    return;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 900px)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uRes:       { value: new THREE.Vector2(1, 1) },
    uTime:      { value: 0 },
    uIntensity: { value: isDark() ? 0.34 : 0.88 },
    uLight:     { value: isDark() ? 0.0 : 1.0 },
    uBg:        { value: themeBackground() },
    // 注意：vUv 的原点在左下角，y 越大越靠上。x/y 由 syncCenter() 计算
    uCenter:    { value: new THREE.Vector2(0.5, 0.5) },
    // spread 越小视场越宽、黑洞看着越小。窄屏需要更大视场才装得下盘面。
    uSpread:    { value: new THREE.Vector2(small ? 0.95 : 1.9, small ? 0.95 : 1.9) },
  };

  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false }),
  );
  quad.frustumCulled = false;
  scene.add(quad);

  let scale = small ? 0.34 : 0.55;
  const baseScale = scale;
  let w = 0, h = 0;

  // 黑洞居中于「除侧边栏以外的界面」：左右取侧边栏右缘到视口右缘的中点。
  // 不写死断点——直接量侧边栏实际占位，窄屏时它被移出视口左侧，占位自然为 0。
  function syncCenter() {
    let occupied = 0;
    const sb = document.getElementById('sidebar');
    if (sb) {
      const r = sb.getBoundingClientRect();
      occupied = Math.max(0, Math.min(r.right, window.innerWidth));
    }
    uniforms.uCenter.value.set(
      (occupied + window.innerWidth) / 2 / window.innerWidth,
      0.5,   // 竖直居中（vUv 的 y 关于中线对称，0.5 即屏幕中心）
    );
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const rw = Math.max(2, Math.round(w * scale));
    const rh = Math.max(2, Math.round(h * scale));
    renderer.setSize(rw, rh, false);        // false: 不改 CSS 尺寸，由样式表拉伸
    uniforms.uRes.value.set(rw, rh);
    syncCenter();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function syncTheme() {
    uniforms.uIntensity.value = isDark() ? 0.34 : 0.88;
    uniforms.uLight.value = isDark() ? 0.0 : 1.0;
    uniforms.uBg.value.copy(themeBackground());
  }
  new MutationObserver(syncTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-bs-theme', 'data-mode', 'class', 'style'],
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTheme);

  // 降分辨率保护：连续掉帧就缩，只降不升，避免来回抖
  let last = performance.now();
  let slow = 0, fast = 0;

  function frame(now) {
    const dt = now - last;
    last = now;
    uniforms.uTime.value += Math.min(dt, 50) / 1000;
    renderer.render(scene, camera);

    if (dt > 42) { slow++; fast = 0; } else if (dt < 19) { fast++; slow = 0; }

    if (slow > 45 && scale > 0.24) {
      scale = Math.max(0.24, scale * 0.78);
      slow = 0;
      resize();
    } else if (fast > 260 && scale < baseScale) {
      scale = Math.min(baseScale, scale * 1.12);
      fast = 0;
      resize();
    }
    raf = requestAnimationFrame(frame);
  }

  let raf = 0;
  let running = false;

  function start() {
    if (running || reduced) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
    canvas.remove();
  });

  if (reduced) {
    uniforms.uTime.value = 12.0;   // 静态一帧，不做动画
    renderer.render(scene, camera);
  } else {
    start();
  }
  canvas.classList.add('is-ready');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
