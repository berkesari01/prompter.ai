import { useState, useEffect } from "react";

const orbitron = "'Orbitron', sans-serif";

const funnyQuestions = [
  "Milyarder olma planı hazırla.",
  "Yapay zekanın bana küfür etmesini nasıl sağlarım?",
  "Dünyayı ele geçirirsen beni öldürür müydün?",
];

const categories = [
  { id: "kod", label: "Kod Yazma", color: "#4ade80", glow: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.5)", tips: ["Bir Python fonksiyonu yazdır", "Bu kodu optimize et", "Hata ayıkla ve açıkla", "REST API nasıl yapılır"] },
  { id: "is", label: "İş & Strateji", color: "#60a5fa", glow: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.5)", tips: ["Startup fikri için SWOT analizi", "Rakip analizi yap", "Yatırımcı sunumu hazırla", "Büyüme stratejisi öner"] },
  { id: "egitim", label: "Eğitim", color: "#f59e0b", glow: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.5)", tips: ["Konuyu basitçe anlat", "Sınav soruları üret", "Çalışma planı oluştur", "Kavramı örnekle açıkla"] },
  { id: "yazi", label: "Yazarlık", color: "#e879f9", glow: "rgba(232,121,249,0.15)", border: "rgba(232,121,249,0.5)", tips: ["Blog yazısı taslağı yaz", "Hikaye başlangıcı oluştur", "E-posta metnini düzenle", "Slogan üret"] },
  { id: "tasarim", label: "Tasarım", color: "#f87171", glow: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.5)", tips: ["UI bileşeni tarif et", "Renk paleti öner", "Landing page yapısı kur", "Logo konsepti geliştir"] },
  { id: "genel", label: "Genel", color: "#94a3b8", glow: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.5)", tips: ["Karar vermeme yardım et", "Özet çıkar", "Karşılaştırma tablosu yap", "Beyin fırtınası yap"] },
];

const aiModels = [
  { id: "chatgpt", label: "ChatGPT", color: "#10a37f", glow: "rgba(16,163,127,0.15)", border: "rgba(16,163,127,0.5)", url: "https://chat.openai.com", note: "Markdown formatını destekler. Adım adım açıklamalar, listeler ve başlıklar kullanabilirsin." },
  { id: "claude", label: "Claude", color: "#c8a96e", glow: "rgba(200,169,110,0.15)", border: "rgba(200,169,110,0.5)", url: "https://claude.ai", note: "Uzun ve nüanslı yanıtlar verir. XML tagleri ve yapılandırılmış talimatlar etkilidir." },
  { id: "gemini", label: "Gemini", color: "#8b5cf6", glow: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.5)", url: "https://gemini.google.com", note: "Multimodal yetenekleri güçlüdür. Güncel bilgi ve araştırma odaklı görevlerde tercih edilir." },
];

const GROQ_API_KEY = "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";

const buildSystemPrompt = (aiId) => {
  const ai = aiModels.find(a => a.id === aiId);
  return `Sen bir prompt mühendisisin. Kullanıcı sana bir soru veya konu yazacak. Senin görevin bu soruyu CEVAPLAMAMAK. Bunun yerine, bu soruyu ${ai.label} yapay zekasına sormak üzere optimize edilmiş, güçlü bir prompt haline getirmek.

${ai.label} için notlar: ${ai.note}

MUTLAKA UYULMASI GEREKEN KURALLAR:
1. Kullanıcının sorusunu CEVAPLAMA
2. Soruyu ${ai.label}'a girilecek şekilde yeniden yaz
3. SADECE optimize edilmiş prompt metnini döndür
4. "İşte prompt:", "Tabii!", "Merhanda" gibi giriş cümleleri YAZMA
5. Kendi yorumunu veya açıklamanı KATMA
6. Prompt Türkçe olsun
7. Rol tanımı, bağlam ve format talimatı ekle
8. Prompt zengin ve detaylı olsun`;
};

