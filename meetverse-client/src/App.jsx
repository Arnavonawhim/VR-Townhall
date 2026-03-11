import { useState, useEffect } from "react";

const API_BASE = "https://ai-avatar-backend-sti8.onrender.com/api/v1";

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --black: #0a0a0a;
  --off-black: #111111;
  --card: #161616;
  --border: #242424;
  --mid: #2e2e2e;
  --muted: #555;
  --dim: #888;
  --white: #f5f5f0;
  --off-white: #e8e8e2;
  --accent: #d4522a;
  --accent-dim: rgba(212,82,42,0.12);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Instrument Sans', sans-serif;
  background: var(--black);
  color: var(--white);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--black); }
::-webkit-scrollbar-thumb { background: var(--border); }

/* NAV */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 60px;
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem; letter-spacing: 0.04em;
  color: var(--white); cursor: pointer;
}
.nav-logo span { color: var(--accent); }
.nav-center { display: flex; gap: 2.5rem; }
.nav-link {
  font-size: 0.78rem; color: var(--dim); cursor: pointer;
  letter-spacing: 0.08em; text-transform: uppercase;
  background: none; border: none;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 500; transition: color 0.15s; padding: 0;
}
.nav-link:hover { color: var(--white); }
.nav-actions { display: flex; gap: 10px; align-items: center; }
.nav-btn {
  padding: 7px 18px; font-size: 0.75rem; letter-spacing: 0.07em;
  text-transform: uppercase; font-family: 'Instrument Sans', sans-serif;
  font-weight: 600; cursor: pointer; transition: all 0.15s; border-radius: 3px;
}
.nav-ghost { background: transparent; color: var(--white); border: 1px solid var(--border); }
.nav-ghost:hover { border-color: var(--mid); }
.nav-solid { background: var(--white); color: var(--black); border: 1px solid var(--white); }
.nav-solid:hover { background: var(--off-white); }

/* HERO */
.hero {
  padding: 140px 48px 0;
  min-height: 100vh;
  display: flex; flex-direction: column;
  border-bottom: 1px solid var(--border);
}
.hero-eyebrow {
  display: flex; align-items: center; gap: 20px; margin-bottom: 48px;
}
.hero-tag {
  font-size: 0.7rem; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--dim); font-weight: 500;
}
.hero-tag-accent { color: var(--accent); }
.rule-h { width: 40px; height: 1px; background: var(--border); }

.hero-body {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: start; padding-bottom: 80px; flex: 1;
}
.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(72px, 9vw, 136px);
  line-height: 0.9; letter-spacing: 0.01em;
  color: var(--white); margin-bottom: 32px;
}
.hero-title .t-accent { color: var(--accent); }
.hero-title .t-italic {
  font-family: 'Instrument Serif', serif;
  font-style: italic; font-size: 0.88em; color: var(--off-white);
}
.hero-desc {
  font-size: 1rem; color: var(--dim); line-height: 1.8;
  max-width: 400px; margin-bottom: 44px;
}
.hero-ctas { display: flex; gap: 12px; align-items: center; }
.btn-primary {
  padding: 12px 26px; background: var(--accent); color: var(--white);
  font-family: 'Instrument Sans', sans-serif; font-weight: 600;
  font-size: 0.78rem; letter-spacing: 0.07em; text-transform: uppercase;
  border: none; cursor: pointer; border-radius: 3px; transition: background 0.15s;
}
.btn-primary:hover { background: #bf4924; }
.btn-ghost-text {
  background: none; border: none; color: var(--dim); cursor: pointer;
  font-family: 'Instrument Sans', sans-serif; font-size: 0.78rem;
  letter-spacing: 0.07em; text-transform: uppercase; font-weight: 500;
  display: flex; align-items: center; gap: 7px; transition: color 0.15s;
}
.btn-ghost-text:hover { color: var(--white); }
.arrow { transition: transform 0.2s; }
.btn-ghost-text:hover .arrow { transform: translateX(4px); }

/* Hero right panel */
.hero-right { padding-top: 4px; display: flex; flex-direction: column; gap: 14px; }
.hero-vis {
  border: 1px solid var(--border); border-radius: 4px;
  aspect-ratio: 16/10; background: var(--card);
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.vis-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 44px 44px; opacity: 0.5;
}
.vis-ring {
  width: 160px; height: 160px; border-radius: 50%;
  border: 1px solid var(--mid); position: relative; z-index: 1;
  animation: vspin 18s linear infinite;
  display: flex; align-items: center; justify-content: center;
}
.vis-ring::before {
  content: ''; position: absolute; inset: 24px; border-radius: 50%;
  border: 1px dashed var(--muted); opacity: 0.4;
  animation: vspin 10s linear infinite reverse;
}
.vis-ring::after {
  content: ''; position: absolute; inset: 56px; border-radius: 50%;
  background: transparent;
}
.vis-dot {
  position: absolute; width: 5px; height: 5px;
  border-radius: 50%; background: var(--accent); z-index: 2;
}
.vd1 { top: 16px; left: 50%; }
.vd2 { bottom: 24px; right: 28%; }
.vd3 { left: 20px; top: 44%; }
@keyframes vspin { to { transform: rotate(360deg); } }
.vis-label {
  position: absolute; bottom: 14px; left: 16px;
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted);
}
.vis-label span { color: var(--accent); }

.hero-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--border); border-radius: 4px; overflow: hidden;
}
.h-stat { padding: 18px 20px; border-right: 1px solid var(--border); }
.h-stat:last-child { border-right: none; }
.h-stat-num {
  font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem;
  color: var(--white); letter-spacing: 0.04em; line-height: 1;
}
.h-stat-num .a { color: var(--accent); }
.h-stat-lbl {
  font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--muted); margin-top: 4px; line-height: 1.4;
}

