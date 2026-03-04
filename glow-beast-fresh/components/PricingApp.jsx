import { useState, useEffect } from "react";

// ─── Styles ──────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f0e0d; --paper: #faf9f7; --warm: #f4f0eb;
    --coral: #d9503f; --coral-lt: #f5e8e6;
    --gold: #c8a96e; --muted: #9a9590; --bdr: #e2ddd8;
  }
  body { font-family:'DM Sans',sans-serif; background:var(--paper); color:var(--ink); min-height:100vh; }
  .shell { max-width:860px; margin:0 auto; padding:48px 24px 80px; }

  .hdr { text-align:center; margin-bottom:52px; border-bottom:1px solid var(--bdr); padding-bottom:36px; }
  .hdr .eye { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--coral); font-weight:500; margin-bottom:12px; }
  .hdr h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(30px,5vw,50px); font-weight:300; line-height:1.1; letter-spacing:-.02em; }
  .hdr h1 em { font-style:italic; color:var(--coral); }
  .hdr p { margin-top:12px; font-size:14px; color:var(--muted); font-weight:300; }

  .prog { display:flex; align-items:center; margin-bottom:44px; position:relative; }
  .prog::before { content:''; position:absolute; top:15px; left:16px; right:16px; height:1px; background:var(--bdr); z-index:0; }
  .ps { display:flex; flex-direction:column; align-items:center; flex:1; position:relative; z-index:1; }
  .pd { width:30px; height:30px; border-radius:50%; border:1.5px solid var(--bdr); background:var(--paper); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500; color:var(--muted); transition:all .3s; margin-bottom:7px; }
  .pd.act { border-color:var(--coral); background:var(--coral); color:white; }
  .pd.done { border-color:var(--gold); background:var(--gold); color:white; }
  .pl { font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); text-align:center; line-height:1.3; }
  .pl.act { color:var(--coral); font-weight:500; } .pl.done { color:var(--gold); }

  .card { background:white; border:1px solid var(--bdr); border-radius:4px; padding:36px; margin-bottom:24px; animation:fs .35s ease; }
  @keyframes fs { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .ctitle { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; margin-bottom:5px; }
  .csub { font-size:13px; color:var(--muted); margin-bottom:26px; font-weight:300; }

  .fg2 { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .fg1 { display:grid; grid-template-columns:1fr; gap:18px; margin-top:16px; }
  .fld { display:flex; flex-direction:column; gap:7px; }
  .fld label { font-size:11px; letter-spacing:.1em; text-transform:uppercase; font-weight:500; color:var(--muted); }
  .fld input,.fld select,.fld textarea { border:1px solid var(--bdr); border-radius:3px; padding:11px 14px; font-family:'DM Sans',sans-serif; font-size:14px; background:var(--paper); color:var(--ink); transition:border-color .2s; outline:none; resize:none; }
  .fld input:focus,.fld select:focus,.fld textarea:focus { border-color:var(--coral); background:white; }

  .bp { background:var(--coral); color:white; border:none; border-radius:3px; padding:13px 28px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:8px; }
  .bp:hover { background:#c4432f; } .bp:disabled { background:var(--muted); cursor:not-allowed; }
  .bs { background:transparent; color:var(--ink); border:1px solid var(--bdr); border-radius:3px; padding:12px 24px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; cursor:pointer; transition:all .2s; }
  .bs:hover { border-color:var(--ink); }
  .brow { display:flex; gap:12px; margin-top:28px; flex-wrap:wrap; align-items:center; }

  .lbox { display:flex; flex-direction:column; align-items:center; gap:16px; padding:40px; color:var(--muted); font-size:14px; }
  @keyframes sp { to{transform:rotate(360deg)} }
  .spin { width:32px; height:32px; border:2px solid var(--bdr); border-top-color:var(--coral); border-radius:50%; animation:sp .8s linear infinite; display:inline-block; }
  .spin-sm { width:16px; height:16px; border-width:2px; }

  .sbox { background:var(--warm); border:1px solid var(--bdr); border-radius:3px; padding:16px; font-size:12.5px; line-height:1.7; white-space:pre-wrap; max-height:140px; overflow-y:auto; margin-top:12px; font-family:'DM Sans',sans-serif; width:100%; }

  .errbox { font-size:13px; color:var(--coral); background:var(--coral-lt); border:1px solid #f5c6c0; border-radius:4px; padding:14px 18px; margin-bottom:18px; line-height:1.6; }

  .clist { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
  .citem { display:flex; align-items:flex-start; gap:14px; padding:16px; border:1.5px solid var(--bdr); border-radius:3px; cursor:pointer; transition:all .2s; background:white; }
  .citem:hover { border-color:var(--coral-lt); background:var(--coral-lt); }
  .citem.sel { border-color:var(--coral); background:var(--coral-lt); }
  .cname { font-weight:500; font-size:14px; }
  .cmeta { font-size:12px; color:var(--muted); margin-top:3px; line-height:1.5; }
  .cprice { margin-left:auto; font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--coral); flex-shrink:0; }

  .stlist { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
  .stcard { padding:18px 20px; border:1.5px solid var(--bdr); border-radius:3px; cursor:pointer; transition:all .2s; }
  .stcard:hover { border-color:var(--gold); background:#fdf9f3; }
  .stcard.sel { border-color:var(--gold); background:#fdf9f3; }
  .stname { font-weight:500; font-size:14px; }
  .stdesc { font-size:12.5px; color:var(--muted); margin-top:4px; line-height:1.5; }
  .stprice { font-family:'Cormorant Garamond',serif; font-size:18px; color:var(--gold); font-weight:600; margin-top:6px; }

  .pdisp { background:var(--warm); border:1px solid var(--bdr); border-radius:3px; padding:22px 26px; margin-bottom:18px; }
  .plbl { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
  .pval { font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:300; color:var(--ink); line-height:1; }
  .pnote { font-size:12px; color:var(--muted); margin-top:5px; }

  .slwrap { margin:16px 0; }
  .slhdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
  .slhdr span:first-child { font-size:13px; color:var(--muted); }
  .slval { font-weight:600; font-size:14px; color:var(--coral); }
  input[type=range] { -webkit-appearance:none; width:100%; height:3px; background:var(--bdr); border-radius:2px; outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:var(--coral); cursor:pointer; border:3px solid white; box-shadow:0 1px 4px rgba(0,0,0,.15); }

  .cgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin:18px 0; }
  .cbox { background:var(--warm); border:1px solid var(--bdr); border-radius:3px; padding:18px 16px; }
  .cblbl { font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
  .cbusd { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; }
  .cbkrw { font-size:12px; color:var(--muted); margin-top:3px; }
  .cbpct { font-size:11px; color:var(--coral); font-weight:500; margin-top:3px; }
  .tcbar { background:var(--ink); color:white; border-radius:3px; padding:16px 22px; display:flex; justify-content:space-between; align-items:center; margin:18px 0; }
  .tl { font-size:11px; letter-spacing:.1em; text-transform:uppercase; opacity:.5; }
  .tv { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:300; }
  .tk { font-size:13px; opacity:.55; }
  .fxnote { font-size:11.5px; color:var(--muted); border-top:1px solid var(--bdr); padding-top:12px; margin-top:12px; }

  .pgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin:14px 0; }
  .pitem label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:6px; }
  .pitem input { width:100%; border:1px solid var(--bdr); border-radius:3px; padding:9px 12px; font-family:'DM Sans',sans-serif; font-size:14px; background:var(--paper); outline:none; transition:border-color .2s; }
  .pitem input:focus { border-color:var(--coral); background:white; }
  .pwarn { font-size:12px; color:var(--coral); margin-top:6px; }

  .tabs { display:flex; border-bottom:1px solid var(--bdr); margin-bottom:22px; }
  .tab { padding:10px 18px; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .2s; background:none; border-top:none; border-left:none; border-right:none; font-family:'DM Sans',sans-serif; font-weight:500; }
  .tab.act { color:var(--coral); border-bottom-color:var(--coral); }

  .spill { background:var(--warm); border:1px solid var(--bdr); border-radius:3px; padding:14px 18px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; }
  .spkey { font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
  .spval { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; }

  .divider { border:none; border-top:1px solid var(--bdr); margin:22px 0; }
  .slbl { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; font-weight:500; }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @media(max-width:600px){ .fg2,.cgrid,.pgrid{grid-template-columns:1fr} }
`;

// ─── Claude API — plain streaming, NO tools ───────────────────────────────────
async function askClaude(systemPrompt, userMsg, onChunk, signal, maxTok=2000) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTok,
      system: systemPrompt,
      messages: [{ role: "user", content: userMsg }],
      stream: true,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API 오류 ${res.status}: ${txt.slice(0,300)}`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (raw === "[DONE]") continue;
      try {
        const ev = JSON.parse(raw);
        if (ev.type === "content_block_delta" && ev.delta?.text) {
          full += ev.delta.text;
          onChunk?.(full);
        }
      } catch {}
    }
  }
  return full;
}

// ─── JSON array extractor ─────────────────────────────────────────────────────
function toArr(raw) {
  const s = raw.replace(/```[\w]*\n?/g,"").replace(/```/g,"");
  const a = s.indexOf("["), b = s.lastIndexOf("]");
  if (a === -1 || b <= a) throw new Error("응답에서 JSON 배열을 찾을 수 없습니다");
  return JSON.parse(s.slice(a, b+1));
}

// ─── Free public FX API ───────────────────────────────────────────────────────
async function getUsdKrw() {
  // Primary: @fawazahmed0 CDN — CORS-friendly, no auth, updates daily
  try {
    const today = new Date().toISOString().slice(0,10);
    const r = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${today}/v1/currencies/usd.json`);
    if (!r.ok) throw new Error();
    const d = await r.json();
    const rate = d?.usd?.krw;
    if (!rate) throw new Error();
    return { rate: Math.round(rate), label: `${today} (fawazahmed0/currency-api)` };
  } catch {}
  // Fallback: latest alias
  try {
    const r = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
    if (!r.ok) throw new Error();
    const d = await r.json();
    const rate = d?.usd?.krw;
    if (!rate) throw new Error();
    const date = d.date || "최신";
    return { rate: Math.round(rate), label: `${date} (fawazahmed0/currency-api)` };
  } catch {}
  // Hard fallback: 1-month avg early 2026 (~1,440 KRW/USD)
  return { rate: 1440, label: "참고값 — 2026년 초 1개월 평균 (실시간 API 연결 실패)" };
}

function ensureUrls(c) {
  const q = encodeURIComponent(`${c.brand} ${c.product}`);
  return { ...c, amazon_url: `https://www.amazon.com/s?k=${q}&language=en_US&currency=USD&ref=nb_sb_noss` };
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]       = useState(1);
  const [info, setInfo]       = useState({ category:"", ingredients:"", volume:"", unit:"ml", channel:"Amazon FBA", notes:"" });

  const [comps, setComps]     = useState([]);
  const [compStr, setCompStr] = useState("");
  const [compBusy, setCompBusy] = useState(false);
  const [compErr, setCompErr] = useState("");
  const [sel, setSel]         = useState([]);

  const [strats, setStrats]   = useState([]);
  const [stStr, setStStr]     = useState("");
  const [stBusy, setStBusy]   = useState(false);
  const [stErr, setStErr]     = useState("");
  const [selSt, setSelSt]     = useState(null);

  const [price, setPrice]     = useState("");
  const [tab, setTab]         = useState("comp");

  const [compSec, setCompSec] = useState(0);   // countdown seconds remaining
  const [compAttempt, setCompAttempt] = useState(0); // 0=idle, 1=1차, 2=2차
  const [stSec, setStSec]     = useState(0);
  const [stAttempt, setStAttempt] = useState(0);

  const [disc, setDisc]       = useState(30);
  const [crat, setCrat]       = useState(20);
  const [cpct, setCpct]       = useState({ mfg:70, cont:20, box:10 });

  const [fx, setFx]           = useState(null);
  const [fxLbl, setFxLbl]     = useState("");
  const [fxBusy, setFxBusy]   = useState(false);

  useEffect(() => { if (step === 4 && !fx) loadFx(); }, [step]);

  async function loadFx() {
    setFxBusy(true);
    const { rate, label } = await getUsdKrw();
    setFx(rate); setFxLbl(label);
    setFxBusy(false);
  }

  const cid = c => `${c.brand}::${c.product}`;
  const tog = id => setSel(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  // ─── streaming JSON progressive parser ────────────────────────────────────
  // Extracts complete {...} objects from a partial streaming JSON array
  function extractCompleteObjects(partial) {
    const items = [];
    let depth = 0, start = -1;
    for (let i = 0; i < partial.length; i++) {
      if (partial[i] === "{") { if (depth === 0) start = i; depth++; }
      else if (partial[i] === "}") {
        depth--;
        if (depth === 0 && start !== -1) {
          try { items.push(JSON.parse(partial.slice(start, i + 1))); } catch {}
          start = -1;
        }
      }
    }
    return items;
  }

  async function doComps() {
    setCompBusy(true); setComps([]); setCompErr(""); setSel([]); setStrats([]);
    setStep(2);

    const MAX_SEC = 60;
    const MIN_COUNT = 5;

    // 공유 AbortController — 타이머 만료 시 현재 실행 중인 모든 요청 즉시 종료
    const globalCtrl = new AbortController();

    const SYS = `You are a North American beauty market expert with up-to-date retail pricing.
Output ONLY a raw JSON array. No markdown, no text before or after. Start immediately with [.
Keys: brand, product, price_usd (current 2024-2025 retail, NOT discounted), volume_ml (exact numeric ml from product listing), channel, positioning.
You MUST output at least 5 complete objects before closing the array.`;

    const buildUSR = (extra) => `List at least 5 real competing products in North America for:
- Category: ${info.category}
- Ingredients: ${info.ingredients}
- Our size: ${info.volume}${info.unit}
- Channel: ${info.channel}${info.notes ? `
- Notes: ${info.notes}` : ""}
${extra}Mix K-beauty, Asian, Western brands. Use exact volume_ml from product listings. Current retail prices only.
Output ALL 5+ objects now, start with [:`;

    let secLeft = MAX_SEC;
    setCompSec(secLeft);

    // 타이머: 0초 도달 시 globalCtrl 즉시 abort → 모든 진행 중 요청 강제 종료
    const ticker = setInterval(() => {
      secLeft -= 1;
      setCompSec(Math.max(0, secLeft));
      if (secLeft <= 0) globalCtrl.abort();
    }, 1000);

    let bestResult = [];

    const runOnce = async (attempt, extraHint) => {
      if (globalCtrl.signal.aborted) return;
      setCompAttempt(attempt);
      let raw = "";
      try {
        await askClaude(SYS, buildUSR(extraHint),
          t => {
            raw = t;
            const partial = extractCompleteObjects(t);
            if (partial.length > bestResult.length) {
              bestResult = partial;
              setComps(partial.map(ensureUrls));
            }
          },
          globalCtrl.signal, 2000
        );
      } catch(e) {
        if (e.name !== "AbortError") throw e;
      } finally {
        const final = extractCompleteObjects(raw);
        if (final.length > bestResult.length) {
          bestResult = final;
          setComps(final.map(ensureUrls));
        }
      }
    };

    try {
      await runOnce(1, "");
      // 2차 시도: 5개 미달이고 시간 남아있을 때만
      if (bestResult.length < MIN_COUNT && secLeft > 5 && !globalCtrl.signal.aborted) {
        const hint = bestResult.length > 0
          ? `IMPORTANT: Previous attempt only returned ${bestResult.length} products. You MUST return at least 5 different products.
`
          : `IMPORTANT: Return exactly 5 products. Do not return empty results.
`;
        await runOnce(2, hint);
      }
      if (bestResult.length === 0) setCompErr("결과를 가져오지 못했습니다. 다시 시도해주세요.");
    } catch(e) {
      if (e.name !== "AbortError") setCompErr(e.message);
    } finally {
      clearInterval(ticker);
      setCompSec(-1);
      setCompAttempt(0);
      setCompBusy(false);
    }
  }

  async function doStrats() {
    setStBusy(true); setStrats([]); setStErr("");
    const data = comps.filter(c => sel.includes(cid(c)));
    const avg  = data.length ? (data.reduce((a,c)=>a+c.price_usd,0)/data.length).toFixed(2) : "N/A";

    const MAX_SEC = 60;
    const MIN_COUNT = 3;
    const SYS = `You are a beauty brand pricing strategist. Korean language required.
Output ONLY a raw JSON array. No markdown, no text before or after. Start immediately with [.
You MUST output exactly 3 complete strategy objects.`;

    const buildUSR = (extra) => `${extra}3가지 가격 전략 (${info.category} ${info.volume}${info.unit}, 북미 시장):
경쟁사: ${data.slice(0,4).map(c=>`${c.brand} $${c.price_usd}`).join(", ")} / 평균 $${avg}
반드시 3개 전략을 한국어로 작성. Start with [:
[{"name":"한국어전략명","description":"한국어2문장","suggested_price":0,"rationale":"한국어근거"}]`;

    const globalCtrl = new AbortController();

    let secLeft = MAX_SEC;
    setStSec(secLeft);
    const ticker = setInterval(() => {
      secLeft -= 1;
      setStSec(Math.max(0, secLeft));
      if (secLeft <= 0) globalCtrl.abort();
    }, 1000);

    let bestResult = [];

    const runOnce = async (attempt, extraHint) => {
      if (globalCtrl.signal.aborted) return;
      setStAttempt(attempt);
      let raw = "";
      try {
        await askClaude(SYS, buildUSR(extraHint),
          t => {
            raw = t;
            const partial = extractCompleteObjects(t);
            if (partial.length > bestResult.length) {
              bestResult = partial;
              setStrats(partial);
            }
          },
          globalCtrl.signal, 1000
        );
      } catch(e) {
        if (e.name !== "AbortError") throw e;
      } finally {
        const final = extractCompleteObjects(raw);
        if (final.length > bestResult.length) {
          bestResult = final;
          setStrats(final);
        }
      }
    };

    try {
      await runOnce(1, "");
      if (bestResult.length < MIN_COUNT && secLeft > 5 && !globalCtrl.signal.aborted) {
        const hint = `IMPORTANT: Previous attempt returned ${bestResult.length} strategies. You MUST return exactly 3 strategies.
`;
        await runOnce(2, hint);
      }
      if (bestResult.length === 0) setStErr("전략을 가져오지 못했습니다. 다시 시도해주세요.");
    } catch(e) {
      if (e.name !== "AbortError") setStErr(e.message);
    } finally {
      clearInterval(ticker);
      setStSec(-1);
      setStAttempt(0);
      setStBusy(false);
    }
  }

    function resetAll() {
    setStep(1); setComps([]); setSel([]); setStrats([]); setPrice(""); setFx(null);
    setCompErr(""); setStErr(""); setCompStr(""); setStStr("");
  }

  const regP  = parseFloat(price)||0;
  const discP = regP*(1-disc/100);
  const tot   = discP*(crat/100);
  const pSum  = cpct.mfg+cpct.cont+cpct.box || 1;
  const mfg   = tot*(cpct.mfg/pSum);
  const cont  = tot*(cpct.cont/pSum);
  const box   = tot*(cpct.box/pSum);
  const krw   = u => fx ? `₩${Math.round(u*fx).toLocaleString()}` : "—";
  const f2    = n => n.toFixed(2);
  const pp    = (k,v) => setCpct(p=>({...p,[k]:Math.max(0,Math.min(100,parseFloat(v)||0))}));

  const STEPS = ["제품 정보","경쟁사 조회","가격 전략","원가 설계"];

  return (
    <>
      <style>{style}</style>
      <div className="shell">
        <header className="hdr">
          <div className="eye">Glow Beast · North America Launch</div>
          <h1>Product <em>Pricing</em> Intelligence</h1>
          <p>경쟁사 분석 → 가격 전략 → 목표 원가 설계</p>
        </header>

        <div className="prog">
          {STEPS.map((s,i) => {
            const n=i+1, c=n<step?"done":n===step?"act":"";
            return (
              <div className="ps" key={s}>
                <div className={`pd ${c}`}>{n<step?"✓":n}</div>
                <div className={`pl ${c}`}>{s}</div>
              </div>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step===1 && (
          <div className="card">
            <div className="ctitle">제품 특성 입력</div>
            <div className="csub">기획 중인 화장품의 기본 정보를 입력해주세요</div>
            <div className="fg2">
              <div className="fld">
                <label>제품 카테고리</label>
                <select value={info.category} onChange={e=>setInfo(p=>({...p,category:e.target.value}))}>
                  <option value="">선택하세요</option>
                  {["Facial Mist / Spray","Facial Cleanser","Toner / Essence","Serum / Ampoule",
                    "Moisturizer / Cream","Sunscreen / SPF","Sheet Mask","Exfoliator / Scrub","Eye Cream","Body Lotion / Cream","기타"]
                    .map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="fld">
                <label>주요 성분</label>
                <input placeholder="예: Acai Berry, Niacinamide, Hyaluronic Acid"
                  value={info.ingredients} onChange={e=>setInfo(p=>({...p,ingredients:e.target.value}))}/>
              </div>
              <div className="fld">
                <label>용량</label>
                <div style={{display:"flex",gap:8}}>
                  <input type="number" placeholder="50" style={{flex:2}} value={info.volume}
                    onChange={e=>setInfo(p=>({...p,volume:e.target.value}))}/>
                  <select style={{flex:1}} value={info.unit} onChange={e=>setInfo(p=>({...p,unit:e.target.value}))}>
                    {["ml","g","oz","ea"].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="fld">
                <label>주요 판매 채널</label>
                <select value={info.channel} onChange={e=>setInfo(p=>({...p,channel:e.target.value}))}>
                  {["Amazon FBA","TikTok Shop","Amazon + TikTok Shop","Sephora","Ulta Beauty","Target","DTC (자사몰)"]
                    .map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="fg1">
              <div className="fld">
                <label>기타 특이사항 (선택)</label>
                <textarea rows={3} placeholder="예: 운동 후 피부 케어 특화, 비건 인증 등"
                  value={info.notes} onChange={e=>setInfo(p=>({...p,notes:e.target.value}))}/>
              </div>
            </div>
            <div className="brow">
              <button className="bp"
                disabled={!info.category||!info.ingredients||!info.volume||compBusy}
                onClick={doComps}>
                {compBusy ? <><span className="spin spin-sm"/>조회 중…</> : "경쟁사 분석 →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <div className="card">
            <div className="ctitle">북미 시장 경쟁 상품군</div>
            <div className="csub">비교 기준으로 삼을 제품을 선택하세요</div>

            {/* 조회 기준 요약 */}
            <div style={{background:"var(--warm)",border:"1px solid var(--bdr)",borderRadius:3,padding:"12px 16px",marginBottom:20,fontSize:12.5,lineHeight:1.7,color:"var(--ink)"}}>
              <span style={{fontWeight:600,fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",display:"block",marginBottom:5}}>조회 기준</span>
              <span style={{marginRight:16}}>📦 {info.category}</span>
              <span style={{marginRight:16}}>💧 {info.ingredients}</span>
              <span style={{marginRight:16}}>📏 {info.volume}{info.unit}</span>
              <span>🛒 {info.channel}</span>
              {info.notes && <span style={{display:"block",marginTop:4,color:"var(--muted)"}}>메모: {info.notes}</span>}
              <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid var(--bdr)",fontSize:11.5,color:"var(--muted)"}}>
                ⚠️ 용량이 다른 제품은 가격을 직접 비교하기 어렵습니다. 각 카드의 <strong>단위 환산가</strong>를 참고해 주세요.
              </div>
            </div>

            {/* Loading — countdown + attempt indicator */}
            {compBusy && (
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--warm)",border:"1px solid var(--bdr)",borderRadius:3,padding:"12px 16px",marginBottom:comps.length>0?12:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span className="spin" style={{flexShrink:0}}/>
                    <div>
                      <div style={{fontWeight:500,fontSize:14}}>
                        {compAttempt===2 ? "2차 조회 중… (결과 보완)" : "북미 시장 경쟁사 분석 중…"}
                      </div>
                      <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>
                        {comps.length>0 ? `${comps.length}개 확인됨 · 최소 5개까지 조회` : "제품이 분석되는 순서대로 나타납니다"}
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:compSec<=10?"var(--coral)":"var(--ink)",lineHeight:1}}>{Math.max(0,compSec)}s</div>
                    <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".05em"}}>남은 시간</div>
                  </div>
                </div>
                <div style={{height:3,background:"var(--bdr)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",background:"var(--coral)",borderRadius:2,transition:"width .9s linear",width:`${Math.min(100,(1-Math.max(0,compSec)/60)*100)}%`}}/>
                </div>
              </div>
            )}
            {/* 조회 완료 배너 — 로딩 끝난 직후 결과 개수 표시 */}
            {!compBusy && compSec===-1 && comps.length>0 && !compErr && (
              <div style={{display:"flex",alignItems:"center",gap:10,background:"#f0faf5",border:"1px solid #b8e6cf",borderRadius:3,padding:"10px 14px",marginBottom:16,fontSize:13}}>
                <span style={{fontSize:16}}>✓</span>
                <span style={{color:"#1a7a4a",fontWeight:500}}>조회 완료 — {comps.length}개 제품을 찾았습니다</span>
                {comps.length < 5 && (
                  <span style={{color:"var(--muted)",fontSize:12,marginLeft:4}}>(기준 5개 미달 · 아래에서 직접 추가 가능)</span>
                )}
              </div>
            )}

            {!compBusy && compErr && (
              <>
                <div className="errbox"><strong>조회 실패</strong><br/>{compErr}</div>
                <div className="brow">
                  <button className="bp" onClick={doComps}>↻ 다시 시도</button>
                  <button className="bs" onClick={()=>setStep(1)}>← 정보 수정</button>
                </div>
              </>
            )}

            {!compErr && comps.length>0 && (
              <>
                <div className="clist">
                  {comps.map(c=>(
                    <div key={cid(c)} style={{marginBottom:10}}>
                      {/* 선택 영역 — 클릭하면 체크박스 토글 */}
                      <div className={`citem ${sel.includes(cid(c))?"sel":""}`}
                        style={{marginBottom:0,borderBottomLeftRadius:0,borderBottomRightRadius:0,borderBottom:"none"}}
                        onClick={()=>tog(cid(c))}>
                        <input type="checkbox" checked={sel.includes(cid(c))} onChange={()=>{}}
                          style={{marginTop:2,accentColor:"var(--coral)",width:16,height:16,flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div className="cname">{c.brand} — {c.product}</div>
                          <div className="cmeta">
                            {c.volume_ml ? `${c.volume_ml}ml` : c.volume}
                            {" · "}{c.channel}{" · "}{c.positioning}
                          </div>
                          {c.volume_ml && c.price_usd && (
                            <div style={{marginTop:4,fontSize:11,color:"var(--gold)",fontWeight:500}}>
                              100ml당 ${((c.price_usd/c.volume_ml)*100).toFixed(2)}
                              {Math.abs(c.volume_ml - parseFloat(info.volume)) > 20
                                ? <span style={{color:"var(--muted)",fontWeight:400,marginLeft:6}}>(우리 제품 {info.volume}{info.unit}과 용량 다름)</span>
                                : <span style={{color:"#3a9e6a",fontWeight:400,marginLeft:6}}>✓ 유사 용량</span>}
                            </div>
                          )}
                        </div>
                        <div className="cprice" style={{alignSelf:"flex-start"}}>${c.price_usd}</div>
                      </div>
                      {/* Amazon 링크 — window.open으로 새창 (sandbox에서 <a> 차단됨) */}
                      <div style={{background:"#fafaf8",border:"1px solid var(--bdr)",borderTop:"none",borderBottomLeftRadius:3,borderBottomRightRadius:3,padding:"7px 14px"}}>
                        <button
                          onClick={()=>window.open(c.amazon_url,"_blank","noopener,noreferrer")}
                          style={{fontSize:11,fontWeight:500,color:"#c45500",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit"}}>
                          🛒 Amazon에서 보기 ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="brow">
                  <button className="bs" onClick={()=>setStep(1)}>← 다시 입력</button>
                  <button className="bp" disabled={sel.length===0}
                    onClick={()=>{ setStep(3); doStrats(); }}>
                    선택 완료 ({sel.length}개) →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div className="card">
            <div className="ctitle">가격 전략 설정</div>
            <div className="csub">포지셔닝 전략을 선택하거나 직접 정상 판매가를 입력하세요</div>

            <div style={{marginBottom:22}}>
              <div className="slbl">선택한 경쟁사 ({sel.length}개)</div>
              {comps.filter(c=>sel.includes(cid(c))).map(c=>(
                <div key={cid(c)} className="spill">
                  <span className="spkey">{c.brand} — {c.product}</span>
                  <span className="spval">${c.price_usd}</span>
                </div>
              ))}
            </div>

            <div className="tabs">
              {[["comp","경쟁사 기준"],["strategy","포지셔닝 전략"],["manual","직접 입력"]].map(([k,v])=>(
                <button key={k} className={`tab ${tab===k?"act":""}`} onClick={()=>setTab(k)}>{v}</button>
              ))}
            </div>

            {tab==="comp" && (
              <div className="clist">
                {comps.filter(c=>sel.includes(cid(c))).map(c=>(
                  <div key={cid(c)} className={`citem ${price===String(c.price_usd)?"sel":""}`}
                    onClick={()=>setPrice(String(c.price_usd))}>
                    <input type="radio" checked={price===String(c.price_usd)} onChange={()=>{}}
                      style={{accentColor:"var(--coral)",width:16,height:16,marginTop:2,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div className="cname">{c.brand} — {c.product}</div>
                      <div className="cmeta">{c.positioning}</div>
                    </div>
                    <div className="cprice">${c.price_usd}</div>
                  </div>
                ))}
              </div>
            )}

            {tab==="strategy" && (
              stErr ? (
                <>
                  <div className="errbox"><strong>전략 생성 실패</strong><br/>{stErr}</div>
                  <button className="bp" onClick={doStrats}>↻ 다시 시도</button>
                </>
              ) : (
                <>
                  {stBusy && (
                    <div style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--warm)",border:"1px solid var(--bdr)",borderRadius:3,padding:"10px 14px",marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span className="spin spin-sm" style={{flexShrink:0,display:"inline-block"}}/>
                          <div>
                            <div style={{fontWeight:500,fontSize:13}}>
                              {stAttempt===2 ? "2차 분석 중… (전략 보완)" : "포지셔닝 전략 분석 중…"}
                            </div>
                            <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>
                              {strats.length>0 ? `${strats.length}개 확인됨 · 최소 3개까지 분석` : "전략이 분석되는 순서대로 나타납니다"}
                            </div>
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,color:stSec<=10?"var(--coral)":"var(--ink)",lineHeight:1}}>{Math.max(0,stSec)}s</div>
                          <div style={{fontSize:10,color:"var(--muted)"}}>남은 시간</div>
                        </div>
                      </div>
                      <div style={{height:2,background:"var(--bdr)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",background:"var(--gold)",borderRadius:2,transition:"width .9s linear",width:`${Math.min(100,(1-Math.max(0,stSec)/60)*100)}%`}}/>
                      </div>
                    </div>
                  )}
                  {!stBusy && stSec===-1 && strats.length>0 && !stErr && (
                    <div style={{display:"flex",alignItems:"center",gap:10,background:"#f0faf5",border:"1px solid #b8e6cf",borderRadius:3,padding:"9px 13px",marginBottom:14,fontSize:13}}>
                      <span style={{fontSize:15}}>✓</span>
                      <span style={{color:"#1a7a4a",fontWeight:500}}>분석 완료 — {strats.length}개 전략을 도출했습니다</span>
                      {strats.length < 3 && (
                        <span style={{color:"var(--muted)",fontSize:12,marginLeft:4}}>(기준 3개 미달)</span>
                      )}
                    </div>
                  )}
                  <div className="stlist">
                    {strats.map((s,i)=>(
                      <div key={i} className={`stcard ${selSt===i?"sel":""}`}
                        onClick={()=>{ setSelSt(i); setPrice(String(s.suggested_price)); }}>
                        <div className="stname">{s.name}</div>
                        <div className="stdesc">{s.description}</div>
                        <div className="stdesc" style={{fontStyle:"italic",marginTop:4}}>{s.rationale}</div>
                        <div className="stprice">권장가: ${s.suggested_price}</div>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}

            {tab==="manual" && (
              <div className="fld" style={{maxWidth:220}}>
                <label>정상 판매가 (USD)</label>
                <input type="number" step="0.01" placeholder="22.00"
                  value={price} onChange={e=>setPrice(e.target.value)}/>
              </div>
            )}

            <hr className="divider"/>
            <div className="slbl">설정된 정상 판매가</div>
            {price ? (
              <div className="pdisp">
                <div className="plbl">Regular Price (USD)</div>
                <div className="pval">${parseFloat(price).toFixed(2)}</div>
                <div className="pnote">북미 시장 정상 판매가</div>
              </div>
            ) : (
              <div style={{color:"var(--muted)",fontSize:14,padding:"14px 0"}}>위 탭에서 가격을 선택하거나 직접 입력하세요</div>
            )}

            <div className="brow">
              <button className="bs" onClick={()=>setStep(2)}>← 경쟁사 재선택</button>
              <button className="bp" disabled={!price} onClick={()=>setStep(4)}>원가 구조 설계 →</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step===4 && (
          <div className="card">
            <div className="ctitle">목표 원가 구조</div>
            <div className="csub">할인가 기준으로 제조 단계의 목표 원가를 설계합니다</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
              <div className="spill">
                <span className="spkey">정상 판매가</span>
                <span className="spval">${f2(regP)}</span>
              </div>
              <div className="spill">
                <span className="spkey">평균 할인 판매가</span>
                <span className="spval" style={{color:"var(--coral)"}}>${f2(discP)}</span>
              </div>
            </div>

            <div className="slbl">할인율 조정</div>
            <div className="slwrap">
              <div className="slhdr"><span>할인율</span><span className="slval">{disc}%</span></div>
              <input type="range" min={0} max={60} value={disc} onChange={e=>setDisc(+e.target.value)}/>
            </div>

            <hr className="divider"/>
            <div className="slbl">원가 비율 조정 (할인 판매가 대비)</div>
            <div className="slwrap">
              <div className="slhdr"><span>목표 원가 비율</span><span className="slval">{crat}%</span></div>
              <input type="range" min={5} max={50} value={crat} onChange={e=>setCrat(+e.target.value)}/>
            </div>

            <div className="tcbar">
              <div>
                <div className="tl">목표 합계 원가</div>
                <div className="tv">${f2(tot)}</div>
                <div className="tk">{fxBusy ? "환율 조회 중…" : krw(tot)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="tl">할인 판매가의 {crat}%</div>
                <div style={{fontSize:13,opacity:.5,marginTop:4}}>${f2(discP)} × {crat}%</div>
              </div>
            </div>

            <hr className="divider"/>
            <div className="slbl">항목별 비중 조정</div>
            <div className="pgrid">
              {[["mfg","제조 원가"],["cont","용기"],["box","단상자"]].map(([k,l])=>(
                <div className="pitem" key={k}>
                  <label>{l} (%)</label>
                  <input type="number" min={0} max={100} value={cpct[k]}
                    onChange={e=>pp(k,e.target.value)}/>
                </div>
              ))}
            </div>
            {Math.abs(pSum-100)>0.5 ? (
              <div className="pwarn" style={{background:"#fff3f2",border:"1px solid #f5c6c0",borderRadius:3,padding:"10px 14px",marginTop:10}}>
                ⚠️ 현재 합계: <strong>{pSum.toFixed(1)}%</strong> — 합계가 100%가 아닙니다, 수정해 주세요.<br/>
                <span style={{fontSize:11,opacity:.75}}>합계가 100%가 아닌 경우 비례 배분으로 자동 계산됩니다.</span>
              </div>
            ) : (
              <div style={{fontSize:12,color:"#3a9e6a",background:"#f0faf5",border:"1px solid #b8e6cf",borderRadius:3,padding:"8px 14px",marginTop:10}}>
                ✓ 합계 100% — 정상
              </div>
            )}

            <div className="slbl" style={{marginTop:22}}>항목별 목표 원가</div>
            <div className="cgrid">
              {[["제조 원가",mfg,cpct.mfg],["용기",cont,cpct.cont],["단상자",box,cpct.box]].map(([l,v,p])=>(
                <div className="cbox" key={l}>
                  <div className="cblbl">{l}</div>
                  <div className="cbusd">${f2(v)}</div>
                  <div className="cbkrw">{fxBusy?"조회 중…":krw(v)}</div>
                  <div className="cbpct">{((p/pSum)*100).toFixed(1)}%</div>
                </div>
              ))}
            </div>

            {fx && <div className="fxnote">적용 환율: 1 USD = ₩{fx.toLocaleString()} KRW &nbsp;|&nbsp; 기준: {fxLbl}</div>}

            <div className="brow">
              <button className="bs" onClick={()=>setStep(3)}>← 가격 재설정</button>
              <button className="bs" onClick={resetAll}>처음부터 다시</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
