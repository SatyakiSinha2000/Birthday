const { useState, useEffect, useRef } = React;

const CONFIG = {
  name: "My Love",
  age: 26,
  pin: "0610",
  hint: "Her birthday: 6th October → 0610",
  birthday: { month: 9, day: 6 }, // October (0-indexed), 6
  puzzleImage: "https://placehold.co/360x360/ff6b9d/ffffff?text=Her+Photo",
  memories: [
    { src: "https://placehold.co/500x350/ff8fab/ffffff?text=Photo+1" },
    { src: "https://placehold.co/500x350/ffb3c6/ffffff?text=Photo+2" },
    { src: "https://placehold.co/500x350/ff6b9d/ffffff?text=Photo+3" },
    { src: "https://placehold.co/500x350/ffc2d1/ffffff?text=Photo+4" },
  ],
  wishes: [
    "May God bless you with endless joy 🙏",
    "Wishing you health, peace and success ✨",
    "May all your dreams come true 🌟",
    "May every day bring you a new smile 😊",
    "Happy Birthday — have a blessed year 🎉",
  ],
  letter: [
    "Dear Birthday Girl,",
    "",
    "On this special day, I wish you all the happiness",
    "the world has to offer.",
    "",
    "May God shower you with good health,",
    "peace of mind and endless blessings.",
    "",
    "May every candle you blow bring a wish come true,",
    "and may this year be your brightest one yet.",
    "",
    "Happy 26th Birthday! 🎂✨",
    "",
    "— With warmest wishes.",
  ],
};

function App() {
  const [stage, setStage] = useState("gift"); // gift, pin, curtain, intro, cake, memories, wishes, puzzle, scratch, letter, done
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [giftOpen, setGiftOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [memIdx, setMemIdx] = useState(0);
  const [poppedBalloons, setPoppedBalloons] = useState([]);
  const [revealedWishes, setRevealedWishes] = useState([]);
  const [letterLines, setLetterLines] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  // Happy Birthday melody via Web Audio (loops)
  useEffect(() => {
    if (!musicOn) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    audioRef.current = ctx;
    // Notes in Hz (Happy Birthday in C)
    const N = { C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, Bb4:466.16, B4:493.88, C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99 };
    const song = [
      // Happy birth-day to you
      ["G4",0.4],["G4",0.2],["A4",0.6],["G4",0.6],["C5",0.6],["B4",1.0],
      // Happy birth-day to you
      ["G4",0.4],["G4",0.2],["A4",0.6],["G4",0.6],["D5",0.6],["C5",1.0],
      // Happy birth-day dear ...
      ["G4",0.4],["G4",0.2],["G5",0.6],["E5",0.6],["C5",0.6],["B4",0.6],["A4",1.0],
      // Happy birth-day to you
      ["F5",0.4],["F5",0.2],["E5",0.6],["C5",0.6],["D5",0.6],["C5",1.2],
      ["rest",0.8],
    ];
    let t = ctx.currentTime + 0.2;
    let stopped = false;
    const master = ctx.createGain();
    master.gain.value = 0.15;
    master.connect(ctx.destination);
    const schedule = () => {
      if (stopped) return;
      song.forEach(([n, d]) => {
        if (n !== "rest") {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "triangle";
          o.frequency.value = N[n];
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.9, t + 0.03);
          g.gain.linearRampToValueAtTime(0.001, t + d * 0.95);
          o.connect(g); g.connect(master);
          o.start(t); o.stop(t + d);
        }
        t += d;
      });
      // loop
      setTimeout(schedule, (t - ctx.currentTime) * 1000 - 500);
    };
    schedule();
    return () => { stopped = true; try { ctx.close(); } catch(e){} };
  }, [musicOn]);

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // background particles
  const particles = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* rising glow particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((i) => {
          const left = (i * 37) % 100;
          const delay = (i * 0.4) % 8;
          const dur = 6 + ((i * 7) % 8);
          const size = 3 + (i % 5);
          const color = i % 3 === 0 ? "#ffd700" : i % 3 === 1 ? "#ff6b9d" : "#fff2a8";
          return (
            <span key={i} style={{
              position: "absolute", left: left + "%", bottom: "-20px",
              width: size, height: size, borderRadius: "50%",
              background: color, boxShadow: `0 0 ${size * 3}px ${color}`,
              animation: `rise ${dur}s linear ${delay}s infinite`,
              opacity: 0.85,
            }} />
          );
        })}
      </div>
      <div className="fixed inset-x-0 bottom-0 h-1/2 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(255,80,120,0.25), transparent 70%)" }} />
      <FloralDecor />

      <style>{`
        @keyframes rise { 0%{transform:translateY(0) scale(1);opacity:0} 10%{opacity:1} 100%{transform:translateY(-110vh) scale(0.3);opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes flame { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(1.15) scaleX(0.9)} }
        @keyframes fall { 0%{transform:translateY(-100vh) rotate(0)} 100%{transform:translateY(100vh) rotate(720deg)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(0);opacity:0} }
        @keyframes heartUp { 0%{transform:translate(-50%,0) scale(0.5);opacity:0} 20%{opacity:1} 100%{transform:translate(-50%,-200px) scale(1.4);opacity:0} }
        @keyframes sparkleOut { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
        @keyframes curtainL { to { transform:translateX(-100%) } }
        @keyframes curtainR { to { transform:translateX(100%) } }
      `}</style>

      {stage !== "gift" && stage !== "pin" && (
        <button onClick={() => setMusicOn(m => !m)} className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full bg-black/50 border border-pink-400/40 backdrop-blur flex items-center justify-center text-lg hover:bg-black/70" title="Toggle music">
          {musicOn ? "🎵" : "🔇"}
        </button>
      )}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        {stage === "gift" && <GiftScene mouse={mouse} open={giftOpen} onOpen={() => { setGiftOpen(true); setTimeout(() => setStage("pin"), 1600); }} />}
        {stage === "pin" && <PinScene pin={pin} setPin={setPin} error={pinError} hint={showHint} onSubmit={(v) => {
          if (v === CONFIG.pin) { setPinError(false); setMusicOn(true); setStage("curtain"); setTimeout(() => setCurtainOpen(true), 500); }
          else { setPinError(true); setShowHint(true); setPin(""); }
        }} />}
        {stage === "curtain" && <CurtainScene open={curtainOpen} onDone={() => setStage("intro")} />}
        {stage === "intro" && <IntroScene onNext={() => setStage("cake")} />}
        {stage === "cake" && <CakeScene confetti={confetti} onClick={() => { setConfetti(true); setTimeout(() => setStage("memories"), 2500); }} />}
        {stage === "memories" && <MemoriesScene idx={memIdx} setIdx={setMemIdx} onNext={() => setStage("wishes")} />}
        {stage === "wishes" && <WishesScene popped={poppedBalloons} setPopped={setPoppedBalloons} revealed={revealedWishes} setRevealed={setRevealedWishes} onNext={() => setStage("puzzle")} />}
        {stage === "puzzle" && <PuzzleScene onSolved={() => setStage("scratch")} />}
        {stage === "scratch" && <ScratchScene onRevealed={() => setStage("letter")} />}
        {stage === "letter" && <LetterScene open={letterOpen} setOpen={setLetterOpen} lines={letterLines} setLines={setLetterLines} onReplay={() => window.location.reload()} />}
      </div>
    </div>
  );
}