/* MARQUEE */
.marquee-wrap {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 13px 0; overflow: hidden; background: var(--off-black);
}
.marquee-inner {
  display: flex; gap: 56px; width: max-content;
  animation: mq 28s linear infinite;
}
.mq-item {
  font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); white-space: nowrap;
  display: flex; align-items: center; gap: 56px;
}
.mq-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }
@keyframes mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* SECTION */
.section { padding: 96px 48px; border-bottom: 1px solid var(--border); }
.sec-header {
  display: grid; grid-template-columns: 260px 1fr;
  gap: 48px; margin-bottom: 64px; align-items: start;
}
.sec-lbl {
  font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--dim); padding-top: 6px; font-weight: 500;
}
.sec-num {
  font-family: 'Bebas Neue', sans-serif; font-size: 0.85rem;
  color: var(--accent); letter-spacing: 0.1em; margin-bottom: 6px;
}
.sec-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(40px, 5vw, 68px);
  line-height: 0.93; letter-spacing: 0.02em; color: var(--white); margin-bottom: 14px;
}
.sec-title .ital { font-family: 'Instrument Serif', serif; font-style: italic; color: var(--off-white); }
.sec-sub { font-size: 0.875rem; color: var(--dim); line-height: 1.75; max-width: 460px; }

/* HOW IT WORKS */
.how-list { display: flex; flex-direction: column; }
.how-item {
  display: grid; grid-template-columns: 80px 1fr 160px;
  gap: 32px; align-items: center;
  padding: 26px 0; border-bottom: 1px solid var(--border);
  transition: padding-left 0.2s; cursor: default;
  border-left: 2px solid transparent;
}
.how-item:first-child { border-top: 1px solid var(--border); }
.how-item:hover { border-left-color: var(--accent); padding-left: 16px; }
.how-n {
  font-family: 'Bebas Neue', sans-serif; font-size: 1.7rem;
  color: var(--border); letter-spacing: 0.04em;
}
.how-title { font-size: 1rem; font-weight: 600; color: var(--white); margin-bottom: 5px; }
.how-desc { font-size: 0.85rem; color: var(--dim); line-height: 1.65; max-width: 500px; }
.how-tag {
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); white-space: nowrap; text-align: right; font-weight: 500;
}

