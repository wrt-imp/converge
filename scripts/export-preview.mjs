/* global URL, document, window, location, requestAnimationFrame, performance, setInterval, clearInterval, console, process, Buffer */
import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import http from 'node:http';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildRoot = path.join(siteRoot, 'build');
const output = path.join(siteRoot, 'preview', 'index.html');
// Reuse Docusaurus's own HTML parser; this exporter adds no dependencies.
const require = createRequire(import.meta.url);
const coreRequire = createRequire(require.resolve('@docusaurus/core/package.json'));
const {load} = coreRequire('cheerio');
const origin = 'https://converge.example.com';
const mime = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'};

async function dataAsset(source) {
  if (/^(data:|#)/i.test(source)) return source;
  const url = new URL(source, origin);
  if (url.origin !== origin) throw new Error(`External resource must be embedded: ${source}`);
  const filename = path.resolve(buildRoot, '.' + decodeURIComponent(url.pathname));
  if (!filename.startsWith(buildRoot + path.sep)) throw new Error('Invalid asset path');
  const data = await readFile(filename);
  return `data:${mime[path.extname(filename)] ?? 'application/octet-stream'};base64,${data.toString('base64')}`;
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (entry.isDirectory() && !['assets', 'preview'].includes(entry.name)) files.push(...await htmlFiles(path.join(directory, entry.name)));
    else if (entry.isFile() && entry.name === 'index.html') files.push(path.join(directory, entry.name));
  }
  return files;
}

function internalHref(href, route) {
  if (!href || /^(mailto:|tel:|data:)/i.test(href)) return href;
  const url = new URL(href, origin + route);
  if (url.origin !== origin) return href;
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  return '#' + pathname + url.hash;
}

const home = load(await readFile(path.join(buildRoot, 'index.html'), 'utf8'));
let css = '';
for (const link of home('link[rel="stylesheet"]').toArray()) {
  const cssPath = home(link).attr('href');
  const absolute = path.resolve(buildRoot, '.' + cssPath);
  let content = await readFile(absolute, 'utf8');
  for (const match of [...content.matchAll(/url\((['"]?)(.*?)\1\)/g)]) {
    if (/^(data:|#)/i.test(match[2])) continue;
    const resource = new URL(match[2], origin + cssPath).href;
    content = content.replaceAll(match[0], `url("${await dataAsset(resource)}")`);
  }
  css += content + '\n';
}

const pages = {};
for (const filename of await htmlFiles(buildRoot)) {
  const route = '/' + path.relative(buildRoot, path.dirname(filename)).split(path.sep).filter(Boolean).join('/');
  const q = load(await readFile(filename, 'utf8'));
  q('script,link[rel="preload"],link[rel="modulepreload"]').remove();
  q('a[href]').each((_, element) => q(element).attr('href', internalHref(q(element).attr('href'), route)));
  for (const image of q('img[src],source[src],video[poster]').toArray()) {
    const attribute = image.name === 'video' ? 'poster' : 'src';
    q(image).attr(attribute, await dataAsset(q(image).attr(attribute)));
  }
  for (const image of q('[srcset]').toArray()) {
    const candidates = q(image).attr('srcset').split(',').map(value => value.trim().split(/\s+/));
    q(image).attr('srcset', (await Promise.all(candidates.map(async ([src, size]) => `${await dataAsset(src)}${size ? ' ' + size : ''}`))).join(', '));
  }
  q('.navbar__toggle').attr('data-preview-menu', '').attr('aria-expanded', 'false');
  q('button[aria-label*="切换浅色"]').attr('data-preview-theme', '').removeAttr('disabled');
  const mobileLinks = q('.navbar__link[href]').toArray().map(element => q.html(element)).join('');
  q('.navbar').after(`<nav class="preview-mobile-menu" aria-label="导航">${mobileLinks}</nav>`);
  q('.navbar-sidebar').remove();
  // Offline export deliberately does not reimplement the React workspace in vanilla JS.
  const workspace = q('[data-online-workspace]');
  if (workspace.length) {
    workspace.prepend('<p role="note" style="padding:16px;border:1px solid #75618f;color:#e3d7f2;background:#242031">此处是工作台的离线外观预览，表单不可操作。请运行 React 官网（npm start）使用本地草稿与文件预览；在线问答和上传仍待后端接入。</p>');
    workspace.find('button,input,textarea').attr('disabled', 'disabled');
  }
  const carousel = q('#mechanism-demo');
  carousel.find('[aria-roledescription="幻灯片"]').each((index, element) => q(element).attr('data-preview-slide', index));
  carousel.find('button[aria-label^="查看阶段"]').each((index, element) => q(element).attr('data-preview-stage', index));
  for (const [label, action] of [['上一幕', 'previous'], ['下一幕', 'next'], ['暂停演示', 'toggle'], ['继续演示', 'toggle'], ['从第一幕重新播放', 'replay']]) {
    carousel.find(`button[aria-label="${label}"]`).attr('data-preview-action', action);
  }
  pages[route] = {title: q('title').text(), className: q('html').attr('class') || '', html: q('#__docusaurus').html()};
  if (!pages[route].html) throw new Error(`Missing rendered page: ${route}`);
}

const classFor = prefix => {
  const match = css.match(new RegExp('\\.(' + prefix + '_[a-zA-Z0-9_-]+)'));
  if (!match) throw new Error(`Missing carousel style: ${prefix}`);
  return match[1];
};
const classes = {active: classFor('storyPageActive'), leaving: classFor('storyPageLeaving'), progress: classFor('progressStepActive')};

function previewRuntime() {
  const payload = JSON.parse(document.getElementById('preview-pages').textContent);
  const root = document.getElementById('__docusaurus');
  let currentRoute = '';
  let dispose = () => {};
  function mountCarousel() {
    const scene = document.getElementById('mechanism-demo');
    if (!scene) return () => {};
    const slides = [...scene.querySelectorAll('[data-preview-slide]')];
    const stages = [...scene.querySelectorAll('[data-preview-stage]')];
    const toggle = scene.querySelector('[data-preview-action="toggle"]');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0;
    let previous = null;
    let elapsed = 0;
    let playing = !preference.matches;
    let direction = 'forward';
    function render() {
      scene.dataset.direction = direction;
      slides.forEach((slide, index) => {
        slide.classList.toggle(payload.classes.active, index === active);
        slide.classList.toggle(payload.classes.leaving, index === previous && index !== active);
        slide.setAttribute('aria-hidden', String(index !== active));
      });
      stages.forEach((button, index) => {
        button.classList.toggle(payload.classes.progress, index === active);
        if (index === active) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
        button.querySelector('i b').style.transform = `scaleX(${index < active ? 1 : index === active ? elapsed / 5000 : 0})`;
      });
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.setAttribute('aria-label', playing ? '暂停演示' : '继续演示');
      toggle.innerHTML = playing ? '暂停 <span aria-hidden="true">Ⅱ</span>' : '播放 <span aria-hidden="true">▶</span>';
      const announcement = scene.querySelector('[aria-live="polite"]');
      if (announcement) announcement.textContent = playing ? '' : `演示已暂停，第 ${active + 1} 幕，共 ${slides.length} 幕`;
    }
    function go(index, nextDirection) {
      previous = active;
      active = (index + slides.length) % slides.length;
      elapsed = 0;
      direction = nextDirection || (active > previous ? 'forward' : 'backward');
      render();
    }
    scene.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-preview-stage')) go(Number(button.dataset.previewStage));
      switch (button.dataset.previewAction) {
        case 'previous': go(active - 1, 'backward'); break;
        case 'next': go(active + 1, 'forward'); break;
        case 'toggle': playing = !playing; render(); break;
        case 'replay': playing = true; go(0, 'forward'); break;
      }
    });
    scene.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      go(active + (event.key === 'ArrowRight' ? 1 : -1), event.key === 'ArrowRight' ? 'forward' : 'backward');
    });
    let lastTick = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - lastTick, 250);
      lastTick = now;
      if (!playing || document.hidden) return;
      elapsed += delta;
      if (elapsed >= 5000) go(active + 1, 'forward');
      else render();
    }, 50);
    render();
    return () => clearInterval(timer);
  }
  function route() {
    const fragment = location.hash.slice(1) || '/';
    const separator = fragment.indexOf('#');
    const pathname = (separator < 0 ? fragment : fragment.slice(0, separator)).replace(/\/$/, '') || '/';
    const anchor = separator < 0 ? '' : decodeURIComponent(fragment.slice(separator + 1));
    if (!payload.pages[pathname]) { location.hash = '/'; return; }
    if (pathname !== currentRoute) {
      dispose();
      const page = payload.pages[pathname];
      root.innerHTML = page.html;
      document.title = page.title;
      document.documentElement.className = page.className;
      document.documentElement.dataset.hasHydrated = 'true';
      document.documentElement.removeAttribute('data-preview-menu');
      currentRoute = pathname;
      dispose = mountCarousel();
    }
    requestAnimationFrame(() => {
      const target = anchor && document.getElementById(anchor);
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    });
  }
  document.addEventListener('click', event => {
    const menu = event.target.closest('[data-preview-menu]');
    if (menu) {
      const open = document.documentElement.dataset.previewMenu !== 'open';
      document.documentElement.dataset.previewMenu = open ? 'open' : '';
      menu.setAttribute('aria-expanded', String(open));
    }
    const theme = event.target.closest('[data-preview-theme]');
    if (theme) document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const sublist = event.target.closest('.menu__link--sublist,button[aria-label*="展开"],button[aria-label*="折叠"]');
    if (sublist && sublist.closest('.menu__list-item')) {
      sublist.closest('.menu__list-item').classList.toggle('menu__list-item--collapsed');
    }
    const link = event.target.closest('a[href^="#/"]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      document.documentElement.removeAttribute('data-preview-menu');
      const destination = link.getAttribute('href');
      if (location.hash === destination) route();
      else location.hash = destination;
    }
  });
  window.addEventListener('hashchange', route);
  route();
}

const json = JSON.stringify({pages, classes}).replaceAll('<', '\\u003c');
const offlineCss = `.preview-mobile-menu{display:none}html[data-theme='light']{color-scheme:light}button[data-preview-theme]{visibility:visible!important} @media(max-width:996px){html[data-preview-menu='open'] .preview-mobile-menu{display:flex;position:fixed;inset:var(--ifm-navbar-height) 0 auto;z-index:999;flex-direction:column;gap:14px;padding:24px;background:var(--paper);border-bottom:1px solid var(--border-subtle)}.preview-mobile-menu a{display:block!important}}`;
const html = `<!doctype html>\n<html lang="zh-CN" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Converge 官网预览</title><style>${css.replaceAll('</style', '<\\/style')}${offlineCss}</style></head><body><div id="__docusaurus"></div><script id="preview-pages" type="application/json">${json}</script><script>(${previewRuntime.toString()})();</script></body></html>`;
await mkdir(path.dirname(output), {recursive: true});
await writeFile(output, html, 'utf8');
console.log(`Exported ${Object.keys(pages).length} pages into ${output} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);

if (process.argv.includes('--serve')) {
  http.createServer((request, response) => {
    if (!['/', '/index.html'].includes(request.url?.split('?')[0])) { response.writeHead(404).end(); return; }
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(html);
  }).listen(3002, '127.0.0.1', () => console.log('Standalone preview: http://127.0.0.1:3002/'));
}