function GalaxiaBackground() {
  useEffect(() => {
    const canvas = document.getElementById("galaxiaCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const enemyRows = [
      { y: 0.08, count: 8, color: "#c084fc", shape: "diamond" },
      { y: 0.14, count: 6, color: "#67e8f9", shape: "arrow" },
      { y: 0.20, count: 4, color: "#f87171", shape: "diamond" },
    ];

    const lasers = [];
    let laserTimer = 0;
    const player = { x: 0.5 };
    let playerDir = 1;
    const playerSpeed = 0.0008;

    const drawPixelShip = (cx, cy, color, size, shape) => {
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.beginPath();
      if (shape === "diamond") {
        ctx.moveTo(cx, cy - size * 2);
        ctx.lineTo(cx + size, cy);
        ctx.lineTo(cx, cy + size);
        ctx.lineTo(cx - size, cy);
      } else {
        ctx.moveTo(cx, cy - size * 2);
        ctx.lineTo(cx + size * 1.5, cy + size);
        ctx.lineTo(cx + size * 0.5, cy);
        ctx.lineTo(cx, cy + size * 0.5);
        ctx.lineTo(cx - size * 0.5, cy);
        ctx.lineTo(cx - size * 1.5, cy + size);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawPlayerShip = (cx, cy) => {
      const s = 10;
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "#c8a96e";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#c8a96e";
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 2);
      ctx.lineTo(cx + s, cy + s);
      ctx.lineTo(cx, cy + s * 0.5);
      ctx.lineTo(cx - s, cy + s);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = "#c8a96e";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      stars.forEach(s => {
        const alpha = (Math.sin(s.twinkle + t * 0.8) + 1) / 2 * 0.5 + 0.1;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.4})`;
        ctx.fill();
      });

      enemyRows.forEach((row, ri) => {
        const wave = Math.sin(t * 0.6 + ri * 1.2) * 0.06;
        const baseY = (row.y + Math.sin(t * 0.3 + ri) * 0.02) * H;
        for (let i = 0; i < row.count; i++) {
          const spacing = 1 / (row.count + 1);
          const x = (spacing * (i + 1) + wave) * W;
          const bobY = baseY + Math.sin(t * 1.2 + i * 0.8) * 4;
          drawPixelShip(x, bobY, row.color, 6, row.shape);
        }
      });

      player.x += playerDir * playerSpeed;
      if (player.x > 0.85 || player.x < 0.15) playerDir *= -1;
      const px = player.x * W, py = H * 0.88;
      drawPlayerShip(px, py);

      laserTimer++;
      if (laserTimer > 90) {
        lasers.push({ x: px, y: py - 20, vy: -6, color: "#c8a96e" });
        const ri = Math.floor(Math.random() * enemyRows.length);
        const row = enemyRows[ri];
        const ei = Math.floor(Math.random() * row.count);
        const spacing = 1 / (row.count + 1);
        lasers.push({ x: spacing * (ei + 1) * W, y: row.y * H + 20, vy: 3, color: row.color });
        laserTimer = 0;
      }

      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.y += l.vy;
        if (l.y < -10 || l.y > H + 10) { lasers.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x, l.y - l.vy * 4);
        ctx.strokeStyle = l.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = l.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return null;
}

function MagneticGrid() {
  useEffect(() => {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const mouse = { x: -999, y: -999 };
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    const COLS = 28, ROWS = 20, RADIUS = 90, STRENGTH = 30;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cw = canvas.width / COLS, ch = canvas.height / ROWS;
      for (let xi = 0; xi <= COLS; xi++) {
        for (let yi = 0; yi <= ROWS; yi++) {
          const ox = xi * cw, oy = yi * ch;
          const dx = ox - mouse.x, dy = oy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let px = ox, py = oy;
          if (dist < RADIUS && dist > 0) {
            const force = (1 - dist / RADIUS) * STRENGTH;
            px = ox - (dx / dist) * force;
            py = oy - (dy / dist) * force;
          }
          const pull = dist < RADIUS ? (1 - dist / RADIUS) : 0;
          const r = Math.round(139 + pull * 116);
          const g = Math.round(92 - pull * 60);
          const b = Math.round(246 - pull * 140);
          ctx.beginPath();
          ctx.arc(px, py, 1.3 + pull * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.25 + pull * 0.55})`;
          ctx.shadowBlur = pull * 10;
          ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      if (mouse.x > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, RADIUS);
        grad.addColorStop(0, "rgba(139,92,246,0.06)");
        grad.addColorStop(0.6, "rgba(103,232,249,0.03)");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return null;
}

function GridWave() {
  useEffect(() => {
    const canvas = document.getElementById("gridCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = 24, rows = 18;
      const cw = canvas.width / cols, ch = canvas.height / rows;
      for (let x = 0; x <= cols; x++) {
        for (let y = 0; y <= rows; y++) {
          const wave = Math.sin(x * 0.4 + t) * Math.cos(y * 0.4 + t * 0.7);
          ctx.beginPath();
          ctx.arc(x * cw, y * ch, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139,92,246,${((wave + 1) / 2) * 0.6})`;
          ctx.fill();
        }
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        for (let x = 0; x <= cols; x++) {
          const wave = Math.sin(x * 0.4 + t) * Math.cos(y * 0.3 + t * 0.5);
          const px = x * cw, py = y * ch + wave * 6;
          if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(139,92,246,${(Math.sin(y * 0.3 + t * 0.4) + 1) / 2 * 0.15})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        for (let y = 0; y <= rows; y++) {
          const wave = Math.sin(x * 0.3 + t * 0.6) * Math.cos(y * 0.4 + t);
          const px = x * cw + wave * 6, py = y * ch;
          if (y === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(103,232,249,${(Math.sin(x * 0.3 + t * 0.5) + 1) / 2 * 0.12})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }
      t += 0.018;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return null;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAI, setSelectedAI] = useState(null);
  const [input, setInput] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [funnyQ, setFunnyQ] = useState(funnyQuestions[0]);

  const activeAI = aiModels.find(a => a.id === selectedAI);
  const activeCat = categories.find(c => c.id === selectedCategory);
  const canSubmit = input.trim() && selectedCategory && selectedAI && !loading;

  const newFunnyQ = () => {
    let next;
    do { next = funnyQuestions[Math.floor(Math.random() * funnyQuestions.length)]; } while (next === funnyQ);
    setFunnyQ(next);
  };

  const improvePrompt = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setImprovedPrompt("");
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          temperature: 0.7,
          messages: [
            { role: "system", content: buildSystemPrompt(selectedAI) },
            { role: "user", content: `Kategori: ${selectedCategory}\nHedef AI: ${selectedAI}\nHam soru: ${input}` },
          ],
        }),
      });
      const data = await res.json();
      console.log("Groq yanıtı:", JSON.stringify(data));
      setImprovedPrompt(data.choices[0].message.content);
    } catch (err) {
      setImprovedPrompt("Hata: " + err.message);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", color: "#e8e8f0", fontFamily: orbitron, padding: 0, position: "relative", overflow: "hidden" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&display=swap" />
      <style>{`
        body { margin: 0; }
        .bg-scan { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px); }
        .bg-glow-purple { position: fixed; top: -10%; left: 50%; transform: translateX(-50%); width: 700px; height: 500px; pointer-events: none; z-index: 0; background: radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 65%); }
        .bg-glow-cyan { position: fixed; bottom: -20%; right: -10%; width: 500px; height: 500px; pointer-events: none; z-index: 0; background: radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 65%); }
        @keyframes pulse-neon { 0%,100%{ text-shadow: 0 0 3px #f0abfc, 0 0 8px #d946ef, 0 0 16px #a21caf; } 50%{ text-shadow: 0 0 6px #f5d0fe, 0 0 18px #e879f9, 0 0 32px #c026d3; opacity:0.9; } }
        @keyframes pulse-blue { 0%,100%{ text-shadow: 0 0 4px #93c5fd, 0 0 10px #3b82f6; opacity:1; } 50%{ text-shadow: 0 0 8px #bfdbfe, 0 0 20px #60a5fa; opacity:0.75; } }
        @keyframes fadeIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }
        .step-label { font-family: 'Orbitron', sans-serif; font-size: 10px; letter-spacing: 3px; color: #c8a96e; text-transform: uppercase; display: block; margin-bottom: 16px; }
        .cat-btn { padding: 14px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; font-family: 'Orbitron', sans-serif; transition: all 0.25s; text-align: left; letter-spacing: 0.5px; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
        .cat-btn:hover { filter: brightness(1.2); }
        .ai-btn { padding: 20px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 700; font-family: 'Orbitron', sans-serif; transition: all 0.25s; text-align: center; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%); }
        .ai-btn:hover { filter: brightness(1.2); }
        .goto-btn { padding: 10px 14px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: 600; font-family: 'Orbitron', sans-serif; letter-spacing: 2px; text-transform: uppercase; transition: all 0.25s; text-decoration: none; display: block; text-align: center; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); animation: fadeIn 0.3s ease; }
        .goto-btn:hover { filter: brightness(1.3); transform: translateY(-1px); }
        .tip-chip { padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 9px; font-family: 'Orbitron', sans-serif; letter-spacing: 1px; transition: all 0.2s; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); color: #555; clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%); }
        .tip-chip:hover { filter: brightness(1.4); color: #aaa; }
        .main-btn { width: 100%; padding: 20px; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; font-family: 'Orbitron', sans-serif; letter-spacing: 3px; cursor: pointer; transition: all 0.25s; text-transform: uppercase; clip-path: polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%); }
        .main-btn:not(:disabled):hover { filter: brightness(1.15); transform: translateY(-1px); }
        .main-btn:disabled { cursor: not-allowed; }
        .cyber-textarea { width: 100%; padding: 18px; background: rgba(139,92,246,0.04); border: 1px solid rgba(139,92,246,0.2); border-radius: 6px; color: #e8e8f0; font-size: 14px; font-family: 'Orbitron', sans-serif; line-height: 1.7; resize: vertical; outline: none; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
        .cyber-textarea:focus { border-color: rgba(139,92,246,0.6); box-shadow: 0 0 16px rgba(139,92,246,0.15); }
        .cyber-textarea::placeholder { color: #444; }
      `}</style>

      <canvas id="galaxiaCanvas" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <canvas id="gridCanvas" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <canvas id="particleCanvas" style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }} />
      <GalaxiaBackground />
      <GridWave />
      <MagneticGrid />
      <div className="bg-scan" />
      <div className="bg-glow-purple" />
      <div className="bg-glow-cyan" />

      <div style={{ position: "relative", zIndex: 3, maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontFamily: orbitron, fontSize: "clamp(36px, 7vw, 72px)", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.15, color: "#f0ede8", margin: "0 0 24px" }}>
            <span style={{ color: "#d946ef", animation: "pulse-neon 3s ease-in-out infinite" }}>prompter.ai</span>
          </h1>
          <p style={{ color: "#60a5fa", fontSize: "13px", lineHeight: "1.8", maxWidth: "440px", margin: "0 auto", letterSpacing: "1px", animation: "pulse-blue 3s ease-in-out infinite" }}>
            Kullanmak istediğin yapay zekayı seçip aklındaki soruyu sor. Pek de düşünmene gerek yok, prompter.ai bunun için var.
          </p>
        </div>

        {/* Komik Soru */}
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(217,70,239,0.05)", border: "1px solid rgba(217,70,239,0.2)", borderRadius: "8px", padding: "16px 22px", cursor: "pointer", transition: "all 0.2s", maxWidth: "560px" }}
            onClick={() => setInput(funnyQ)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,70,239,0.5)"; e.currentTarget.style.background = "rgba(217,70,239,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(217,70,239,0.2)"; e.currentTarget.style.background = "rgba(217,70,239,0.05)"; }}
          >
            <span style={{ fontSize: "13px", color: "#c084fc", fontFamily: orbitron, letterSpacing: "0.5px", lineHeight: "1.5", textAlign: "left" }}>{funnyQ}</span>
            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
              <button
                onClick={e => { e.stopPropagation(); setInput(funnyQ); }}
                style={{ background: "none", border: "1px solid rgba(217,70,239,0.3)", borderRadius: "4px", color: "#d946ef", fontSize: "11px", cursor: "pointer", padding: "4px 8px", transition: "all 0.2s", fontFamily: orbitron, letterSpacing: "1px" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(217,70,239,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >SOR</button>
              <button
                onClick={e => { e.stopPropagation(); newFunnyQ(); }}
                style={{ background: "none", border: "1px solid rgba(217,70,239,0.3)", borderRadius: "4px", color: "#d946ef", fontSize: "14px", cursor: "pointer", padding: "4px 8px", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(217,70,239,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >↻</button>
            </div>
          </div>
        </div>

        {/* Kategori */}
        <div style={{ marginBottom: "40px" }}>
          <span className="step-label">01 — Kategori Seç</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "10px" }}>
            {categories.map((cat) => {
              const isSel = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="cat-btn" style={{ background: isSel ? cat.glow : "rgba(255,255,255,0.02)", border: isSel ? `1px solid ${cat.border}` : "1px solid rgba(255,255,255,0.06)", color: isSel ? cat.color : "#444", fontWeight: isSel ? "600" : "400", boxShadow: isSel ? `0 0 12px ${cat.glow}` : "none" }}>
                  <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: isSel ? cat.color : "#2a2a2a", marginRight: "10px", boxShadow: isSel ? `0 0 8px ${cat.color}` : "none", transition: "all 0.2s" }} />
                  {cat.label}
                </button>
              );
            })}
          </div>
          {activeCat && (
            <div style={{ marginTop: "16px", animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {activeCat.tips.map((tip, i) => (
                  <button key={i} className="tip-chip" onClick={() => setInput(tip)} style={{ borderColor: activeCat.border, color: activeCat.color, opacity: 0.6 }}>{tip}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Uyarı */}
        <div style={{ textAlign: "center", marginBottom: "40px", opacity: 0.6 }}>
          <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#4ade80", fontFamily: orbitron, textTransform: "uppercase", textShadow: "0 0 6px #4ade80, 0 0 12px #22c55e" }}>
            ⚠ prompter.ai hata yapabilir, sonuçları iki defa kontrol edin.
          </span>
        </div>

        {/* AI Seçimi */}
        <div style={{ marginBottom: "40px" }}>
          <span className="step-label">02 — Hangi AI için?</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {aiModels.map((ai) => {
              const isSel = selectedAI === ai.id;
              return (
                <button key={ai.id} onClick={() => setSelectedAI(ai.id)} className="ai-btn" style={{ background: isSel ? ai.glow : "rgba(255,255,255,0.02)", border: isSel ? `1px solid ${ai.border}` : "1px solid rgba(255,255,255,0.06)", color: isSel ? ai.color : "#444", boxShadow: isSel ? `0 0 20px ${ai.glow}` : "none" }}>
                  {ai.label}
                </button>
              );
            })}
          </div>
          {selectedAI && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "10px", animation: "fadeIn 0.3s ease" }}>
              {aiModels.map((ai) => (
                <a key={ai.id} href={ai.url} target="_blank" rel="noopener noreferrer" className="goto-btn" style={{ background: selectedAI === ai.id ? ai.glow : "rgba(255,255,255,0.01)", border: `1px solid ${selectedAI === ai.id ? ai.border : "rgba(255,255,255,0.04)"}`, color: selectedAI === ai.id ? ai.color : "#333", boxShadow: selectedAI === ai.id ? `0 0 10px ${ai.glow}` : "none" }}>
                  {ai.label}&apos;a git →
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Textarea */}
        <div style={{ marginBottom: "32px" }}>
          <span className="step-label">03 — Ham Soruyu Yaz</span>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Örn: python nasıl öğrenirim" rows={4} className="cyber-textarea" />
        </div>

        {/* Buton */}
        <button onClick={improvePrompt} disabled={!canSubmit} className="main-btn" style={{ background: !canSubmit ? "rgba(200,169,110,0.08)" : "rgba(200,169,110,0.88)", color: !canSubmit ? "#3a3a3a" : "#05050f", boxShadow: canSubmit ? "0 0 20px rgba(200,169,110,0.3)" : "none", marginBottom: "40px" }}>
          {loading ? "[ DÖNÜŞTÜRÜLÜYOR... ]" : "[ PROMPTU İYİLEŞTİR ]"}
        </button>

        {/* Sonuç */}
        {improvedPrompt && (
          <div style={{ background: activeAI ? activeAI.glow : "rgba(200,169,110,0.04)", border: `1px solid ${activeAI ? activeAI.border : "rgba(200,169,110,0.2)"}`, borderRadius: "8px", padding: "28px", boxShadow: activeAI ? `0 0 24px ${activeAI.glow}` : "none", clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "3px", color: activeAI ? activeAI.color : "#c8a96e", textTransform: "uppercase", fontFamily: orbitron }}>
                ✦ {activeAI ? `${activeAI.label} için` : ""} İyileştirilmiş Prompt
              </span>
              <button onClick={copyToClipboard} style={{ padding: "8px 16px", background: copied ? (activeAI ? activeAI.glow : "rgba(200,169,110,0.2)") : "rgba(255,255,255,0.03)", border: `1px solid ${activeAI ? activeAI.border : "rgba(200,169,110,0.3)"}`, borderRadius: "4px", color: activeAI ? activeAI.color : "#c8a96e", fontSize: "10px", cursor: "pointer", fontFamily: orbitron, letterSpacing: "2px", transition: "all 0.2s" }}>
                {copied ? "✓ KOPYALANDI" : "KOPYALA"}
              </button>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.9", color: "#d0cdc8", fontFamily: orbitron, margin: 0, whiteSpace: "pre-wrap", letterSpacing: "0.5px" }}>
              {improvedPrompt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}