/* STICKY NOTES */
.sticky-section { padding: 96px 48px; border-bottom: 1px solid var(--border); }
.sticky-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 0;
}
.sticky {
  padding: 28px 26px 24px;
  border-radius: 2px;
  position: relative;
  cursor: default;
  min-height: 210px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.sticky-1 { background: #e8d87a; color: #1a1700; transform: rotate(-1.2deg); }
.sticky-2 { background: #f0b97d; color: #1e0e00; transform: rotate(0.8deg); }
.sticky-3 { background: #a8d8a8; color: #051a05; transform: rotate(-0.5deg); }
.sticky-4 { background: #b8d4f0; color: #040e1a; transform: rotate(1deg); }
.sticky-5 { background: #e8c4d8; color: #1a0510; transform: rotate(-0.7deg); }
.sticky-6 { background: #d4c8f0; color: #0a0519; transform: rotate(0.4deg); }
.sticky::before {
  content: '';
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 40px; height: 6px; border-radius: 0 0 3px 3px;
  background: rgba(0,0,0,0.15);
}
.sticky-cat {
  font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase;
  font-weight: 700; opacity: 0.5; margin-bottom: 10px;
  font-family: 'Instrument Sans', sans-serif;
}
.sticky-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem; letter-spacing: 0.02em;
  line-height: 1; margin-bottom: 10px; opacity: 0.9;
}
.sticky-desc {
  font-size: 0.82rem; line-height: 1.6; opacity: 0.7;
  font-family: 'Instrument Sans', sans-serif; flex: 1;
}
.sticky-pills { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 14px; }
.sticky-pill {
  padding: 3px 7px; border-radius: 2px;
  font-size: 0.6rem; letter-spacing: 0.07em; text-transform: uppercase;
  font-weight: 600; background: rgba(0,0,0,0.1);
  font-family: 'Instrument Sans', sans-serif;
}

/* ROLES */
.roles-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--border); border-radius: 4px; overflow: hidden;
}
.role-cell { padding: 40px; border-right: 1px solid var(--border); }
.role-cell:last-child { border-right: none; }
.role-marker { width: 8px; height: 8px; border-radius: 50%; margin-bottom: 28px; }
.rm-accent { background: var(--accent); }
.rm-white  { background: var(--white); }
.rm-mid    { background: var(--mid); }
.role-lbl {
  font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--dim); margin-bottom: 8px; font-weight: 500;
}
.role-title {
  font-family: 'Bebas Neue', sans-serif; font-size: 1.9rem;
  letter-spacing: 0.02em; color: var(--white);
  margin-bottom: 14px; line-height: 1;
}
.role-desc { font-size: 0.85rem; color: var(--dim); line-height: 1.7; margin-bottom: 28px; }
.role-perks { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.role-perks li {
  font-size: 0.8rem; color: var(--muted);
  display: flex; gap: 10px; align-items: flex-start; line-height: 1.5;
}
.perk-dash { color: var(--accent); flex-shrink: 0; }

/* CTA */
.cta-block {
  padding: 100px 48px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: center;
  border-bottom: 1px solid var(--border);
}
.cta-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(52px, 6.5vw, 100px);
  line-height: 0.9; letter-spacing: 0.02em; color: var(--white);
}
.cta-title .ca { color: var(--accent); }
.cta-right { display: flex; flex-direction: column; gap: 24px; }
.cta-desc { font-size: 0.95rem; color: var(--dim); line-height: 1.8; }
.cta-actions { display: flex; gap: 12px; align-items: center; }

/* FOOTER */
.footer {
  padding: 28px 48px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
}
.footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.06em; color: var(--muted); }
.footer-logo span { color: var(--accent); }
.footer-copy { font-size: 0.72rem; color: var(--muted); letter-spacing: 0.04em; }

/* MODAL */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(10,10,10,0.92); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
  animation: fadein 0.2s ease;
}
@keyframes fadein { from{opacity:0} to{opacity:1} }
.modal {
  background: var(--off-black); border: 1px solid var(--border);
  border-radius: 4px; padding: 48px; width: 100%; max-width: 428px;
  position: relative; animation: slideup 0.22s ease;
}
@keyframes slideup { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.modal-x {
  position: absolute; top: 18px; right: 18px;
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  background: none; border: 1px solid var(--border); color: var(--muted);
  cursor: pointer; border-radius: 3px; font-size: 0.8rem; transition: all 0.15s;
}
.modal-x:hover { border-color: var(--mid); color: var(--white); }
.modal-eyebrow {
  font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent); font-weight: 600; margin-bottom: 8px;
}
.modal-title {
  font-family: 'Bebas Neue', sans-serif; font-size: 2.6rem;
  letter-spacing: 0.02em; color: var(--white); margin-bottom: 4px; line-height: 1;
}
.modal-sub { font-size: 0.85rem; color: var(--dim); margin-bottom: 32px; line-height: 1.6; }

.fgroup { margin-bottom: 14px; }
.flabel {
  display: block; font-size: 0.65rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 6px; font-weight: 600;
}
.finput {
  width: 100%; padding: 10px 13px;
  background: var(--card); border: 1px solid var(--border);
  color: var(--white); font-family: 'Instrument Sans', sans-serif;
  font-size: 0.88rem; border-radius: 3px; outline: none; transition: border 0.15s;
}
.finput:focus { border-color: var(--muted); }
.finput::placeholder { color: var(--muted); }

.role-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.role-opt {
  padding: 10px; border: 1px solid var(--border); border-radius: 3px;
  background: transparent; color: var(--dim);
  font-family: 'Instrument Sans', sans-serif; font-size: 0.8rem;
  cursor: pointer; transition: all 0.15s; text-align: center; letter-spacing: 0.02em;
}
.role-opt.on { border-color: var(--accent); color: var(--white); background: var(--accent-dim); }
.role-opt:hover:not(.on) { border-color: var(--mid); color: var(--white); }

.fdivider { height: 1px; background: var(--border); margin: 8px 0 14px; }

.sbtn {
  width: 100%; padding: 12px; background: var(--white); color: var(--black);
  border: none; border-radius: 3px; font-family: 'Instrument Sans', sans-serif;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; transition: background 0.15s; margin-top: 6px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.sbtn:hover:not(:disabled) { background: var(--off-white); }
.sbtn:disabled { opacity: 0.5; cursor: not-allowed; }

.mswitch { text-align: center; margin-top: 18px; font-size: 0.8rem; color: var(--muted); }
.mswitch button {
  background: none; border: none; color: var(--white); cursor: pointer;
  font-family: 'Instrument Sans', sans-serif; font-size: 0.8rem;
  text-decoration: underline; text-underline-offset: 3px;
}
.merr {
  background: rgba(212,82,42,0.1); border: 1px solid rgba(212,82,42,0.3);
  border-radius: 3px; padding: 9px 13px; color: #e0896e;
  font-size: 0.82rem; margin-bottom: 14px;
}
.mok {
  background: rgba(80,180,120,0.1); border: 1px solid rgba(80,180,120,0.3);
  border-radius: 3px; padding: 9px 13px; color: #8dd4a8;
  font-size: 0.82rem; margin-bottom: 14px;
}
.spin {
  width: 13px; height: 13px; border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.15); border-top-color: var(--black);
  animation: sp 0.6s linear infinite;
}
@keyframes sp { to { transform: rotate(360deg); } }

/* DASHBOARD */
.dash {
  min-height: 100vh; display: flex; align-items: center;
  justify-content: center; padding: 100px 48px;
}
.dash-card {
  border: 1px solid var(--border); border-radius: 4px;
  max-width: 500px; width: 100%; overflow: hidden;
}
.dash-head {
  padding: 36px 40px; border-bottom: 1px solid var(--border); background: var(--card);
}
.dash-role {
  font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent); font-weight: 600; margin-bottom: 8px;
}
.dash-name {
  font-family: 'Bebas Neue', sans-serif; font-size: 2.4rem;
  letter-spacing: 0.02em; color: var(--white); line-height: 1;
}
.dash-body { padding: 28px 40px; }
.dash-status-box {
  background: var(--card); border: 1px solid var(--border); border-radius: 3px;
  padding: 14px; margin-bottom: 20px;
}
.dash-slbl { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
.dash-sval { font-size: 0.875rem; color: var(--white); display: flex; align-items: center; gap: 8px; }
.sdot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: dpulse 2s ease-in-out infinite; }
@keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
.dash-desc { font-size: 0.875rem; color: var(--dim); line-height: 1.75; margin-bottom: 24px; }
.btn-out {
  background: none; border: 1px solid var(--border); color: var(--muted);
  padding: 8px 18px; border-radius: 3px; cursor: pointer;
  font-family: 'Instrument Sans', sans-serif; font-size: 0.75rem;
  letter-spacing: 0.07em; text-transform: uppercase; transition: all 0.15s;
}
.btn-out:hover { border-color: var(--mid); color: var(--white); }

/* ARCHITECTURE */
.arch-section { padding: 96px 48px; border-bottom: 1px solid var(--border); }
.arch-wrap {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0; margin-top: 0;
  border: 1px solid var(--border); border-radius: 4px; overflow: hidden;
}