/* ---------------- FLORAL DECOR (Pink Orchids & Roses) ---------------- */
function Rose({ size = 60, hue = "#ff4d8d" }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}>
      <defs>
        <radialGradient id={`rg-${hue}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="35%" stopColor={hue} />
          <stop offset="100%" stopColor="#7a0033" />
        </radialGradient>
      </defs>
      <g>
        <path d="M50 88 C 20 82, 12 55, 30 42 C 18 30, 30 12, 50 18 C 70 12, 82 30, 70 42 C 88 55, 80 82, 50 88 Z" fill={hue} opacity="0.55" />
        <circle cx="50" cy="50" r="30" fill={`url(#rg-${hue})`} />
        <path d="M50 30 C 42 34, 40 46, 50 50 C 60 46, 58 34, 50 30 Z" fill="#fff" opacity="0.35" />
        <path d="M35 50 C 40 60, 60 60, 65 50 C 62 62, 38 62, 35 50 Z" fill="#3a0016" opacity="0.35" />
        <circle cx="50" cy="50" r="8" fill="#4a0020" opacity="0.55" />
      </g>
    </svg>
  );
}
function Orchid({ size = 70 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}>
      <defs>
        <radialGradient id="og1" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff5fa" />
          <stop offset="55%" stopColor="#ff8fc4" />
          <stop offset="100%" stopColor="#a8144a" />
        </radialGradient>
      </defs>
      <g transform="translate(50 50)">
        {[0,72,144,216,288].map((a,i)=>(
          <ellipse key={i} cx="0" cy="-24" rx="16" ry="26" fill="url(#og1)" transform={`rotate(${a})`} opacity="0.95" />
        ))}
        <ellipse cx="0" cy="8" rx="14" ry="18" fill="#c2185b" opacity="0.85" />
        <ellipse cx="0" cy="6" rx="7" ry="10" fill="#fff2a8" opacity="0.9" />
        <circle cx="0" cy="0" r="4" fill="#7a0033" />
      </g>
    </svg>
  );
}
function FloralDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      <div style={{ position:"absolute", top:-10, left:-10, transform:"rotate(-15deg)" }}>
        <div style={{ display:"flex", gap:-20 }}>
          <Rose size={90} hue="#ff4d8d" />
          <Orchid size={70} />
          <Rose size={60} hue="#e91e63" />
        </div>
      </div>
      <div style={{ position:"absolute", top:-20, right:-20, transform:"rotate(20deg)" }}>
        <div style={{ display:"flex", gap:-15 }}>
          <Orchid size={80} />
          <Rose size={70} hue="#ff6b9d" />
          <Orchid size={55} />
        </div>
      </div>
      <div style={{ position:"absolute", bottom:-20, left:-20, transform:"rotate(20deg)" }}>
        <div style={{ display:"flex", gap:-15 }}>
          <Rose size={70} hue="#c2185b" />
          <Orchid size={90} />
          <Rose size={55} hue="#ff4d8d" />
        </div>
      </div>
      <div style={{ position:"absolute", bottom:-15, right:-15, transform:"rotate(-20deg)" }}>
        <div style={{ display:"flex", gap:-20 }}>
          <Orchid size={65} />
          <Rose size={85} hue="#ff4d8d" />
          <Orchid size={70} />
        </div>
      </div>
      {/* subtle floating petals */}
      {Array.from({length:12}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute", left:(i*17)%100+"%", top:"-30px",
          fontSize: 14+(i%4)*4, opacity: 0.7,
          animation:`fall ${10+(i%5)*2}s linear ${i*0.7}s infinite`,
        }}>{i%2 ? "🌸" : "🌹"}</span>
      ))}
    </div>
  );
}