/* Left — backend layer stack */
.arch-left {
  border-right: 1px solid var(--border);
  padding: 40px 36px;
  display: flex; flex-direction: column; gap: 0;
}
.arch-left-title {
  font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--dim); font-weight: 500; margin-bottom: 32px;
}
.arch-layer {
  border: 1px solid var(--border); border-radius: 3px;
  padding: 20px 22px; cursor: pointer;
  transition: all 0.2s; position: relative;
  background: var(--card);
}
.arch-layer.active { border-color: var(--accent); background: rgba(212,82,42,0.06); }
.arch-layer:hover:not(.active) { border-color: var(--mid); }
.arch-layer-label {
  font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); font-weight: 600; margin-bottom: 6px;
}
.arch-layer.active .arch-layer-label { color: var(--accent); }
.arch-layer-name {
  font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem;
  letter-spacing: 0.03em; color: var(--white); margin-bottom: 10px; line-height: 1;
}
.arch-layer-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.arch-chip {
  padding: 3px 8px; border-radius: 2px; font-size: 0.6rem;
  letter-spacing: 0.07em; text-transform: uppercase; font-weight: 600;
  border: 1px solid var(--border); color: var(--muted);
  transition: all 0.2s;
}
.arch-layer.active .arch-chip { border-color: rgba(212,82,42,0.3); color: var(--off-white); }
.arch-connector {
  display: flex; align-items: center; justify-content: center;
  height: 36px; position: relative;
}
.arch-connector::before {
  content: ''; position: absolute;
  left: 50%; top: 0; bottom: 0; width: 1px;
  background: var(--border);
  transform: translateX(-50%);
}
.arch-connector-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent); position: relative; z-index: 1;
  opacity: 0; transition: opacity 0.3s;
}
.arch-connector.lit .arch-connector-dot { opacity: 1; animation: travel 1s ease-in-out infinite; }
@keyframes travel {
  0% { transform: translateY(-10px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}

/* Right — detail panel */
.arch-right {
  padding: 40px 36px;
  display: flex; flex-direction: column;
}
.arch-right-label {
  font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--dim); font-weight: 500; margin-bottom: 32px;
}
.arch-detail { animation: fadein 0.25s ease; }
.arch-detail-tag {
  font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent); font-weight: 600; margin-bottom: 10px;
}
.arch-detail-title {
  font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
  letter-spacing: 0.02em; color: var(--white); margin-bottom: 16px; line-height: 1;
}
.arch-detail-desc {
  font-size: 0.875rem; color: var(--dim); line-height: 1.75; margin-bottom: 28px;
}
.arch-detail-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.arch-detail-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 14px; border-radius: 3px;
  background: var(--card); border: 1px solid var(--border);
}
.arch-item-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent); flex-shrink: 0; margin-top: 5px;
}
.arch-item-body {}
.arch-item-name { font-size: 0.82rem; font-weight: 600; color: var(--white); margin-bottom: 2px; }
.arch-item-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }

/* Right — flow diagram */
.arch-flow { margin-top: 8px; }
.arch-flow-title {
  font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--dim); margin-bottom: 16px; font-weight: 500;
}
.arch-flow-nodes { display: flex; flex-direction: column; gap: 0; }
.arch-flow-row { display: flex; align-items: stretch; gap: 0; }
.arch-flow-col { display: flex; flex-direction: column; align-items: center; gap: 0; flex: 1; }

.fnode {
  width: 100%; padding: 10px 12px; border-radius: 3px; text-align: center;
  font-size: 0.75rem; font-weight: 600; color: var(--white);
  border: 1px solid var(--border); background: var(--card);
  transition: all 0.2s; cursor: default;
}
.fnode:hover { border-color: var(--accent); }
.fnode.fn-accent { border-color: rgba(212,82,42,0.4); background: rgba(212,82,42,0.08); }
.fnode-sub { font-size: 0.65rem; font-weight: 400; color: var(--muted); margin-top: 2px; }
.fnode-viewer { border-color: rgba(100,160,255,0.3); background: rgba(100,160,255,0.06); }
.fnode-organiser { border-color: rgba(255,180,80,0.3); background: rgba(255,180,80,0.06); }

.fconn-v {
  width: 1px; flex: 1; min-height: 20px;
  background: var(--border); margin: 0 auto;
}
.fconn-h {
  height: 1px; flex: 1;
  background: var(--border); align-self: center;
}
.fconn-branch {
  display: flex; width: 100%;
  align-items: flex-start; gap: 8px; margin-top: 20px;
}
.fconn-branch-col { flex: 1; display: flex; flex-direction: column; align-items: center; }
.fconn-top { height: 1px; background: var(--border); width: 50%; align-self: flex-end; }
.fconn-top-l { align-self: flex-start; }
.fconn-v-sm { width: 1px; height: 20px; background: var(--border); }

/* RESPONSIVE */
@media (max-width: 900px) {
  .nav { padding: 0 24px; }
  .nav-center { display: none; }
  .hero { padding: 100px 24px 0; }
  .hero-body { grid-template-columns: 1fr; gap: 48px; }
  .arch-section { padding: 72px 24px; }
  .arch-wrap { grid-template-columns: 1fr; }
  .arch-left { border-right: none; border-bottom: 1px solid var(--border); }
  .sticky-section { padding: 72px 24px; }
  .sticky-board { grid-template-columns: 1fr 1fr; gap: 16px; }
  .section { padding: 72px 24px; }
  .sec-header { grid-template-columns: 1fr; gap: 12px; }
  .how-item { grid-template-columns: 60px 1fr; }
  .how-tag { display: none; }
  .feat-grid { grid-template-columns: 1fr; }
  .feat-cell { border-right: none !important; }
  .feat-cell.wide { grid-column: 1; }
  .feat-cell:nth-last-child(-n+2) { border-bottom: 1px solid var(--border); }
  .feat-cell:last-child { border-bottom: none; }
  .roles-grid { grid-template-columns: 1fr; }
  .role-cell { border-right: none; border-bottom: 1px solid var(--border); }
  .role-cell:last-child { border-bottom: none; }
  .cta-block { grid-template-columns: 1fr; gap: 36px; padding: 72px 24px; }
  .footer { padding: 24px; }
  .modal { padding: 32px 24px; }
}
`;

function StyleInjector() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return null;
}

const Spin = () => <div className="spin" />;

function Nav({ onLogin, onSignup }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => window.scrollTo(0,0)}>Meet<span>Verse</span></div>
      <div className="nav-center">
        <button className="nav-link" onClick={() => document.getElementById("how")?.scrollIntoView({behavior:"smooth"})}>Process</button>
        <button className="nav-link" onClick={() => document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}>Platform</button>
        <button className="nav-link" onClick={() => document.getElementById("roles")?.scrollIntoView({behavior:"smooth"})}>Access</button>
        <button className="nav-link" onClick={() => document.getElementById("arch")?.scrollIntoView({behavior:"smooth"})}>Architecture</button>
      </div>
      <div className="nav-actions">
        <button className="nav-btn nav-ghost" onClick={onLogin}>Login</button>
        <button className="nav-btn nav-solid" onClick={onSignup}>Get Access</button>
      </div>
    </nav>
  );
}

function Hero({ onSignup }) {
  return (
    <section className="hero">
      <div className="hero-eyebrow">
        <span className="hero-tag hero-tag-accent">India Innovates 2026</span>
        <div className="rule-h" />
        <span className="hero-tag">Virtual Leadership Infrastructure</span>
      </div>
      <div className="hero-body">
        <div>
          <h1 className="hero-title">
            Lead.<br /><span className="t-accent">Connect.</span><br /><span className="t-italic">Anywhere.</span>
          </h1>
          <p className="hero-desc">
            A virtual presence platform for government officials, educators, and institutions. AI avatars,
            immersive sessions, and VR compatibility — all on a secure, scalable infrastructure.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={onSignup}>Create Account</button>
            <button className="btn-ghost-text" onClick={() => document.getElementById("how")?.scrollIntoView({behavior:"smooth"})}>
              See how it works <span className="arrow">→</span>
            </button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-vis">
            <div className="vis-grid" />
            <div className="vis-ring">
              <div className="vis-dot vd1" />
              <div className="vis-dot vd2" />
              <div className="vis-dot vd3" />
            </div>
            <div className="vis-label">Virtual Environment <span>/ Active</span></div>
          </div>
          <div className="hero-stats">
            <div className="h-stat">
              <div className="h-stat-num">VR<span className="a">+</span></div>
              <div className="h-stat-lbl">Full body<br />tracking</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-num">RAG<span className="a">.</span></div>
              <div className="h-stat-lbl">Knowledge<br />base AI</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-num">ML<span className="a">.</span></div>
              <div className="h-stat-lbl">Emotion<br />detection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["AI Avatars","VR Sessions","RAG Knowledge Base","Emotion Detection","Live Lectures","Govt Infrastructure","Unity WebGL","Voice Interaction","Sentiment Analysis","Full Body Tracking"];
  const all = [...items,...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee-inner">
        {all.map((t,i) => (
          <div className="mq-item" key={i}>{t}{i < all.length - 1 && <span className="mq-dot" />}</div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n:"01", title:"Register and Select Role", desc:"Sign up as a Creator or Viewer. Creators represent organisations — government offices, schools, institutions. Viewers are citizens, students, or attendees. Both receive a secure authenticated account.", tag:"Auth Layer" },
    { n:"02", title:"Build Your Avatar", desc:"Choose how your digital presence looks — facial features, outfit, style. Your avatar is persistent across sessions and tied to your account. It loads automatically every time you enter a space.", tag:"Avatar Engine" },
    { n:"03", title:"Enter the Virtual Space", desc:"Creators open a session room inside the Unity environment. The space loads with the host's avatar at the front. Viewers join from browser, mobile, or a VR headset — no installation needed for web participants.", tag:"Unity Runtime" },
    { n:"04", title:"Speak. Your Avatar Responds.", desc:"A live ML model listens for when the host is talking. When speech is detected, the avatar animates accordingly. When silent, it idles. The session feels present — not pre-recorded.", tag:"ML Detection" },
    { n:"05", title:"Audience Asks. AI Answers.", desc:"Viewers send questions by text or voice during the session. The backend processes the query, generates a grounded answer in context, and delivers it back as spoken audio with the avatar's voice.", tag:"AI Backend" },
    { n:"06", title:"Session Closes With a Brief", desc:"When the session ends, the creator receives a structured summary — questions that came in, the sentiment across the room, and what topics dominated. Actionable, immediate, automatic.", tag:"Analytics" },
  ];
  return (
    <section className="section" id="how">
      <div className="sec-header">
        <div className="sec-lbl">Process</div>
        <div>
          <div className="sec-num">01 —</div>
          <h2 className="sec-title">How it<br /><span className="ital">works</span></h2>
        </div>
      </div>
      <div className="how-list">
        {steps.map(s => (
          <div className="how-item" key={s.n}>
            <div className="how-n">{s.n}</div>
            <div>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
            <div className="how-tag">{s.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const notes = [
    { cls:"sticky-1", cat:"Core AI", title:"Avatar Intelligence", desc:"The avatar answers questions grounded in your organisation's own content. Voice in, voice out — accurate, contextual, and in real time.", pills:["RAG","Vector DB","Pinecone"] },
    { cls:"sticky-2", cat:"ML Animation", title:"Reads the Room", desc:"Sentiment analysis detects the emotional tone of every response and plays a matching animation — engaged, concerned, positive, neutral.", pills:["Sentiment ML","Unity Anims"] },
    { cls:"sticky-3", cat:"Auto Detection", title:"Knows When You Speak", desc:"A live model detects speech versus silence and switches the avatar's state automatically. No buttons, no triggers — it just works.", pills:["Python ML","Real-time"] },
    { cls:"sticky-4", cat:"Immersive", title:"Full Body in VR", desc:"Join from a headset and your entire body becomes the avatar. Head turns, gestures, and movement all translate into the virtual space.", pills:["VR SDK","Body Track","Spatial Audio"] },
    { cls:"sticky-5", cat:"Environment", title:"A Room That Feels Real", desc:"Viewers walk in, find a seat, look at the front. It moves like a game. Questions go through chat. The host is always present.", pills:["Unity WebGL","Multiplayer"] },
    { cls:"sticky-6", cat:"Post-Session", title:"Summary on Close", desc:"When the session ends, the creator gets a brief — top questions, sentiment spread, participation data. No manual work needed.", pills:["Auto Summary","Analytics"] },
  ];
  return (
    <section className="sticky-section" id="features">
      <div className="sec-header" style={{marginBottom:"48px"}}>
        <div className="sec-lbl">Platform</div>
        <div>
          <div className="sec-num">02 —</div>
          <h2 className="sec-title">Platform<br /><span className="ital">capabilities</span></h2>
        </div>
      </div>
      <div className="sticky-board">
        {notes.map(n => (
          <div className={`sticky ${n.cls}`} key={n.title}>
            <div>
              <div className="sticky-cat">{n.cat}</div>
              <div className="sticky-title">{n.title}</div>
              <p className="sticky-desc">{n.desc}</p>
            </div>
            <div className="sticky-pills">
              {n.pills.map(p => <span className="sticky-pill" key={p}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roles() {
  return (
    <section className="section" id="roles">
      <div className="sec-header">
        <div className="sec-lbl">Access</div>
        <div>
          <div className="sec-num">03 —</div>
          <h2 className="sec-title">Who uses<br /><span className="ital">MeetVerse</span></h2>
        </div>
      </div>
      <div className="roles-grid">
        <div className="role-cell">
          <div className="role-marker rm-accent" />
          <div className="role-lbl">Creator Account</div>
          <div className="role-title">Leader / Educator</div>
          <p className="role-desc">District officials, ministers, vice-chancellors, and teachers host sessions backed by an AI avatar, upload knowledge documents, and receive post-session analytics.</p>
          <ul className="role-perks">
            {["Upload knowledge base documents","Host live sessions and town halls","VR full-body tracking support","AI-generated session summaries","Full avatar customisation"].map(p => (
              <li key={p}><span className="perk-dash">—</span>{p}</li>
            ))}
          </ul>
        </div>
        <div className="role-cell">
          <div className="role-marker rm-white" />
          <div className="role-lbl">Viewer Account</div>
          <div className="role-title">Student / Citizen</div>
          <p className="role-desc">Students, citizens, and junior officials attend sessions as personalised avatars. Navigate the environment, interact in real time, and query the AI knowledge base.</p>
          <ul className="role-perks">
            {["Join via browser, app, or VR","Navigate virtual spaces freely","Chat and voice Q&A","Real-time AI-powered answers","Personal avatar identity"].map(p => (
              <li key={p}><span className="perk-dash">—</span>{p}</li>
            ))}
          </ul>
        </div>
        <div className="role-cell">
          <div className="role-marker rm-mid" />
          <div className="role-lbl">Extended Mode</div>
          <div className="role-title">VR Participant</div>
          <p className="role-desc">Any user — Creator or Viewer — can join via VR headset for a fully immersive session with spatial audio, gesture-based interaction, and full 360-degree presence.</p>
          <ul className="role-perks">
            {["Full spatial presence","Hand gesture input","360-degree environment","Spatial audio channels","Suited for high-stakes meetings"].map(p => (
              <li key={p}><span className="perk-dash">—</span>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const [active, setActive] = useState(0);

  const layers = [
    {
      label: "Layer 01",
      name: "Client Layer",
      chips: ["Web Browser", "Mobile App", "VR HMD"],
      tag: "Access Points",
      title: "How People Connect",
      desc: "MeetVerse runs on any device without friction. Web participants join directly from a browser with no install. Mobile users get a dedicated app. VR headset owners step fully inside — with spatial audio and motion tracking.",
      items: [
        { name: "Web Browser", desc: "React frontend served via CDN. Unity WebGL embedded for the virtual space." },
        { name: "Mobile App", desc: "Native app for Android and iOS. Joins sessions as a viewer with full chat and voice Q&A." },
        { name: "VR Headset (HMD)", desc: "Full body tracking mode. Head, hands, and gestures all map directly to the avatar." },
      ],
    },
    {
      label: "Layer 02",
      name: "Application Layer",
      chips: ["React JS", "Node JS", "Unity WebGL", "C# Unity", "ML Pipeline"],
      tag: "Runtime Systems",
      title: "Where Everything Runs",
      desc: "The application layer is split into two sides — the web layer handles auth, routing, and API calls, while the Unity environment handles the 3D world, avatars, and real-time session logic.",
      items: [
        { name: "React JS", desc: "Landing page, login, signup, and the handoff into the Unity WebGL embed." },
        { name: "Node JS + Express", desc: "REST API handling auth, avatar config, document upload, and the /ask AI endpoint." },
        { name: "Unity WebGL / C#", desc: "The virtual lecture hall. Avatar rendering, movement, seating, and animation state machine." },
        { name: "ML Pipeline", desc: "Python server handling speech detection and sentiment analysis in real time." },
      ],
    },
    {
      label: "Layer 03",
      name: "Data / AI Layer",
      chips: ["MongoDB", "Pinecone", "RAG Model", "TTS / STT", "Python ML"],
      tag: "Intelligence & Storage",
      title: "The Engine Behind It",
      desc: "All persistent data, AI knowledge, and voice processing lives here. The RAG model queries the vector database to give the avatar accurate, grounded answers — pulled from the organisation's own documents.",
      items: [
        { name: "MongoDB Atlas", desc: "Stores user profiles, avatar config, session records, and chat logs." },
        { name: "Pinecone Vector DB", desc: "Stores embedded document chunks for fast semantic retrieval during Q&A." },
        { name: "RAG AI Model", desc: "Takes an incoming question, retrieves relevant chunks, and generates a contextual answer." },
        { name: "TTS / STT", desc: "Converts user voice to text for the AI, then converts the AI response back to audio." },
        { name: "Python ML Server", desc: "Runs speech detection and sentiment tagging. Returns emotion metadata to Unity." },
      ],
    },
  ];

  const flowSteps = [
    { label: "Landing Page", sub: "Browse & Explore", type: "accent" },
    { label: "Login / Signup", sub: "JWT Issued", type: "accent" },
    { label: "Avatar Builder", sub: "Unity — 3D Customisation", type: "accent" },
    { label: null },
    { label: "Viewer", sub: "Browse Sessions", type: "viewer", branch: "left" },
    { label: "Organiser", sub: "Create Session", type: "organiser", branch: "right" },
  ];

  const l = layers[active];

  return (
    <section className="arch-section" id="arch">
      <div className="sec-header" style={{ marginBottom: "48px" }}>
        <div className="sec-lbl">Architecture</div>
        <div>
          <div className="sec-num">04 —</div>
          <h2 className="sec-title">How it's<br /><span className="ital">built</span></h2>
        </div>
      </div>
      <div className="arch-wrap">
        {/* LEFT — layer selector */}
        <div className="arch-left">
          <div className="arch-left-title">Backend Architecture — click to explore</div>

          <div className={`arch-layer ${active === 0 ? "active" : ""}`} onClick={() => setActive(0)}>
            <div className="arch-layer-label">{layers[0].label}</div>
            <div className="arch-layer-name">{layers[0].name}</div>
            <div className="arch-layer-chips">{layers[0].chips.map(c => <span className="arch-chip" key={c}>{c}</span>)}</div>
          </div>

          <div className={`arch-connector ${active === 0 || active === 1 ? "lit" : ""}`}>
            <div className="arch-connector-dot" />
          </div>

          <div className={`arch-layer ${active === 1 ? "active" : ""}`} onClick={() => setActive(1)}>
            <div className="arch-layer-label">{layers[1].label}</div>
            <div className="arch-layer-name">{layers[1].name}</div>
            <div className="arch-layer-chips">{layers[1].chips.map(c => <span className="arch-chip" key={c}>{c}</span>)}</div>
          </div>

          <div className={`arch-connector ${active === 1 || active === 2 ? "lit" : ""}`}>
            <div className="arch-connector-dot" />
          </div>

          <div className={`arch-layer ${active === 2 ? "active" : ""}`} onClick={() => setActive(2)}>
            <div className="arch-layer-label">{layers[2].label}</div>
            <div className="arch-layer-name">{layers[2].name}</div>
            <div className="arch-layer-chips">{layers[2].chips.map(c => <span className="arch-chip" key={c}>{c}</span>)}</div>
          </div>

          {/* Flow diagram below */}
          <div style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid var(--border)" }}>
            <div className="arch-flow-title">Frontend Flow</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              {["Landing Page", "Login / Signup", "Avatar Builder"].map((step, i) => (
                <div key={step} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className="fnode fn-accent" style={{ maxWidth: 240 }}>
                    {step}
                    <div className="fnode-sub">{["Browse & explore", "JWT issued", "3D customisation"][i]}</div>
                  </div>
                  {i < 2 && <div className="fconn-v" style={{ height: 20 }} />}
                </div>
              ))}

              {/* Branch */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="fconn-v" style={{ height: 20 }} />
                <div style={{ width: "70%", display: "flex", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "100%", height: 1, background: "var(--border)", marginLeft: "50%" }} />
                    <div style={{ width: 1, height: 18, background: "var(--border)" }} />
                    <div className="fnode fnode-viewer" style={{ width: "100%" }}>
                      Viewer
                      <div className="fnode-sub">Browse & join</div>
                    </div>
                  </div>
                  <div style={{ width: 1, height: 36, background: "var(--border)", alignSelf: "flex-start", marginTop: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "100%", height: 1, background: "var(--border)", marginRight: "50%" }} />
                    <div style={{ width: 1, height: 18, background: "var(--border)" }} />
                    <div className="fnode fnode-organiser" style={{ width: "100%" }}>
                      Organiser
                      <div className="fnode-sub">Create & host</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — detail panel */}
        <div className="arch-right">
          <div className="arch-right-label">Selected layer — detail view</div>
          <div className="arch-detail" key={active}>
            <div className="arch-detail-tag">{l.tag}</div>
            <div className="arch-detail-title">{l.title}</div>
            <p className="arch-detail-desc">{l.desc}</p>
            <div className="arch-detail-items">
              {l.items.map(item => (
                <div className="arch-detail-item" key={item.name}>
                  <div className="arch-item-dot" />
                  <div className="arch-item-body">
                    <div className="arch-item-name">{item.name}</div>
                    <div className="arch-item-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function CTA({ onSignup }) {
  return (
    <div className="cta-block">
      <h2 className="cta-title">Step into<br />the <span className="ca">next</span><br />era.</h2>
      <div className="cta-right">
        <p className="cta-desc">Government leadership, education, and public engagement — redefined for the virtual age. Register your organisation and launch your first AI avatar session today.</p>
        <div className="cta-actions">
          <button className="btn-primary" onClick={onSignup}>Create Free Account</button>
          <button className="btn-ghost-text" onClick={() => document.getElementById("how")?.scrollIntoView({behavior:"smooth"})}>
            Learn more <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">Meet<span>Verse</span></div>
      <div className="footer-copy">Built for India Innovates 2026</div>
    </footer>
  );
}

function LoginModal({ onClose, onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    if (!email || !pass) { setErr("All fields required."); return; }
    setLoading(true); setErr("");
    try {
      const data = await apiPost("/auth/login", { email, password: pass });
      if (data.success) {
        localStorage.setItem("nv_token", data.token);
        localStorage.setItem("nv_user", JSON.stringify(data.user));
        onSuccess(data.user);
      } else setErr(data.message || "Invalid credentials.");
    } catch { setErr("Network error. Check your connection."); }
    setLoading(false);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-eyebrow">MeetVerse Platform</div>
        <h2 className="modal-title">Sign In</h2>
        <p className="modal-sub">Access your virtual leadership account.</p>
        {err && <div className="merr">{err}</div>}
        <div className="fgroup">
          <label className="flabel">Email</label>
          <input className="finput" type="email"
            value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        <div className="fgroup">
          <label className="flabel">Password</label>
          <input className="finput" type="password"
            value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        <button className="sbtn" onClick={submit} disabled={loading}>
          {loading ? <><Spin />Signing in</> : "Sign In →"}
        </button>
        <div className="mswitch">No account? <button onClick={onSwitch}>Create one</button></div>
      </div>
    </div>
  );
}

function SignupModal({ onClose, onSwitch, onSuccess }) {
  const [f, setF] = useState({ name:"", email:"", password:"", userType:"viewer", organizationName:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  async function submit() {
    if (!f.name||!f.email||!f.password) { setErr("Name, email, and password are required."); return; }
    if (f.userType==="creator"&&!f.organizationName) { setErr("Organisation name required for Creator accounts."); return; }
    setLoading(true); setErr(""); setOk("");
    try {
      const body = {name:f.name,email:f.email,password:f.password,userType:f.userType};
      if (f.userType==="creator") body.organizationName = f.organizationName;
      const data = await apiPost("/auth/register", body);
      if (data.success) {
        localStorage.setItem("nv_token", data.token);
        localStorage.setItem("nv_user", JSON.stringify(data.user));
        setOk("Account created. Redirecting...");
        setTimeout(() => onSuccess(data.user), 1000);
      } else setErr(data.message || "Registration failed.");
    } catch { setErr("Network error. Check your connection."); }
    setLoading(false);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-eyebrow">MeetVerse Platform</div>
        <h2 className="modal-title">Create Account</h2>
        <p className="modal-sub">Join the virtual leadership platform.</p>
        {err && <div className="merr">{err}</div>}
        {ok && <div className="mok">{ok}</div>}
        <div className="fgroup">
          <label className="flabel">Account Type</label>
          <div className="role-row">
            <button className={`role-opt ${f.userType==="viewer"?"on":""}`} onClick={()=>set("userType","viewer")}>Viewer / Student</button>
            <button className={`role-opt ${f.userType==="creator"?"on":""}`} onClick={()=>set("userType","creator")}>Creator / Leader</button>
          </div>
        </div>
        <div className="fdivider" />
        <div className="fgroup">
          <label className="flabel">Full Name</label>
          <input className="finput" type="text" value={f.name} onChange={e=>set("name",e.target.value)} />
        </div>
        <div className="fgroup">
          <label className="flabel">Email</label>
          <input className="finput" type="email" value={f.email} onChange={e=>set("email",e.target.value)} />
        </div>
        <div className="fgroup">
          <label className="flabel">Password</label>
          <input className="finput" type="password" value={f.password} onChange={e=>set("password",e.target.value)} />
        </div>
        {f.userType==="creator" && (
          <div className="fgroup">
            <label className="flabel">Organisation Name</label>
            <input className="finput" type="text" value={f.organizationName} onChange={e=>set("organizationName",e.target.value)} />
          </div>
        )}
        <button className="sbtn" onClick={submit} disabled={loading}>
          {loading ? <><Spin />Creating account</> : "Create Account →"}
        </button>
        <div className="mswitch">Have an account? <button onClick={onSwitch}>Sign in</button></div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <div className="dash">
      <div className="dash-card">
        <div className="dash-head">
          <div className="dash-role">{user?.userType==="creator"?"Creator Account":"Viewer Account"}</div>
          <div className="dash-name">Welcome,<br />{user?.name}</div>
        </div>
        <div className="dash-body">
          <div className="dash-status-box">
            <div className="dash-slbl">Integration Status</div>
            <div className="dash-sval"><span className="sdot" />Authenticated — Unity module loading</div>
          </div>
          <p className="dash-desc">
            Your avatar environment is initialising. You will be redirected to the Unity session lobby
            where you can {user?.userType==="creator"?"customise your avatar and host a session":"join an active session"}.
          </p>
          <button className="btn-out" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [modal, setModal] = useState(null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nv_user")); } catch { return null; }
  });
  function onSuccess(u) { setUser(u); setModal(null); }
  function onLogout() { localStorage.removeItem("nv_token"); localStorage.removeItem("nv_user"); setUser(null); }

  return (
    <>
      <StyleInjector />
      <Nav onLogin={()=>setModal("login")} onSignup={()=>setModal("signup")} />
      {user ? <Dashboard user={user} onLogout={onLogout} /> : (
        <>
          <Hero onSignup={()=>setModal("signup")} />
          <Marquee />
          <HowItWorks />
          <Features />
          <Roles />
          <Architecture />
          <CTA onSignup={()=>setModal("signup")} />
          <Footer />
        </>
      )}
      {modal==="login" && <LoginModal onClose={()=>setModal(null)} onSwitch={()=>setModal("signup")} onSuccess={onSuccess} />}
      {modal==="signup" && <SignupModal onClose={()=>setModal(null)} onSwitch={()=>setModal("login")} onSuccess={onSuccess} />}
    </>
  );
}