/* ---------------- GIFT ---------------- */
function GiftScene({ mouse, open, onOpen }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const posRef = React.useRef({ x: 0, y: 0 });
  const mouseRef = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  React.useEffect(() => {
    let raf;
    const tick = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const tx = Math.max(-100, Math.min(100, (mouseRef.current.x - cx) * 0.28));
      const ty = Math.max(-60, Math.min(60, (mouseRef.current.y - cy) * 0.15));
      posRef.current.x += (tx - posRef.current.x) * 0.08;
      posRef.current.y += (ty - posRef.current.y) * 0.08;
      setPos({ x: posRef.current.x, y: posRef.current.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  const leanY = Math.max(-20, Math.min(20, (mouse.x - cx) / 22));
  const leanX = Math.max(-14, Math.min(14, -(mouse.y - cy) / 28));

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
        A Surprise For You 🎁
      </h1>
      <p className="text-pink-200/80">Move your mouse... the gift follows. Click to open.</p>

      <div style={{ perspective: 1400, width: 360, height: 340 }}>
        <div
          onClick={onOpen}
          style={{
            width: "100%", height: "100%",
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotateX(${leanX}deg) rotateY(${leanY}deg)`,
            transformStyle: "preserve-3d",
            cursor: "pointer",
            position: "relative",
            animation: "boxIdle 4s ease-in-out infinite",
          }}
        >
          <div style={{
            position: "absolute", left: "50%", bottom: 20, transform: `translateX(-50%) translateX(${pos.x * 0.3}px)`,
            width: 220, height: 24, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
            filter: "blur(6px)",
          }} />

          <GiftBox3D open={open} />

          {open && (
            <>
              <div style={{ position: "absolute", left: "50%", top: "35%", fontSize: 72, animation: "heartUp 1.8s ease-out forwards", filter: "drop-shadow(0 0 20px #ff4d8d)" }}>💖</div>
              {Array.from({length:16}).map((_,i)=>{
                const ang = (i * 22.5) * Math.PI / 180;
                const dist = 160 + (i%3)*30;
                const emojis = ["✨","⭐","🌟","💫","🎀","💗"];
                return (
                  <span key={i} style={{
                    position:"absolute", left:"50%", top:"40%", fontSize: 20 + (i%3)*6,
                    "--tx": `${Math.cos(ang)*dist}px`,
                    "--ty": `${Math.sin(ang)*dist - 40}px`,
                    animation:`sparkleOut ${1.2 + (i%4)*0.15}s ease-out forwards`,
                  }}>{emojis[i%emojis.length]}</span>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GiftBox3D({ open }) {
  const W = 180, H = 140, D = 180;
  const lidH = 34;
  const ribbonW = 26;
  const bodyGrad = "linear-gradient(135deg,#ff4d8d 0%,#d81b60 55%,#8e0e3f 100%)";
  const bodyGradDark = "linear-gradient(135deg,#a8144a 0%,#6d0a30 100%)";
  const lidGrad = "linear-gradient(135deg,#ff6ba3 0%,#e91e63 55%,#a8144a 100%)";

  const face = (extra) => ({
    position: "absolute", backfaceVisibility: "hidden",
    boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)",
    ...extra,
  });
  const ribbon = {
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%), " +
      "linear-gradient(180deg,#b8860b 0%,#ffd76a 25%,#fff2a8 50%,#ffd76a 75%,#b8860b 100%)",
    boxShadow: "0 0 8px rgba(255,215,0,0.55)",
  };
  const ribbonH = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%), " +
      "linear-gradient(90deg,#b8860b 0%,#ffd76a 25%,#fff2a8 50%,#ffd76a 75%,#b8860b 100%)",
    boxShadow: "0 0 8px rgba(255,215,0,0.55)",
  };

  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%",
      width: W, height: H, transformStyle: "preserve-3d",
      transform: `translate(-50%,-50%) rotateX(-16deg) rotateY(-24deg)`,
    }}>
      {/* Body cube */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        <div style={face({ width: W, height: H, background: bodyGrad, transform: `translateZ(${D/2}px)` })}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: ribbonW, marginLeft: -ribbonW/2, ...ribbon }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: ribbonW, marginTop: -ribbonW/2, ...ribbonH }} />
        </div>
        <div style={face({ width: W, height: H, background: bodyGradDark, transform: `translateZ(-${D/2}px) rotateY(180deg)` })} />
        <div style={face({ width: D, height: H, background: bodyGradDark, left: W/2 - D/2, transform: `rotateY(90deg) translateZ(${W/2}px)` })}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: ribbonW, marginLeft: -ribbonW/2, ...ribbon }} />
        </div>
        <div style={face({ width: D, height: H, background: bodyGradDark, left: W/2 - D/2, transform: `rotateY(-90deg) translateZ(${W/2}px)` })}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: ribbonW, marginLeft: -ribbonW/2, ...ribbon }} />
        </div>
        <div style={face({ width: W, height: D, background: "#5a0824", top: H/2 - D/2, transform: `rotateX(-90deg) translateZ(${H/2}px)` })} />
        <div style={face({ width: W, height: D, background: "linear-gradient(180deg,#2a0010,#4a0820)", top: H/2 - D/2, transform: `rotateX(90deg) translateZ(-${H/2}px)`, boxShadow: "inset 0 0 60px rgba(0,0,0,0.9)" })}>
          {open && <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at center, rgba(255,215,0,0.7), transparent 60%)" }} />}
        </div>
      </div>

      {/* Lid */}
      <div style={{
        position: "absolute", left: -8, top: -lidH, width: W + 16, height: lidH,
        transformStyle: "preserve-3d",
        transform: open
          ? `translate3d(30px, -180px, 40px) rotateZ(-22deg) rotateX(24deg)`
          : `translate3d(0,0,0)`,
        transition: "transform 1.2s cubic-bezier(.34,1.4,.5,1)",
      }}>
        <div style={face({ width: W+16, height: lidH, background: lidGrad, transform: `translateZ(${D/2 + 8}px)` })}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: ribbonW, marginLeft: -ribbonW/2, ...ribbon }} />
        </div>
        <div style={face({ width: W+16, height: lidH, background: bodyGradDark, transform: `translateZ(-${D/2 + 8}px) rotateY(180deg)` })} />
        <div style={face({ width: D+16, height: lidH, background: bodyGradDark, left: (W+16)/2 - (D+16)/2, transform: `rotateY(90deg) translateZ(${(W+16)/2}px)` })} />
        <div style={face({ width: D+16, height: lidH, background: bodyGradDark, left: (W+16)/2 - (D+16)/2, transform: `rotateY(-90deg) translateZ(${(W+16)/2}px)` })} />
        <div style={face({
          width: W+16, height: D+16, top: lidH/2 - (D+16)/2,
          background: "linear-gradient(135deg,#ff6ba3,#e91e63 60%,#a8144a)",
          transform: `rotateX(-90deg) translateZ(${lidH/2}px)`,
        })}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: ribbonW, marginLeft: -ribbonW/2, ...ribbon }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: ribbonW, marginTop: -ribbonW/2, ...ribbonH }} />
        </div>

        {/* Proper SVG bow sitting on top of the lid, facing camera */}
        <div style={{
          position: "absolute", left: "50%", top: 0,
          transform: `translate(-50%, -75%) translateZ(${D/2 + 20}px)`,
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}>
          <FluffyBow size={170} />
        </div>
      </div>

      <div style={{
        position: "absolute", left: "50%", top: H - 4,
        width: W*1.4, height: 20, transform: "translateX(-50%)",
        background: "radial-gradient(ellipse, rgba(255,100,150,0.55), transparent 70%)",
        filter: "blur(4px)",
      }} />
    </div>
  );
}

/* ---------------- FLUFFY SVG BOW ---------------- */
function FluffyBow({ size = 160 }) {
  return (
    <svg viewBox="0 0 200 180" width={size} height={size * 0.9} style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.55))" }}>
      <defs>
        <radialGradient id="bowGold" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff8c8"/>
          <stop offset="35%" stopColor="#ffe36a"/>
          <stop offset="75%" stopColor="#d4a017"/>
          <stop offset="100%" stopColor="#7a5a08"/>
        </radialGradient>
        <linearGradient id="bowRibbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8860b"/>
          <stop offset="45%" stopColor="#ffe36a"/>
          <stop offset="55%" stopColor="#fff8c8"/>
          <stop offset="100%" stopColor="#8b6508"/>
        </linearGradient>
        <radialGradient id="bowKnot" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8c8"/>
          <stop offset="55%" stopColor="#ffcf3d"/>
          <stop offset="100%" stopColor="#7a5a08"/>
        </radialGradient>
      </defs>
      {/* Streamer tails hanging behind */}
      <path d="M 90 95 Q 70 130 55 170 Q 75 165 85 155 Q 95 135 100 110 Z" fill="url(#bowRibbon)"/>
      <path d="M 110 95 Q 130 130 145 170 Q 125 165 115 155 Q 105 135 100 110 Z" fill="url(#bowRibbon)"/>
      {/* Left main loop */}
      <path d="M 100 90 C 55 55, 15 65, 25 100 C 20 130, 60 130, 100 100 Z" fill="url(#bowGold)" stroke="#7a5a08" strokeWidth="1"/>
      {/* Right main loop */}
      <path d="M 100 90 C 145 55, 185 65, 175 100 C 180 130, 140 130, 100 100 Z" fill="url(#bowGold)" stroke="#7a5a08" strokeWidth="1"/>
      {/* Loop creases */}
      <path d="M 40 78 C 55 85, 75 92, 95 95" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2"/>
      <path d="M 160 78 C 145 85, 125 92, 105 95" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2"/>
      <path d="M 45 115 C 60 108, 80 102, 95 100" fill="none" stroke="#7a5a08" strokeOpacity="0.5" strokeWidth="1.5"/>
      <path d="M 155 115 C 140 108, 120 102, 105 100" fill="none" stroke="#7a5a08" strokeOpacity="0.5" strokeWidth="1.5"/>
      {/* Small inner loops for fluff */}
      <path d="M 100 92 C 78 78, 55 82, 62 98 C 68 108, 88 105, 100 100 Z" fill="url(#bowGold)" opacity="0.95"/>
      <path d="M 100 92 C 122 78, 145 82, 138 98 C 132 108, 112 105, 100 100 Z" fill="url(#bowGold)" opacity="0.95"/>
      {/* Center knot */}
      <ellipse cx="100" cy="96" rx="18" ry="22" fill="url(#bowKnot)" stroke="#7a5a08" strokeWidth="1.2"/>
      <path d="M 84 88 Q 100 82 116 88" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2"/>
      <path d="M 84 104 Q 100 110 116 104" fill="none" stroke="#7a5a08" strokeOpacity="0.6" strokeWidth="1.5"/>
      {/* Highlights */}
      <ellipse cx="93" cy="90" rx="4" ry="6" fill="#fff" opacity="0.55"/>
    </svg>
  );
}

/* ---------------- PIN ---------------- */
function PinScene({ pin, setPin, error, hint, onSubmit }) {
  const press = (d) => {
    if (pin.length < 4) {
      const np = pin + d;
      setPin(np);
      if (np.length === 4) setTimeout(() => onSubmit(np), 250);
    }
  };
  const del = () => setPin(pin.slice(0, -1));
  return (
    <div className="flex flex-col items-center gap-6 bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-pink-500/30 shadow-2xl" style={{ boxShadow: "0 0 60px rgba(255,80,150,0.3)" }}>
      <div className="text-6xl">🔒</div>
      <div className="text-5xl font-mono tracking-widest text-pink-200">02:44</div>
      <div className="uppercase text-xs tracking-[0.4em] text-pink-300/70">Birthday Surprise</div>
      <div className="flex gap-3 my-2">
        {[0,1,2,3].map(i=>(
          <div key={i} className="w-4 h-4 rounded-full border-2 border-pink-400" style={{ background: pin.length > i ? "#ff6b9d" : "transparent", boxShadow: pin.length > i ? "0 0 10px #ff6b9d" : "none" }} />
        ))}
      </div>
      {error && <div className="text-red-400 text-sm">Wrong PIN 😢</div>}
      {hint && <div className="text-yellow-300 text-sm">Hint: {CONFIG.hint}</div>}
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3,4,5,6,7,8,9].map(n=>(
          <button key={n} onClick={()=>press(String(n))} className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-rose-700/30 border border-pink-400/40 text-white text-xl font-semibold hover:from-pink-500/60 hover:to-rose-700/60 transition-all active:scale-90">{n}</button>
        ))}
        <button onClick={del} className="w-16 h-16 rounded-full bg-white/5 border border-white/20 text-white hover:bg-white/10">⌫</button>
        <button onClick={()=>press("0")} className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-rose-700/30 border border-pink-400/40 text-white text-xl">0</button>
        <button onClick={()=>setPin("")} className="w-16 h-16 rounded-full bg-white/5 border border-white/20 text-white text-xs">CLR</button>
      </div>
      <div className="text-xs text-pink-300/50">Demo PIN: {CONFIG.pin}</div>
      <div className="text-[10px] text-pink-300/40">Hint: DDMM of her birthday</div>
    </div>
  );
}

/* ---------------- CURTAIN ---------------- */
function CurtainScene({ open, onDone }) {
  useEffect(() => { if (open) setTimeout(onDone, 2200); }, [open]);
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div style={{
        position:"absolute", top:0, bottom:0, left:0, width:"50%",
        background:"linear-gradient(90deg,#3d0000,#8b0000 40%,#c1121f 70%,#8b0000)",
        boxShadow:"inset -30px 0 60px rgba(0,0,0,0.7)",
        animation: open ? "curtainL 2s cubic-bezier(.7,0,.3,1) forwards" : "none",
      }} />
      <div style={{
        position:"absolute", top:0, bottom:0, right:0, width:"50%",
        background:"linear-gradient(270deg,#3d0000,#8b0000 40%,#c1121f 70%,#8b0000)",
        boxShadow:"inset 30px 0 60px rgba(0,0,0,0.7)",
        animation: open ? "curtainR 2s cubic-bezier(.7,0,.3,1) forwards" : "none",
      }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl bg-gradient-to-r from-pink-200 via-white to-pink-300 text-transparent bg-clip-text font-bold" style={{ backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }}>
            Loading something special...
          </div>
          <div className="text-6xl mt-4">❤️</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- INTRO ---------------- */
function IntroScene({ onNext }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-xl">
      <div className="text-6xl">💌</div>
      <h2 className="text-3xl md:text-4xl font-bold text-pink-200">Before we begin...</h2>
      <p className="text-pink-100/80 text-lg leading-relaxed">
        On your special day, I made this little world just for you.
        Every click hides a piece of my heart. Take your time, my love. 💖
      </p>
      <button onClick={onNext} className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg" style={{ boxShadow: "0 0 30px rgba(255,80,150,0.5)" }}>
        Continue →
      </button>
    </div>
  );
}

/* ---------------- CAKE ---------------- */
function CakeScene({ confetti, onClick }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const target = (() => {
    const y = now.getFullYear();
    let d = new Date(y, CONFIG.birthday.month, CONFIG.birthday.day, 0, 0, 0);
    if (d < now) d = new Date(y + 1, CONFIG.birthday.month, CONFIG.birthday.day, 0, 0, 0);
    return d;
  })();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor(diff / 3600000) % 24;
  const mins = Math.floor(diff / 60000) % 60;
  const secs = Math.floor(diff / 1000) % 60;
  const isToday = now.getMonth() === CONFIG.birthday.month && now.getDate() === CONFIG.birthday.day;
  const Box = ({ v, l }) => (
    <div className="flex flex-col items-center bg-black/40 border border-pink-400/40 rounded-xl px-3 py-2 min-w-[60px] backdrop-blur">
      <div className="text-2xl font-bold text-pink-200 tabular-nums">{String(v).padStart(2,"0")}</div>
      <div className="text-[10px] uppercase tracking-widest text-pink-300/70">{l}</div>
    </div>
  );
  return (
    <div className="flex flex-col items-center gap-5">
      <h2 className="text-4xl font-bold text-pink-200">Happy 26th Birthday! 🎂</h2>
      {isToday ? (
        <div className="text-pink-100 text-lg">🎉 It's her big day today! 🎉</div>
      ) : (
        <div className="flex gap-2">
          <Box v={days} l="Days" /><Box v={hrs} l="Hrs" /><Box v={mins} l="Min" /><Box v={secs} l="Sec" />
        </div>
      )}
      <p className="text-pink-100/70">Click the cake to celebrate</p>
      <Cake3D onClick={onClick} />
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {Array.from({length:80}).map((_,i)=>{
            const colors=["#ff6b9d","#ffd700","#fff","#ff4d8d","#ffb3c6"];
            return <div key={i} style={{
              position:"absolute", left:(i*13)%100+"%", top:"-20px",
              width:8, height:14, background:colors[i%5],
              animation:`fall ${2+((i*3)%3)}s linear ${(i*0.05)%1.5}s forwards`,
            }} />;
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- REALISTIC SVG CAKE (v2) ---------------- */
function Cake3D({ onClick }) {
  // Proper tiered birthday cake: cylindrical tiers with visible top ellipse,
  // white frosting band with real teardrop drips, piped swirl rosettes,
  // candles with flickering flames, "26" plaque, silver plate.
  const Tier = ({ cx, topY, rx, h, sideGrad, topGrad, showPlaque }) => {
    const bottomY = topY + h;
    return (
      <g>
        {/* Side body */}
        <path d={`M ${cx-rx} ${topY} L ${cx-rx} ${bottomY} A ${rx} ${rx*0.28} 0 0 0 ${cx+rx} ${bottomY} L ${cx+rx} ${topY} A ${rx} ${rx*0.28} 0 0 1 ${cx-rx} ${topY} Z`}
              fill={`url(#${sideGrad})`} />
        {/* Side vertical shading stripes for texture */}
        <g opacity="0.15">
          {Array.from({length:14}).map((_,i)=>{
            const t = i/13; const x = cx-rx + t*rx*2;
            return <line key={i} x1={x} y1={topY+4} x2={x} y2={bottomY-4} stroke="#000" strokeWidth="0.6"/>;
          })}
        </g>
        {/* Top ellipse (cake surface visible) */}
        <ellipse cx={cx} cy={topY} rx={rx} ry={rx*0.28} fill={`url(#${topGrad})`} />
        {/* Frosting band under the top rim (white icing wrap) */}
        <path d={`M ${cx-rx} ${topY+2} A ${rx} ${rx*0.28} 0 0 0 ${cx+rx} ${topY+2} L ${cx+rx} ${topY+18} A ${rx} ${rx*0.28} 0 0 1 ${cx-rx} ${topY+18} Z`}
              fill="url(#frostBand)" />
        {/* Real teardrop drips falling from the frosting band */}
        <g>
          {Array.from({length: Math.floor(rx/12)}).map((_,i,arr)=>{
            const n = arr.length;
            const t = (i+0.5)/n;
            const angle = Math.PI * t; // 0..PI along front arc
            const x = cx - rx*Math.cos(angle);
            const y = topY + 18 + rx*0.28*Math.sin(angle)*0.15;
            const len = 14 + ((i*7)%18);
            return (
              <path key={i}
                d={`M ${x-5} ${y} Q ${x-6} ${y+len*0.55} ${x} ${y+len} Q ${x+6} ${y+len*0.55} ${x+5} ${y} Q ${x} ${y+3} ${x-5} ${y} Z`}
                fill="url(#dripGrad)" stroke="#e6a4bc" strokeWidth="0.5"/>
            );
          })}
        </g>
        {showPlaque && (
          <g>
            <ellipse cx={cx} cy={topY + h*0.55} rx={rx*0.28} ry={rx*0.11} fill="#fff" opacity="0.95" stroke="#e91e63" strokeWidth="1"/>
            <text x={cx} y={topY + h*0.55 + 7} textAnchor="middle" fontSize={rx*0.22} fontWeight="bold" fill="#c2185b" fontFamily="Georgia, serif">26</text>
          </g>
        )}
        {/* Piped rosettes on TOP rim */}
        <g>
          {Array.from({length: Math.floor(rx/11)}).map((_,i,arr)=>{
            const n = arr.length;
            const t = i/(n-1);
            const angle = Math.PI + Math.PI*t; // back half arc (from left to right across top)
            const x = cx + rx*Math.cos(angle);
            const y = topY + rx*0.28*Math.sin(angle) - 2;
            return <PipeRosette key={i} cx={x} cy={y} r={Math.max(7, rx*0.06)} />;
          })}
        </g>
      </g>
    );
  };

  return (
    <div onClick={onClick} className="cursor-pointer" style={{ animation:"float 3s ease-in-out infinite" }}>
      <svg viewBox="0 0 560 680" width="460" height="560" style={{ overflow:"visible", filter:"drop-shadow(0 25px 30px rgba(0,0,0,0.55))" }}>
        <defs>
          <linearGradient id="tSide1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a0a35"/><stop offset="20%" stopColor="#c2185b"/>
            <stop offset="50%" stopColor="#ff6b9d"/><stop offset="80%" stopColor="#c2185b"/><stop offset="100%" stopColor="#7a0a35"/>
          </linearGradient>
          <linearGradient id="tSide2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a1145"/><stop offset="20%" stopColor="#d81b60"/>
            <stop offset="50%" stopColor="#ff85b0"/><stop offset="80%" stopColor="#d81b60"/><stop offset="100%" stopColor="#8a1145"/>
          </linearGradient>
          <linearGradient id="tSide3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a01553"/><stop offset="20%" stopColor="#e91e63"/>
            <stop offset="50%" stopColor="#ffa8c8"/><stop offset="80%" stopColor="#e91e63"/><stop offset="100%" stopColor="#a01553"/>
          </linearGradient>
          <radialGradient id="tTop1" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ff9ec1"/><stop offset="70%" stopColor="#e91e63"/><stop offset="100%" stopColor="#7a0a35"/>
          </radialGradient>
          <radialGradient id="tTop2" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffb3d1"/><stop offset="70%" stopColor="#ec407a"/><stop offset="100%" stopColor="#8a1145"/>
          </radialGradient>
          <radialGradient id="tTop3" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffc9de"/><stop offset="70%" stopColor="#f06292"/><stop offset="100%" stopColor="#a01553"/>
          </radialGradient>
          <linearGradient id="frostBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="60%" stopColor="#fff0f5"/>
            <stop offset="100%" stopColor="#ffd6e4"/>
          </linearGradient>
          <linearGradient id="dripGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="70%" stopColor="#fff0f5"/>
            <stop offset="100%" stopColor="#ffcbe0"/>
          </linearGradient>
          <radialGradient id="rosetteFill" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="55%" stopColor="#ffc2d6"/>
            <stop offset="100%" stopColor="#c2185b"/>
          </radialGradient>
          <radialGradient id="plate" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fafafa"/><stop offset="60%" stopColor="#c8c8c8"/><stop offset="100%" stopColor="#5a5a5a"/>
          </radialGradient>
          <radialGradient id="flameG" cx="50%" cy="70%" r="55%">
            <stop offset="0%" stopColor="#fffde7"/>
            <stop offset="45%" stopColor="#ffc107"/>
            <stop offset="100%" stopColor="#e65100" stopOpacity="0"/>
          </radialGradient>
          <pattern id="candleStripe" width="10" height="12" patternUnits="userSpaceOnUse">
            <rect width="10" height="6" fill="#ffffff"/>
            <rect y="6" width="10" height="6" fill="#f06292"/>
          </pattern>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="280" cy="655" rx="220" ry="14" fill="rgba(0,0,0,0.55)" filter="blur(4px)"/>
        {/* Plate */}
        <ellipse cx="280" cy="625" rx="250" ry="28" fill="url(#plate)"/>
        <ellipse cx="280" cy="619" rx="238" ry="18" fill="#fff" opacity="0.4"/>

        {/* Bottom tier */}
        <Tier cx={280} topY={470} rx={220} h={110} sideGrad="tSide1" topGrad="tTop1" />
        {/* Middle tier */}
        <Tier cx={280} topY={360} rx={160} h={100} sideGrad="tSide2" topGrad="tTop2" showPlaque />
        {/* Top tier */}
        <Tier cx={280} topY={260} rx={100} h={90} sideGrad="tSide3" topGrad="tTop3" />

        {/* Candles on top tier */}
        {[236,258,280,302,324].map((cx,i)=>(
          <g key={i}>
            <rect x={cx-5} y={190} width="10" height="70" rx="2" fill="url(#candleStripe)" stroke="#c2185b" strokeWidth="0.5"/>
            {/* wick */}
            <line x1={cx} y1={182} x2={cx} y2={192} stroke="#333" strokeWidth="1.5"/>
            {/* flame glow */}
            <ellipse cx={cx} cy={175} rx="9" ry="15" fill="url(#flameG)">
              <animate attributeName="ry" values="15;17;15" dur={`${0.5 + i*0.05}s`} repeatCount="indefinite"/>
            </ellipse>
            {/* flame core */}
            <path d={`M ${cx} 165 Q ${cx+4} 172 ${cx} 182 Q ${cx-4} 172 ${cx} 165 Z`} fill="#fff59d">
              <animate attributeName="d"
                values={`M ${cx} 165 Q ${cx+4} 172 ${cx} 182 Q ${cx-4} 172 ${cx} 165 Z;
                        M ${cx} 163 Q ${cx+5} 172 ${cx} 182 Q ${cx-5} 172 ${cx} 163 Z;
                        M ${cx} 165 Q ${cx+4} 172 ${cx} 182 Q ${cx-4} 172 ${cx} 165 Z`}
                dur="0.35s" repeatCount="indefinite"/>
            </path>
            <circle cx={cx} cy={177} r="2" fill="#ff6f00"/>
          </g>
        ))}

        {/* sparkles floating around */}
        {Array.from({length:14}).map((_,i)=>{
          const ang = (i*25.7)*Math.PI/180;
          const r = 240;
          const x = 280 + Math.cos(ang)*r;
          const y = 420 + Math.sin(ang)*r*0.55;
          return <circle key={i} cx={x} cy={y} r={2} fill="#fff5b8" opacity="0.7">
            <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2+i%3}s`} repeatCount="indefinite" begin={`${i*0.2}s`}/>
          </circle>;
        })}
      </svg>
    </div>
  );
}

// Piped swirl rosette (proper piped-icing look, not gumball)
function PipeRosette({ cx, cy, r }) {
  // Spiral swirl using a path
  const spiral = [];
  const turns = 2.2, steps = 26;
  for (let i=0;i<=steps;i++){
    const t = i/steps;
    const ang = t * turns * Math.PI * 2;
    const rad = r * (1 - t*0.85);
    const x = Math.cos(ang) * rad;
    const y = Math.sin(ang) * rad;
    spiral.push(`${i===0?"M":"L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {/* base cone */}
      <ellipse rx={r*1.05} ry={r*0.95} fill="url(#rosetteFill)"/>
      {/* piped spiral */}
      <path d={spiral.join(" ")} fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth={r*0.35} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={spiral.join(" ")} fill="none" stroke="#c2185b" strokeOpacity="0.4" strokeWidth={r*0.12} strokeLinecap="round" strokeLinejoin="round"/>
      {/* center highlight */}
      <circle r={r*0.22} fill="#fff" opacity="0.85"/>
    </g>
  );
}

function _CakeOld({ onClick }) {
  // SVG-based cake — a proper 3-tier round birthday cake with dripping frosting,
  // piped rosettes, candles, and a "26" plaque. Rendered as one SVG for crisp results.
  return (
    <div onClick={onClick} className="cursor-pointer" style={{ animation:"float 3s ease-in-out infinite" }}>
      <svg viewBox="0 0 520 640" width="440" height="540" style={{ overflow:"visible", filter:"drop-shadow(0 25px 30px rgba(0,0,0,0.55))" }}>
        <defs>
          {/* Cake body gradients (per tier) */}
          <linearGradient id="tier1Side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8e0e3f"/>
            <stop offset="20%" stopColor="#d81b60"/>
            <stop offset="50%" stopColor="#ff6b9d"/>
            <stop offset="80%" stopColor="#d81b60"/>
            <stop offset="100%" stopColor="#8e0e3f"/>
          </linearGradient>
          <linearGradient id="tier2Side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a8144a"/>
            <stop offset="20%" stopColor="#e91e63"/>
            <stop offset="50%" stopColor="#ff8fb0"/>
            <stop offset="80%" stopColor="#e91e63"/>
            <stop offset="100%" stopColor="#a8144a"/>
          </linearGradient>
          <linearGradient id="tier3Side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c2185b"/>
            <stop offset="20%" stopColor="#ff4d8d"/>
            <stop offset="50%" stopColor="#ffc2d6"/>
            <stop offset="80%" stopColor="#ff4d8d"/>
            <stop offset="100%" stopColor="#c2185b"/>
          </linearGradient>
          {/* Top frosting ellipses */}
          <radialGradient id="frost" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#fff5f8"/>
            <stop offset="70%" stopColor="#ffd1e0"/>
            <stop offset="100%" stopColor="#ff8fb0"/>
          </radialGradient>
          <radialGradient id="frostDark" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffe4ef"/>
            <stop offset="70%" stopColor="#ffb3c6"/>
            <stop offset="100%" stopColor="#e91e63"/>
          </radialGradient>
          {/* Rosette gradient */}
          <radialGradient id="rosette" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffe4ef"/>
            <stop offset="50%" stopColor="#ff8fb0"/>
            <stop offset="100%" stopColor="#8e0e3f"/>
          </radialGradient>
          {/* Plate */}
          <radialGradient id="plate" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f5f5f5"/>
            <stop offset="60%" stopColor="#bdbdbd"/>
            <stop offset="100%" stopColor="#4a4a4a"/>
          </radialGradient>
          {/* Flame */}
          <radialGradient id="flame" cx="50%" cy="70%" r="55%">
            <stop offset="0%" stopColor="#fffde7"/>
            <stop offset="45%" stopColor="#ffc107"/>
            <stop offset="100%" stopColor="#e65100" stopOpacity="0"/>
          </radialGradient>
          {/* Drip path clip helper (unused directly, we draw explicit drips) */}
        </defs>

        {/* Ground shadow */}
        <ellipse cx="260" cy="620" rx="200" ry="14" fill="rgba(0,0,0,0.55)" filter="blur(4px)" />

        {/* Cake plate */}
        <ellipse cx="260" cy="590" rx="230" ry="26" fill="url(#plate)" />
        <ellipse cx="260" cy="585" rx="220" ry="18" fill="#eee" opacity="0.35" />

        {/* ============ BOTTOM TIER ============ */}
        {/* Side (rectangle with rounded ellipse top/bottom) */}
        <path d="M 60 490 Q 60 550 260 550 Q 460 550 460 490 L 460 430 Q 460 470 260 470 Q 60 470 60 430 Z"
              fill="url(#tier1Side)" />
        {/* subtle side highlight */}
        <path d="M 80 435 Q 80 470 260 470 Q 260 466 260 466 Q 100 466 100 435 Z" fill="#fff" opacity="0.12"/>
        {/* Top frosting ellipse of bottom tier */}
        <ellipse cx="260" cy="430" rx="200" ry="40" fill="url(#frostDark)"/>
        {/* Drips on bottom tier */}
        <g fill="url(#frost)">
          {[80,120,170,225,285,340,395,440].map((x,i)=>(
            <path key={i} d={`M ${x} 445 Q ${x-8} 470 ${x-4} ${485+(i%3)*6} Q ${x+2} ${495+(i%3)*4} ${x+6} ${485+(i%3)*6} Q ${x+8} 470 ${x} 445 Z`} />
          ))}
        </g>
        {/* Piped rosettes ring on top rim of bottom tier */}
        <g>
          {Array.from({length:11}).map((_,i)=>{
            const t = i/10;
            const x = 70 + t*380;
            const y = 430 + Math.sin((t-0.5)*Math.PI)*10 - 12;
            return <Rosette key={i} cx={x} cy={y} r={13}/>;
          })}
        </g>

        {/* ============ MIDDLE TIER ============ */}
        <path d="M 130 380 Q 130 425 260 425 Q 390 425 390 380 L 390 330 Q 390 365 260 365 Q 130 365 130 330 Z"
              fill="url(#tier2Side)" />
        <path d="M 145 335 Q 145 362 260 362 Q 260 358 260 358 Q 160 358 160 335 Z" fill="#fff" opacity="0.14"/>
        <ellipse cx="260" cy="330" rx="130" ry="28" fill="url(#frost)"/>
        {/* Drips */}
        <g fill="url(#frostDark)">
          {[150,190,230,275,320,360].map((x,i)=>(
            <path key={i} d={`M ${x} 340 Q ${x-6} 358 ${x-3} ${370+(i%3)*4} Q ${x+2} ${378+(i%3)*3} ${x+5} ${370+(i%3)*4} Q ${x+7} 358 ${x} 340 Z`} />
          ))}
        </g>
        {/* "26" plaque on middle tier */}
        <g>
          <ellipse cx="260" cy="395" rx="34" ry="16" fill="#fff" opacity="0.92"/>
          <text x="260" y="402" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#c2185b" fontFamily="Georgia, serif">26</text>
        </g>
        {/* Rosettes ring */}
        <g>
          {Array.from({length:9}).map((_,i)=>{
            const t = i/8;
            const x = 140 + t*240;
            const y = 330 + Math.sin((t-0.5)*Math.PI)*7 - 10;
            return <Rosette key={i} cx={x} cy={y} r={11}/>;
          })}
        </g>

        {/* ============ TOP TIER ============ */}
        <path d="M 190 285 Q 190 320 260 320 Q 330 320 330 285 L 330 245 Q 330 275 260 275 Q 190 275 190 245 Z"
              fill="url(#tier3Side)" />
        <path d="M 200 250 Q 200 273 260 273 Q 260 270 260 270 Q 210 270 210 250 Z" fill="#fff" opacity="0.16"/>
        <ellipse cx="260" cy="245" rx="70" ry="18" fill="url(#frost)"/>
        {/* Drips */}
        <g fill="url(#frostDark)">
          {[205,232,258,285,312].map((x,i)=>(
            <path key={i} d={`M ${x} 252 Q ${x-5} 268 ${x-2} ${278+(i%2)*3} Q ${x+2} ${284+(i%2)*2} ${x+4} ${278+(i%2)*3} Q ${x+6} 268 ${x} 252 Z`} />
          ))}
        </g>
        {/* Rosettes ring */}
        <g>
          {Array.from({length:7}).map((_,i)=>{
            const t = i/6;
            const x = 200 + t*120;
            const y = 245 + Math.sin((t-0.5)*Math.PI)*5 - 9;
            return <Rosette key={i} cx={x} cy={y} r={9}/>;
          })}
        </g>

        {/* ============ CANDLES ============ */}
        {[220,240,260,280,300].map((cx,i)=>(
          <g key={i}>
            {/* wick shadow */}
            <line x1={cx} y1={175} x2={cx} y2={240} stroke="#00000022" strokeWidth="6"/>
            {/* candle body striped */}
            <rect x={cx-4} y={180} width="8" height="60" rx="2" fill="#fff"/>
            <rect x={cx-4} y={180} width="8" height="60" rx="2"
                  fill="url(#candleStripe)" />
            {/* wick */}
            <line x1={cx} y1={172} x2={cx} y2={182} stroke="#333" strokeWidth="1.5"/>
            {/* flame glow */}
            <ellipse cx={cx} cy={165} rx="10" ry="16" fill="url(#flame)">
              <animate attributeName="ry" values="16;18;16" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* flame core */}
            <ellipse cx={cx} cy={168} rx="4" ry="8" fill="#fff59d">
              <animate attributeName="ry" values="8;9;8" dur="0.4s" repeatCount="indefinite"/>
            </ellipse>
          </g>
        ))}
        <defs>
          <pattern id="candleStripe" width="8" height="10" patternUnits="userSpaceOnUse">
            <rect width="8" height="5" fill="#fff"/>
            <rect y="5" width="8" height="5" fill="#ffb3c6"/>
          </pattern>
        </defs>

        {/* sparkles floating around */}
        {Array.from({length:12}).map((_,i)=>{
          const ang = (i*30)*Math.PI/180;
          const r = 220;
          const x = 260 + Math.cos(ang)*r;
          const y = 400 + Math.sin(ang)*r*0.55;
          return <circle key={i} cx={x} cy={y} r={2} fill="#fff5b8" opacity="0.7">
            <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2+i%3}s`} repeatCount="indefinite" begin={`${i*0.2}s`}/>
          </circle>;
        })}
      </svg>
    </div>
  );
}

// Small piped-frosting rosette used to decorate cake rims
function Rosette({ cx, cy, r }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r} fill="url(#rosette)"/>
      <path d={`M 0 ${-r*0.6} A ${r*0.55} ${r*0.55} 0 1 1 ${-r*0.4} ${r*0.35}`}
            fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth={r*0.25} strokeLinecap="round"/>
      <circle r={r*0.28} fill="#fff" opacity="0.55"/>
      <circle cx={-r*0.25} cy={-r*0.25} r={r*0.15} fill="#fff" opacity="0.7"/>
    </g>
  );
}

/* ---------------- MEMORIES ---------------- */
function MemoriesScene({ idx, setIdx, onNext }) {
  const m = CONFIG.memories[idx];
  return (
    <div className="flex flex-col items-center gap-6 max-w-lg w-full">
      <h2 className="text-3xl font-bold text-pink-200">Cute Memories 💕</h2>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 0 40px rgba(255,80,150,0.4)" }}>
        <img src={m.src} alt="memory" className="w-full block" />
      </div>
      <div className="flex gap-2">
        {CONFIG.memories.map((_,i)=>(
          <button key={i} onClick={()=>setIdx(i)} className="w-3 h-3 rounded-full transition-all" style={{ background: i===idx?"#ff6b9d":"rgba(255,255,255,0.3)" }} />
        ))}
      </div>
      <div className="flex gap-3">
        {idx > 0 && <button onClick={()=>setIdx(idx-1)} className="px-5 py-2 rounded-full bg-white/10 border border-white/20">← Prev</button>}
        {idx < CONFIG.memories.length-1 ? (
          <button onClick={()=>setIdx(idx+1)} className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600">Next →</button>
        ) : (
          <button onClick={onNext} className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 font-semibold">Next Surprise »</button>
        )}
      </div>
    </div>
  );
}

/* ---------------- WISHES / BALLOONS ---------------- */
function WishesScene({ popped, setPopped, revealed, setRevealed, onNext }) {
  const pop = (i) => {
    if (popped.includes(i)) return;
    setPopped([...popped, i]);
    setRevealed([...revealed, CONFIG.wishes[i]]);
  };
  const allDone = popped.length === CONFIG.wishes.length;
  const colors = ["#ff4d8d","#ffd700","#ff6b9d","#c084fc","#f472b6"];
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
      <h2 className="text-3xl font-bold text-pink-200">Pop the Wishes 🎈</h2>
      <p className="text-pink-100/70">Tap each balloon</p>
      <div className="flex flex-wrap justify-center gap-6">
        {CONFIG.wishes.map((_,i)=>(
          <div key={i} onClick={()=>pop(i)} className="cursor-pointer relative" style={{ animation: `float ${2+(i%3)}s ease-in-out ${i*0.2}s infinite` }}>
            {!popped.includes(i) ? (
              <>
                <div style={{
                  width:70, height:85, borderRadius:"50%",
                  background:`radial-gradient(circle at 30% 30%, ${colors[i]}ff, ${colors[i]}99 60%, ${colors[i]}55)`,
                  boxShadow:`0 0 20px ${colors[i]}88`,
                  position:"relative",
                }}>
                  <div style={{ position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)", width:0, height:0, borderLeft:"6px solid transparent", borderRight:"6px solid transparent", borderTop:`10px solid ${colors[i]}` }} />
                </div>
                <div style={{ width:1, height:60, background:"rgba(255,255,255,0.3)", margin:"0 auto" }} />
              </>
            ) : (
              <div style={{ animation:"pop 0.4s forwards", fontSize:50 }}>💥</div>
            )}
          </div>
        ))}
      </div>
      <div className="min-h-[80px] w-full max-w-md text-center space-y-1">
        {revealed.map((w,i)=><div key={i} className="text-pink-200 text-lg animate-pulse">{w}</div>)}
      </div>
      {allDone && (
        <button onClick={onNext} className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 font-semibold hover:scale-105 transition">
          Continue to Puzzle →
        </button>
      )}
    </div>
  );
}

/* ---------------- PUZZLE ---------------- */
function PuzzleScene({ onSolved }) {
  const SIZE = 3;
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [askConfirm, setAskConfirm] = useState(false);
  const firstLoad = useRef(true);

  const shuffle = () => {
    if (firstLoad.current) {
      firstLoad.current = false;
    } else {
      setAttempts(a => {
        const na = a + 1;
        if (na >= 3) setShowGiveUp(true);
        return na;
      });
    }
    // start solved, do random valid moves for guaranteed solvable
    let arr = Array.from({length:SIZE*SIZE}, (_,i)=>i);
    let blank = SIZE*SIZE - 1;
    for (let k=0;k<200;k++){
      const r = Math.floor(blank/SIZE), c = blank%SIZE;
      const opts = [];
      if (r>0) opts.push(blank-SIZE);
      if (r<SIZE-1) opts.push(blank+SIZE);
      if (c>0) opts.push(blank-1);
      if (c<SIZE-1) opts.push(blank+1);
      const pick = opts[Math.floor(Math.random()*opts.length)];
      [arr[blank], arr[pick]] = [arr[pick], arr[blank]];
      blank = pick;
    }
    setTiles(arr); setMoves(0); setSolved(false);
  };
  useEffect(()=>{ shuffle(); },[]);

  const click = (i) => {
    if (solved) return;
    const blank = tiles.indexOf(SIZE*SIZE-1);
    const rB=Math.floor(blank/SIZE), cB=blank%SIZE;
    const rI=Math.floor(i/SIZE), cI=i%SIZE;
    if (Math.abs(rB-rI)+Math.abs(cB-cI)===1){
      const nt=[...tiles];
      [nt[blank], nt[i]] = [nt[i], nt[blank]];
      setTiles(nt); setMoves(moves+1);
      if (nt.every((v,idx)=>v===idx)){ setSolved(true); }
    }
  };

  const px = 100; // tile size
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-3xl font-bold text-pink-200">🧩 Birthday Puzzle</h2>
      <p className="text-pink-100/70 text-sm">Slide the tiles to complete her picture</p>
      <div className="flex gap-6 items-start flex-wrap justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
            <div className="text-xs text-pink-300/70 uppercase tracking-wider">Moves</div>
            <div className="text-3xl font-bold">{moves}</div>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
            <div className="text-xs text-pink-300/70 uppercase tracking-wider text-center mb-1">Picture</div>
            <img src={CONFIG.puzzleImage} alt="preview" style={{width:100,height:100,borderRadius:8,objectFit:"cover"}} />
          </div>
          <button onClick={shuffle} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white/20">🔀 Shuffle Again</button>
        </div>
        <div style={{
          position:"relative", width:px*SIZE, height:px*SIZE,
          background:"rgba(255,255,255,0.05)", borderRadius:12, padding:4,
          boxShadow:"0 0 30px rgba(255,80,150,0.3)",
        }}>
          {tiles.map((tv,i)=>{
            const isBlank = tv===SIZE*SIZE-1;
            const r = Math.floor(i/SIZE), c = i%SIZE;
            const tr = Math.floor(tv/SIZE), tc = tv%SIZE;
            return (
              <div key={i} onClick={()=>click(i)} style={{
                position:"absolute", left:c*px+4, top:r*px+4,
                width:px-6, height:px-6,
                background: isBlank ? "transparent" : `url(${CONFIG.puzzleImage})`,
                backgroundSize:`${px*SIZE-12}px ${px*SIZE-12}px`,
                backgroundPosition:`-${tc*(px-6)}px -${tr*(px-6)}px`,
                borderRadius:6,
                boxShadow: isBlank ? "none" : "0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.15)",
                transition:"left 0.2s, top 0.2s",
                cursor: isBlank ? "default" : "pointer",
              }} />
            );
          })}
        </div>
      </div>
      {solved && (
        <div className="text-center mt-2">
          <div className="text-2xl text-pink-200 font-bold mb-3">🎉 You solved it!</div>
          <button onClick={onSolved} className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 font-semibold hover:scale-105 transition">
            One Last Surprise →
          </button>
        </div>
      )}
      {showGiveUp && !solved && (
        <div style={{ animation: "slideUp 0.6s ease-out" }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          {!askConfirm ? (
            <button onClick={()=>setAskConfirm(true)} className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 font-semibold shadow-2xl border border-pink-300/50 hover:scale-105 transition" style={{ boxShadow:"0 0 40px rgba(255,80,150,0.6)" }}>
              🏳️ Accept Defeat & Continue
            </button>
          ) : (
            <div className="bg-black/70 backdrop-blur-md border border-pink-400/40 rounded-2xl p-5 text-center shadow-2xl">
              <div className="text-pink-100 mb-3">Are you sure you want to give up? 🥺<br/><span className="text-xs text-pink-300/70">Otherwise, keep trying — you've got this!</span></div>
              <div className="flex gap-3 justify-center">
                <button onClick={onSolved} className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 font-semibold">Yes, continue →</button>
                <button onClick={()=>setAskConfirm(false)} className="px-5 py-2 rounded-full bg-white/10 border border-white/20">No, I'll solve it 💪</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- SCRATCH ---------------- */
function ScratchScene({ onRevealed }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(()=>{
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0,0,c.width,c.height);
    g.addColorStop(0,"#c9a227"); g.addColorStop(0.5,"#ffd700"); g.addColorStop(1,"#c9a227");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle="rgba(0,0,0,0.4)"; ctx.font="bold 22px sans-serif"; ctx.textAlign="center";
    ctx.fillText("Scratch here 💛", c.width/2, c.height/2);

    let drawing=false;
    const pt = (e)=>{
      const r=c.getBoundingClientRect();
      const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
      const y=(e.touches?e.touches[0].clientY:e.clientY)-r.top;
      return {x,y};
    };
    const start=(e)=>{drawing=true; move(e);};
    const end=()=>{
      drawing=false;
      const d=ctx.getImageData(0,0,c.width,c.height).data;
      let cleared=0;
      for(let i=3;i<d.length;i+=4*20) if(d[i]<50) cleared++;
      if (cleared/(d.length/(4*20)) > 0.5){ setRevealed(true); }
    };
    const move=(e)=>{
      if(!drawing) return; e.preventDefault();
      const {x,y}=pt(e);
      ctx.globalCompositeOperation="destination-out";
      ctx.beginPath(); ctx.arc(x,y,22,0,Math.PI*2); ctx.fill();
    };
    c.addEventListener("mousedown",start); c.addEventListener("mousemove",move); c.addEventListener("mouseup",end); c.addEventListener("mouseleave",end);
    c.addEventListener("touchstart",start); c.addEventListener("touchmove",move); c.addEventListener("touchend",end);
    return ()=>{};
  },[]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-3xl font-bold text-pink-200">One Last Surprise 💝</h2>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ width:320, height:200, boxShadow:"0 0 40px rgba(255,215,0,0.4)" }}>
        <div className="absolute inset-0 flex items-center justify-center text-center bg-gradient-to-br from-pink-500 to-rose-700 p-4">
          <div>
            <div className="text-4xl mb-2">💌</div>
            <div className="text-xl font-bold">Happy Birthday my love</div>
            <div className="text-sm text-pink-100/80 mt-1">You are my whole world</div>
          </div>
        </div>
        <canvas ref={canvasRef} width={320} height={200} className="absolute inset-0" style={{ touchAction:"none", cursor:"grab" }} />
      </div>
      {revealed && (
        <button onClick={onRevealed} className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 font-semibold hover:scale-105 transition">
          Read my Letter 💌
        </button>
      )}
    </div>
  );
}

/* ---------------- LETTER ---------------- */
function LetterScene({ open, setOpen, lines, setLines, onReplay }) {
  useEffect(()=>{
    if(!open) return;
    if(lines < CONFIG.letter.length){
      const t = setTimeout(()=>setLines(lines+1), 700);
      return ()=>clearTimeout(t);
    }
  }, [open, lines]);

  if(!open){
    return (
      <div className="flex flex-col items-center gap-6">
        <div onClick={()=>setOpen(true)} className="cursor-pointer" style={{ animation:"float 3s ease-in-out infinite" }}>
          <div style={{
            width:260, height:170, position:"relative",
            background:"linear-gradient(180deg,#fff5f7,#ffe0ec)",
            borderRadius:8, boxShadow:"0 20px 40px rgba(0,0,0,0.4)",
          }}>
            <div style={{
              position:"absolute", inset:0,
              background:"linear-gradient(135deg,transparent 49%, #f8bbd0 49% 51%, transparent 51%), linear-gradient(-135deg,transparent 49%, #f8bbd0 49% 51%, transparent 51%)",
              borderRadius:8,
            }} />
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:50 }}>💖</div>
          </div>
        </div>
        <p className="text-pink-200">Tap to open</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <div className="bg-gradient-to-br from-pink-50 to-rose-100 text-gray-800 p-8 rounded-2xl shadow-2xl w-full" style={{ fontFamily:"'Georgia', serif", minHeight:360, boxShadow:"0 0 40px rgba(255,80,150,0.4)" }}>
        {CONFIG.letter.slice(0, lines).map((l,i)=>(
          <div key={i} className="mb-1" style={{ animation:"fadeIn 0.5s" }}>{l || "\u00A0"}</div>
        ))}
      </div>
      {lines >= CONFIG.letter.length && (
        <button onClick={onReplay} className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 font-semibold hover:scale-105 transition">
          🔁 Replay
        </button>
      )}
    </div>
  );
}
