import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import rahmaPhoto from "@/imports/photo_white.jfif";
import edaThumb from "@/imports/image-7.png";
import signNovaThumb from "@/imports/image-9.png";

const EMAILJS_SERVICE_ID = "service_revpxkn";
const EMAILJS_TEMPLATE_ID = "template_eidauss";
const EMAILJS_PUBLIC_KEY = "W7oY6OVZ31_FhHOYm";

/* ══════════════════════════════════════════
   DESIGN TOKENS — Premium Dark System
══════════════════════════════════════════ */
const T = {
  bg:         "#030712",
  bg1:        "#060B16",
  bg2:        "#080E1A",
  /* Glassmorphism surfaces */
  glass:      "rgba(15,23,42,0.60)",
  glassHov:   "rgba(15,23,42,0.80)",
  glassDark:  "rgba(8,14,26,0.75)",
  /* Borders */
  bdr:        "rgba(255,255,255,0.06)",
  bdrMid:     "rgba(255,255,255,0.10)",
  bdrEm:      "rgba(16,185,129,0.22)",
  bdrVi:      "rgba(139,92,246,0.22)",
  bdrEmH:     "rgba(16,185,129,0.45)",
  bdrViH:     "rgba(139,92,246,0.45)",
  /* Accents */
  em:         "#10B981",
  emL:        "#34D399",
  emGlow:     "rgba(16,185,129,0.14)",
  emGlowH:    "rgba(16,185,129,0.22)",
  vi:         "#8B5CF6",
  viL:        "#A78BFA",
  viGlow:     "rgba(139,92,246,0.14)",
  viGlowH:    "rgba(139,92,246,0.22)",
  /* Typography */
  text:       "#F0F6FF",
  textSub:    "#CBD5E1",
  textMuted:  "#94A3B8",
  textDim:    "#64748B",
  textFaint:  "#475569",
};

/* ── Glass card factory ── */
const G = (
  accent: "em" | "vi" | "n" = "n",
  extra?: React.CSSProperties
): React.CSSProperties => ({
  background: T.glass,
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRadius: "20px",
  border: `1px solid ${accent === "em" ? T.bdrEm : accent === "vi" ? T.bdrVi : T.bdr}`,
  transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
  ...extra,
});

/* ── Contact icons (must precede Contact component) ── */
function IcPhone() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 2h3.5l1.5 4-2 1.5a10 10 0 0 0 4.5 4.5L12 10l4 1.5V15a2 2 0 0 1-2 2C6 17 1 12 1 4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>; }
function IcPin() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1a6 6 0 0 1 6 6c0 4-6 10-6 10S3 11 3 7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.4"/><circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>; }
function IcLinkedIn() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7v6M5 4.5v.5M8 13V9.5C8 8.1 9 7 10.5 7S13 8.1 13 9.5V13M8 7v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function IcGitHub() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34C4.73 15.4 4.26 13.8 4.26 13.8A2.2 2.2 0 0 0 3.34 12.5c-.75-.51.06-.5.06-.5a1.74 1.74 0 0 1 1.27.85 1.77 1.77 0 0 0 2.42.69 1.77 1.77 0 0 1 .53-1.11C5.3 12.19 3.5 11.52 3.5 8.5a3.1 3.1 0 0 1 .82-2.14 2.87 2.87 0 0 1 .08-2.11s.67-.22 2.2.82a7.57 7.57 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82a2.87 2.87 0 0 1 .08 2.11A3.1 3.1 0 0 1 13.5 8.5c0 3.03-1.8 3.69-3.53 3.88a1.98 1.98 0 0 1 .56 1.54v2.28c0 .21.14.46.55.38A8 8 0 0 0 9 1z" stroke="currentColor" strokeWidth=".5" fill="currentColor"/></svg>; }

/* ── Gold section title (used by Services, Projects, Skills, Contact) ── */
function GoldSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <h2 className="grad-text-gold" style={{
        fontWeight:800, fontSize:"clamp(2rem,4vw,2.8rem)",
        letterSpacing:"-.04em", lineHeight:1.1,
      }}>{children}</h2>
    </div>
  );
}

/* ══════════════════════════════════════════
   NEURAL MESH BACKGROUND
══════════════════════════════════════════ */
function NeuralMesh() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let raf: number;
    const N = 50;
    type Node = { x: number; y: number; vx: number; vy: number; t: number };
    const pts: Node[] = [];

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < N; i++)
      pts.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, t: Math.random() * Math.PI * 2 });

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; p.t += .01; if (p.x<0||p.x>c.width) p.vx*=-1; if (p.y<0||p.y>c.height) p.vy*=-1; });
      for (let i = 0; i < N; i++) for (let j = i+1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 120) {
          const a = (1 - d/120) * .12;
          ctx.beginPath();
          ctx.strokeStyle = (i+j)%3===0 ? `rgba(139,92,246,${a})` : `rgba(16,185,129,${a})`;
          ctx.lineWidth = .7; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      pts.forEach((p, i) => {
        const r = 1.5 + Math.sin(p.t) * .6;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI*2);
        ctx.fillStyle = i%4===0 ? "rgba(139,92,246,.55)" : "rgba(16,185,129,.5)"; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:.35 }} />;
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
const NAV_ITEMS = ["Home", "About", "Education", "Skills", "Experience", "Services", "Projects", "Contact"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all .35s ease",
      background: scrolled ? "rgba(3,7,18,.85)" : "transparent",
      backdropFilter: scrolled ? "blur(28px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(28px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.bdr}` : "none",
    }}>
      <div className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between" style={{ height: 68 }}>
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3" style={{ textDecoration:"none" }}>
          {/* RE monogram mark */}
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: "linear-gradient(135deg, #0A0F1A 0%, #111827 100%)",
            border: "1.5px solid rgba(245,158,11,.45)",
            boxShadow: "0 0 18px rgba(245,158,11,.22), inset 0 0 12px rgba(245,158,11,.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Subtle corner glow */}
            <div style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:"rgba(245,158,11,.18)", filter:"blur(6px)" }}/>
            <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
              {/* R */}
              <path d="M2 2v16M2 2h6a4 4 0 0 1 0 8H2M8 10l5 8" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              {/* E */}
              <path d="M14 2h6M14 10h5M14 18h6M14 2v16" stroke="#FCD34D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Wordmark */}
          <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
            <span style={{ fontWeight:800, fontSize:".95rem", letterSpacing:"-.03em", color:"#FFFFFF" }}>
              Rahma <span style={{ color:"#F59E0B" }}>Elhagary</span>
            </span>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:".52rem", color:"rgba(203,213,225,.7)", letterSpacing:".1em", marginTop:2 }}>
              AI/ML ENGINEER
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map(n => {
            const href = n === "Home" ? "#hero" : n === "Services" ? "#expertise" : `#${n.toLowerCase()}`;
            return (
              <a key={n} href={href} style={{
                fontSize: ".84rem", fontWeight: 500, color: T.textMuted,
                position: "relative", paddingBottom: "3px", transition: "color .2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = T.text;
                  (e.currentTarget.querySelector("span") as HTMLElement).style.transform = "scaleX(1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = T.textMuted;
                  (e.currentTarget.querySelector("span") as HTMLElement).style.transform = "scaleX(0)";
                }}>
                {n}
                <span style={{
                  position: "absolute", bottom: -1, left: 0, right: 0, height: 1.5, borderRadius: 2,
                  background: "linear-gradient(90deg, #F59E0B, #FCD34D)",
                  transform: "scaleX(0)", transformOrigin: "left", transition: "transform .25s ease",
                  display: "block",
                }} />
              </a>
            );
          })}
        </nav>

        {/* Burger */}
        <button className="md:hidden" onClick={() => setMob(!mob)} style={{ padding: "6px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              height: 1.5, borderRadius: 2, background: T.em, marginBottom: i<2?5:0,
              width: i===1 ? (mob?10:18) : 18,
              transform: mob?(i===0?"rotate(45deg) translate(2px,2px)":i===2?"rotate(-45deg) translate(2px,-2px)":"scaleX(0)"):"none",
              transition: "all .22s",
            }} />
          ))}
        </button>
      </div>
      {mob && (
        <div style={{ background:"rgba(3,7,18,.97)", borderBottom:`1px solid ${T.bdr}`, padding:"1rem 2rem 1.5rem" }} className="md:hidden flex flex-col gap-5">
          {NAV_ITEMS.map(n => {
            const href = n === "Home" ? "#hero" : n === "Services" ? "#expertise" : `#${n.toLowerCase()}`;
            return (
              <a key={n} href={href} onClick={()=>setMob(false)} style={{ fontSize:".9rem", fontWeight:500, color:T.textMuted }}>{n}</a>
            );
          })}
        </div>
      )}
    </header>
  );
}

function NavBtn({ href, children }: { href:string; children:React.ReactNode }) {
  const [h,setH]=useState(false);
  return (
    <a href={href} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      fontSize:".82rem", fontWeight:600, padding:".5rem 1.3rem", borderRadius:999,
      background: h ? "rgba(16,185,129,.18)" : "transparent",
      color: T.em, border:`1px solid ${h?T.bdrEmH:T.bdrEm}`,
      boxShadow: h ? "0 0 24px rgba(16,185,129,.3)" : "0 0 8px rgba(16,185,129,.1)",
      transition:"all .22s",
    }}>{children}</a>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  return (
    <section id="hero" style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", background: T.bg }}>
      {/* Ambient lighting blobs */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 80% at 30% 50%, rgba(3,12,40,.85) 0%, transparent 70%)", pointerEvents:"none", zIndex:1 }}/>
      <div style={{ position:"absolute", top:"-15%", right:"0%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(16,185,129,.055) 0%, transparent 60%)", pointerEvents:"none", zIndex:1 }}/>
      <div style={{ position:"absolute", bottom:"-15%", left:"5%", width:560, height:560, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 65%)", pointerEvents:"none", zIndex:1 }}/>

      <div className="max-w-7xl mx-auto px-8 w-full" style={{ paddingTop:148, paddingBottom:110, position:"relative", zIndex:2 }}>
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ── LEFT ── */}
          <div className="anim-fade-in-up-a">

            {/* 3-line headline */}
            <h1 style={{ fontSize:"clamp(2.8rem,5.2vw,4.5rem)", fontWeight:900, lineHeight:1.08, letterSpacing:"-.04em", marginBottom:28 }}>
              <span style={{ color:T.text, display:"block" }}>Decoding Data.</span>
              <span className="grad-text-green" style={{ display:"block", filter:"drop-shadow(0 0 18px rgba(16,185,129,.35))" }}>Building Intelligence.</span>
              <span style={{ display:"block", color:"#C4B5FD" }}>Shaping the Future.</span>
            </h1>

            {/* Bio */}
            <p style={{ fontSize:"1rem", color:T.textMuted, lineHeight:1.85, maxWidth:490, marginBottom:44, fontWeight:400 }}>
              Junior AI &amp; ML Engineer with hands-on technical expertise in building, evaluating, and deploying robust predictive models. Turning complex data and research into reliable, high-impact production systems.
            </p>

            {/* 3 action buttons */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <PrimaryBtn href="#projects">Explore Projects</PrimaryBtn>
              <CVBtn href="https://drive.google.com/file/d/11ZpLjUzjW-ACVmu4wpv_E3vK9WKGVYmZ/view?usp=sharing">View CV</CVBtn>
              <GhostBtn href="#contact">Contact Me</GhostBtn>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="anim-fade-in-up-b" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>

            {/* Static glowing circular photo frame */}
            <div style={{ position:"relative", width:272, height:272 }}>
              {/* Outer glow ring — static, no animation */}
              <div style={{
                position:"absolute", inset:-3, borderRadius:"50%",
                background:"linear-gradient(135deg, #10B981 0%, #8B5CF6 50%, #10B981 100%)",
                padding:3,
              }}>
                <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:T.bg }}/>
              </div>
              {/* Soft glow halo */}
              <div style={{
                position:"absolute", inset:-14, borderRadius:"50%",
                boxShadow:"0 0 40px rgba(16,185,129,.22), 0 0 80px rgba(16,185,129,.08)",
                pointerEvents:"none",
              }}/>
              {/* Photo */}
              <div style={{
                position:"absolute", inset:4, borderRadius:"50%",
                overflow:"hidden", border:`1.5px solid rgba(16,185,129,.3)`,
              }}>
                <img
                  src={rahmaPhoto}
                  alt="Rahma Elhagary"
                  style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }}
                />
              </div>
            </div>

            {/* Name card */}
            <div style={{ ...G("em"), padding:"14px 30px", textAlign:"center" }}>
              <div style={{ fontWeight:700, fontSize:"1.08rem", letterSpacing:"-.02em", color:T.text }}>Rahma Elhagary</div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:".67rem", color:T.em, marginTop:4 }}>Junior AI/ML Engineer</div>
            </div>

            {/* Static "available" badge */}
            <div style={{
              ...G("em"),
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"9px 20px",
              boxShadow:"0 0 20px rgba(16,185,129,.14)",
            }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:T.em, boxShadow:`0 0 8px ${T.em}`, display:"inline-block", animation:"dot-alive 2s ease-in-out infinite" }}/>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:".7rem", color:T.em, fontWeight:600 }}>Available for Hire</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Extra button variants ── */
function CVBtn({ href, children }: { href:string; children:React.ReactNode }) {
  const [h,setH]=useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      display:"inline-flex", alignItems:"center", gap:6,
      padding:".85rem 1.8rem", borderRadius:12,
      fontWeight:600, fontSize:".88rem",
      background: h ? "rgba(245,158,11,.1)" : "transparent",
      color: h ? "#FCD34D" : "#F59E0B",
      border:`1px solid ${h ? "rgba(245,158,11,.5)" : "rgba(245,158,11,.28)"}`,
      boxShadow: h ? "0 0 24px rgba(245,158,11,.22)" : "none",
      transition:"all .22s",
    }}>{children}</a>
  );
}

function GhostBtn({ href, children }: { href:string; children:React.ReactNode }) {
  const [h,setH]=useState(false);
  return (
    <a href={href} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      display:"inline-flex", alignItems:"center", gap:6,
      padding:".85rem 1.8rem", borderRadius:12,
      fontWeight:500, fontSize:".88rem",
      background: h ? "rgba(255,255,255,.05)" : "transparent",
      color: h ? T.text : T.textDim,
      border:`1px solid ${h ? T.bdrMid : T.bdr}`,
      transition:"all .22s",
    }}>{children}</a>
  );
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
function About() {
  return (
    <section id="about" style={{ padding:"120px 0", background:T.bg1, position:"relative", overflow:"hidden" }}>
      {/* Ambient glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:800, height:500, background:"radial-gradient(ellipse, rgba(16,185,129,.035) 0%, transparent 65%)", pointerEvents:"none" }}/>

      <div className="max-w-3xl mx-auto px-8" style={{ position:"relative" }}>

        {/* Centered section title */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <h2 className="grad-text-gold" style={{ fontWeight:800, fontSize:"clamp(2rem,4vw,2.8rem)", letterSpacing:"-.04em", lineHeight:1.1 }}>
            About Me
          </h2>
        </div>

        {/* Single unified glassmorphism card */}
        <div style={{
          ...G("n"),
          padding:"clamp(2rem,5vw,3.5rem)",
          border:`1px solid rgba(245,158,11,.14)`,
          boxShadow:"0 8px 48px rgba(0,0,0,.35), inset 0 0 60px rgba(16,185,129,.02)",
        }}>
          {/* Sub-heading */}
          <div style={{ marginBottom:28 }}>
            <span style={{ fontWeight:700, fontSize:"1.25rem", color:T.text, letterSpacing:"-.025em" }}>
              Who am I?
            </span>
            <div style={{ width:36, height:2, borderRadius:2, background:"linear-gradient(90deg, #F59E0B, #FCD34D)", marginTop:10 }}/>
          </div>

          {/* Paragraphs */}
          <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
            <p style={{ fontSize:"1rem", color:T.textMuted, lineHeight:1.88, margin:0 }}>
              Junior AI and Machine Learning Engineer, currently ranking{" "}
              <strong style={{ color:T.em, fontWeight:600 }}>1st in my class</strong>{" "}
              studying Computer Science and Artificial Intelligence at{" "}
              <strong style={{ color:T.text, fontWeight:600 }}>Damietta University</strong>.
              I bridge the gap between complex research and scalable production systems.
            </p>

            <p style={{ fontSize:"1rem", color:T.textMuted, lineHeight:1.88, margin:0 }}>
              With hands-on expertise in{" "}
              <strong style={{ color:T.em, fontWeight:600 }}>Python, TensorFlow, PyTorch,</strong>{" "}
              and <strong style={{ color:T.em, fontWeight:600 }}>scikit-learn</strong>, I specialize in
              building, evaluating, and deploying robust predictive models, driven by a strong foundation in{" "}
              <strong style={{ color:T.vi, fontWeight:600 }}>data cleaning and preprocessing</strong>.
            </p>

            <p style={{ fontSize:"1rem", color:T.textMuted, lineHeight:1.88, margin:0 }}>
              Beyond engineering, I am an{" "}
              <strong style={{ color:"#FCD34D", fontWeight:600 }}>ECPC Finals Qualifier</strong>{" "}
              and an active mentor at the{" "}
              <strong style={{ color:T.em, fontWeight:600 }}>ACPC Damietta Club</strong>,
              guiding students through advanced Data Structures and Algorithms.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop:`1px solid ${T.bdr}`, marginTop:36, paddingTop:28 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {[
                { icon:"🎓", label:"B.Sc. CS & AI · GPA 3.7 · Ranked 1st" },
                { icon:"🏆", label:"ECPC Finals Qualifier" },
                { icon:"🤝", label:"ACPC Mentor · 20+ Students" },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  padding:"8px 16px", borderRadius:10,
                  background:"rgba(255,255,255,.04)", border:`1px solid ${T.bdr}`,
                }}>
                  <span style={{ fontSize:".9rem" }}>{icon}</span>
                  <span style={{ fontSize:".8rem", color:T.textSub, fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SERVICES
══════════════════════════════════════════ */
const SERVICES = [
  {
    accent:"em" as const,
    icon:<SvcIcon1/>,
    title:"Custom ML Models",
    desc:"Building, evaluating, and deploying robust predictive machine learning models tailored to specific project requirements.",
    tags:["PyTorch","TensorFlow","scikit-learn","Python"],
  },
  {
    accent:"vi" as const,
    icon:<SvcIcon2/>,
    title:"Data Cleaning & Preprocessing",
    desc:"Processing, cleaning, and engineering features for complex datasets to optimize performance metrics and ensure model reliability.",
    tags:["Data Preprocessing","Data Cleaning","Feature Engineering","Applied Statistics"],
  },
  {
    accent:"em" as const,
    icon:<SvcIcon3/>,
    title:"NLP & Computer Vision",
    desc:"Specialized in Natural Language Processing and Computer Vision systems, building intelligent applications like real-time recognition systems.",
    tags:["NLP","Computer Vision","Azure AI","Hugging Face"],
  },
];

function Services() {
  return (
    <section id="expertise" style={{ padding:"120px 0", background:T.bg, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"50%", right:"-10%", transform:"translateY(-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(16,185,129,.04) 0%, transparent 60%)", pointerEvents:"none" }}/>
      <div className="max-w-7xl mx-auto px-8">
        <GoldSectionTitle>Services</GoldSectionTitle>
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {SERVICES.map(s => <ServiceCard key={s.title} s={s} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s }: { s:typeof SERVICES[0] }) {
  const [h,setH]=useState(false);
  const ac = s.accent==="em" ? T.em : T.vi;
  const gl = s.accent==="em" ? T.emGlow : T.viGlow;
  const bH = s.accent==="em" ? T.bdrEmH : T.bdrViH;

  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      ...G(s.accent),
      padding:"2rem",
      display:"flex", flexDirection:"column",
      transform: h?"translateY(-5px) scale(1.005)":"none",
      boxShadow: h?`0 28px 72px -8px ${s.accent==="em"?"rgba(16,185,129,.14)":"rgba(139,92,246,.14)"}`:
                   `0 4px 24px rgba(0,0,0,.3)`,
      borderColor: h ? bH : s.accent==="em" ? T.bdrEm : T.bdrVi,
    }}>
      <div style={{
        width:54, height:54, borderRadius:14,
        background: `linear-gradient(135deg, ${gl}, transparent)`,
        border:`1px solid ${s.accent==="em"?T.bdrEm:T.bdrVi}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        color:ac, marginBottom:"1.5rem",
        transition:"transform .25s",
        transform: h?"scale(1.08)":"none",
      }}>{s.icon}</div>

      <h3 style={{ fontWeight:700, fontSize:"1.08rem", color:T.text, letterSpacing:"-.025em", marginBottom:10 }}>{s.title}</h3>
      <p style={{ fontSize:".875rem", color:T.textMuted, lineHeight:1.82, flexGrow:1, marginBottom:"1.4rem" }}>{s.desc}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {s.tags.map(t => <MonoChip key={t} label={t} accent={s.accent} />)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════ */
const PROJECTS = [
  {
    id:"01", accent:"em" as const,
    name:"SignNova",
    category:"Computer Vision · NLP · PyTorch",
    mockBg:"#060E12",
    gradA:"rgba(16,185,129,.22)", gradB:"rgba(139,92,246,.16)",
    tagline:"Real-time American Sign Language (ASL) recognition system achieving 95% accuracy.",
    problem:"Deaf and hard-of-hearing communities face significant communication barriers with standard interfaces and no real-time translation tools.",
    solution:"Transformer-based vision model trained on ASL gesture datasets using PyTorch, with real-time inference pipeline and an accessible web interface.",
    metrics:[{ k:"Accuracy",v:"95%" }, { k:"Framework",v:"PyTorch" }, { k:"Type",v:"Real-time" }, { k:"Domain",v:"ASL" }],
    tech:["PyTorch","Transformers","Computer Vision","OpenCV","Python","HuggingFace"],
    github:"https://github.com/mayarShappan/Soft_project", demo:null,
  },
  {
    id:"02", accent:"vi" as const,
    name:"Egypt Real Estate Valuation",
    category:"Data Science · Machine Learning · XGBoost",
    mockBg:"#0A0712",
    gradA:"rgba(139,92,246,.22)", gradB:"rgba(6,182,212,.16)",
    tagline:"An AI-driven system analyzing ~39,000 real estate listings in Egypt to predict property prices using advanced ML techniques with XGBoost.",
    problem:"Egypt's real estate market lacked reliable data-driven pricing tools, leaving buyers and sellers relying on inconsistent manual estimates.",
    solution:"Built a full ML pipeline with extensive data cleaning on ~39,000 listings, log-transformed price scaling, and XGBoost as the best-performing model for accurate property price prediction.",
    metrics:[{ k:"Records",v:"39K+" }, { k:"Best Model",v:"XGBoost" }, { k:"Price Scaling",v:"Log-Transformed" }, { k:"Stack",v:"Python" }],
    tech:["Python","scikit-learn","XGBoost","Pandas","Data Cleaning"],
    github:"https://github.com/RahmaElhagary/Real_estate_project", demo:null,
  },
];

function Projects() {
  const [expanded, setExpanded] = useState<string|null>(null);
  return (
    <section id="projects" style={{ padding:"120px 0", background:T.bg2, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:650, height:650, background:"radial-gradient(circle, rgba(139,92,246,.04) 0%, transparent 60%)", pointerEvents:"none" }}/>
      <div className="max-w-7xl mx-auto px-8">
        <GoldSectionTitle>Projects</GoldSectionTitle>
        <div className="grid lg:grid-cols-3 gap-6 mt-14">
          {PROJECTS.map(p => <ProjectCard key={p.id} p={p} open={expanded===p.id} onToggle={()=>setExpanded(expanded===p.id?null:p.id)} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, open, onToggle }: { p:typeof PROJECTS[0]; open:boolean; onToggle:()=>void }) {
  const [h,setH]=useState(false);
  const ac = p.accent==="em" ? T.em : T.vi;
  const gl = p.accent==="em" ? T.emGlow : T.viGlow;
  const bH = p.accent==="em" ? T.bdrEmH : T.bdrViH;

  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      ...G(p.accent),
      overflow:"hidden", display:"flex", flexDirection:"column",
      borderColor: open ? bH : h ? bH : p.accent==="em" ? T.bdrEm : T.bdrVi,
      transform: h||open?"translateY(-4px)":"none",
      boxShadow: h||open?`0 24px 64px -8px ${p.accent==="em"?"rgba(16,185,129,.14)":"rgba(139,92,246,.14)"}`:
                         `0 4px 20px rgba(0,0,0,.35)`,
    }}>
      {/* Thumbnail */}
      <div style={{ height:168, background:p.mockBg, position:"relative", overflow:"hidden", flexShrink:0 }}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${p.gradA} 0%, ${p.gradB} 100%)` }}/>
        {p.id === "02" ? (
          <img
            src={edaThumb}
            alt="EDA charts thumbnail"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"top left", opacity:.82 }}
          />
        ) : p.id === "01" ? (
          <img
            src={signNovaThumb}
            alt="SignNova ASL recognition system"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", opacity:.82 }}
          />
        ) : (
          /* Faux UI for other projects */
          <div style={{ position:"absolute", inset:0, padding:"1rem" }}>
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {["#FF5F57","#FFBD2E","#28C840"].map(c=><span key={c} style={{ width:9,height:9,borderRadius:"50%",background:c,display:"inline-block" }}/>)}
            </div>
            {[[75,35],[55,60],[42,50]].map(([a,b],i) => (
              <div key={i} style={{ display:"flex",gap:8,marginBottom:8 }}>
                <div style={{ height:i===0?20:13,width:`${a}%`,borderRadius:5,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.07)" }}/>
                <div style={{ height:i===0?20:13,width:`${b}%`,borderRadius:5,background:i===0?`${gl}`:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.05)" }}/>
              </div>
            ))}
          </div>
        )}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:56, background:`linear-gradient(to top, ${p.mockBg}, transparent)` }}/>
        <div style={{ position:"absolute", top:10, right:10, fontFamily:"var(--font-mono)", fontSize:".6rem", color:ac, background:"rgba(0,0,0,.6)", padding:"2px 8px", borderRadius:5, border:`1px solid ${p.accent==="em"?T.bdrEm:T.bdrVi}` }}>/{p.id}</div>
      </div>

      {/* Body */}
      <div style={{ padding:"1.5rem", flexGrow:1, display:"flex", flexDirection:"column" }}>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:".58rem", color:ac, letterSpacing:".08em", marginBottom:6, fontWeight:500 }}>{p.category}</div>
        <h3 style={{ fontWeight:700, fontSize:"1.05rem", color:T.text, letterSpacing:"-.025em", marginBottom:6, lineHeight:1.3 }}>{p.name}</h3>
        <p style={{ fontSize:".82rem", color:T.textDim, lineHeight:1.7, marginBottom:14 }}>{p.tagline}</p>

        {/* Metric boxes */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:7, marginBottom:14 }}>
          {p.metrics.map(({ k,v }) => (
            <div key={k} style={{
              padding:"9px 11px", borderRadius:10,
              background:T.glassDark, border:`1px solid ${T.bdr}`,
            }}>
              <div style={{ fontFamily:"var(--font-mono)", fontWeight:700, fontSize:".92rem", color:ac, lineHeight:1, letterSpacing:"-.025em" }}>{v}</div>
              <div style={{ fontSize:".6rem", color:T.textFaint, marginTop:3 }}>{k}</div>
            </div>
          ))}
        </div>

        {/* Expand */}
        <button onClick={onToggle} style={{
          fontFamily:"var(--font-mono)", fontSize:".67rem", color: open ? ac : T.textDim,
          background:"transparent", border:"none", cursor:"pointer",
          textAlign:"left", padding:"5px 0", display:"flex", alignItems:"center", gap:5,
          transition:"color .15s",
        }}>
          <span style={{ display:"inline-block", transform:open?"rotate(90deg)":"none", transition:"transform .22s" }}>›</span>
          {open ? "Collapse case study" : "Expand case study"}
        </button>

        {/* Expanded content */}
        <div style={{ maxHeight:open?"900px":"0", overflow:"hidden", transition:"max-height .55s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ paddingTop:14, marginTop:6, borderTop:`1px solid ${T.bdr}` }}>
            <MiniBlock label="PROBLEM" color="#F59E0B" text={p.problem} />
            <MiniBlock label="SOLUTION" color={ac} text={p.solution} />

            {/* EDA dashboard — only for Real Estate project */}
            {p.id === "02" && (
              <div style={{ marginTop:18 }}>
                {/* Heading */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ width:3, height:32, borderRadius:2, background:"linear-gradient(180deg,#F59E0B,#FCD34D)", flexShrink:0 }}/>
                  <div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:".58rem", color:"#F59E0B", letterSpacing:".1em", fontWeight:600, marginBottom:2 }}>DATA ANALYSIS</div>
                    <div style={{ fontWeight:700, fontSize:".82rem", color:T.text, letterSpacing:"-.02em", lineHeight:1.2 }}>
                      Exploratory Data Analysis (EDA) &amp; Data Preprocessing Insights
                    </div>
                  </div>
                </div>

                {/* Chart image card */}
                <div style={{
                  borderRadius:12,
                  border:"1px solid rgba(245,158,11,.2)",
                  overflow:"hidden",
                  background:"rgba(8,14,26,.8)",
                  boxShadow:"0 8px 32px rgba(0,0,0,.45), inset 0 0 40px rgba(245,158,11,.02)",
                  position:"relative",
                }}>
                  {/* Top bar */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:6, padding:"8px 12px",
                    borderBottom:"1px solid rgba(245,158,11,.12)",
                    background:"rgba(245,158,11,.04)",
                  }}>
                    {["#FF5F57","#FFBD2E","#28C840"].map(c => (
                      <span key={c} style={{ width:8, height:8, borderRadius:"50%", background:c, display:"inline-block" }}/>
                    ))}
                    <span style={{ fontFamily:"var(--font-mono)", fontSize:".56rem", color:"rgba(245,158,11,.55)", marginLeft:6, letterSpacing:".06em" }}>
                      eda_preprocessing_analysis.png
                    </span>
                  </div>

                  <div style={{
                    minHeight:220, display:"flex", alignItems:"center", justifyContent:"center",
                    padding:24, color:"rgba(245,158,11,.7)", textAlign:"center",
                    fontFamily:"var(--font-mono)", fontSize:".72rem", letterSpacing:".04em",
                  }}>
                    EDA &amp; data preprocessing dashboard
                  </div>

                  {/* Subtle bottom glow overlay */}
                  <div style={{
                    position:"absolute", bottom:0, left:0, right:0, height:28,
                    background:"linear-gradient(to top, rgba(8,14,26,.6), transparent)",
                    pointerEvents:"none",
                  }}/>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:14, marginTop:"auto", borderTop:`1px solid ${T.bdr}` }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {p.tech.map(t => <MonoChip key={t} label={t} accent={p.accent} small />)}
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <TinyBtn href={p.github}>GitHub</TinyBtn>
            {p.demo&&<TinyBtn href={p.demo} accent={ac}>Demo ↗</TinyBtn>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SKILLS
══════════════════════════════════════════ */
const SKILL_CARDS = [
  {
    emoji: "🧠",
    title: "AI & Machine Learning",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing (NLP)",
      "Computer Vision",
      "Prompt Engineering",
      "Transformers",
    ],
  },
  {
    emoji: "💻",
    title: "Programming & Core CS",
    skills: [
      "Python",
      "C++",
      "Object-Oriented Programming (OOP)",
      "Data Structures",
      "Algorithms",
      "Git & GitHub",
    ],
  },
  {
    emoji: "📊",
    title: "Data & Math",
    skills: [
      "Data Preprocessing",
      "Data Cleaning",
      "Data Visualization",
      "Applied Statistics",
      "Linear Algebra",
    ],
  },
  {
    emoji: "🚀",
    title: "Cloud & MLOps",
    skills: [
      "Microsoft Azure AI",
      "MLOps",
      "MLflow",
      "Hugging Face",
    ],
  },
];

function Skills() {
  return (
    <section id="skills" style={{ padding:"120px 0", background:T.bg1, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:800, height:500, background:"radial-gradient(ellipse, rgba(245,158,11,.03) 0%, transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-5%", right:"-5%", width:500, height:500, background:"radial-gradient(circle, rgba(139,92,246,.04) 0%, transparent 62%)", pointerEvents:"none" }}/>

      <div className="max-w-6xl mx-auto px-8" style={{ position:"relative" }}>
        <GoldSectionTitle>Skills</GoldSectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}
          className="skills-grid">
          {SKILL_CARDS.map(card => <SkillCard key={card.title} card={card} />)}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ card }: { card: typeof SKILL_CARDS[0] }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...G("n"),
        border: `1px solid ${h ? "rgba(245,158,11,.42)" : "rgba(245,158,11,.16)"}`,
        boxShadow: h
          ? "0 24px 64px -8px rgba(245,158,11,.14), 0 4px 24px rgba(0,0,0,.35)"
          : "0 4px 24px rgba(0,0,0,.28)",
        transform: h ? "translateY(-5px)" : "none",
        transition: "border-color .25s, box-shadow .25s, transform .28s",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top gold accent stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, rgba(245,158,11,${h ? ".7" : ".3"}) 0%, rgba(252,211,77,${h ? ".5" : ".18"}) 60%, transparent 100%)`,
        transition: "opacity .28s",
      }} />

      {/* Card header */}
      <div style={{
        padding: "1.6rem 1.75rem 1.3rem",
        borderBottom: `1px solid rgba(245,158,11,.09)`,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: h ? "rgba(245,158,11,.16)" : "rgba(245,158,11,.08)",
          border: `1px solid ${h ? "rgba(245,158,11,.38)" : "rgba(245,158,11,.18)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
          boxShadow: h ? "0 0 28px rgba(245,158,11,.28), inset 0 0 14px rgba(245,158,11,.06)" : "none",
          transition: "all .28s",
        }}>{card.emoji}</span>
        <span style={{
          fontWeight: 800, fontSize: "1rem",
          letterSpacing: "-.025em", lineHeight: 1.25,
          color: h ? "#FDE68A" : "#FCD34D",
          transition: "color .2s",
          filter: h ? "drop-shadow(0 0 10px rgba(245,158,11,.45))" : "none",
        }}>{card.title}</span>
      </div>

      {/* Skill pills */}
      <div style={{ padding: "1.4rem 1.75rem 1.8rem", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {card.skills.map(sk => <SkillPill key={sk} label={sk} />)}
      </div>
    </div>
  );
}

function SkillPill({ label }: { label: string }) {
  const [h, setH] = useState(false);
  return (
    <span
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontSize: ".8rem", fontWeight: 500,
        padding: "7px 15px", borderRadius: 999,
        background: h ? "rgba(245,158,11,.13)" : "rgba(255,255,255,.045)",
        color: h ? "#FDE68A" : T.textSub,
        border: `1px solid ${h ? "rgba(245,158,11,.45)" : "rgba(255,255,255,.08)"}`,
        boxShadow: h ? "0 0 14px rgba(245,158,11,.18)" : "none",
        transition: "all .18s ease",
        cursor: "default", lineHeight: 1,
        display: "inline-flex", alignItems: "center", gap: 7,
      }}
    >
      <span style={{
        width: 4, height: 4, borderRadius: "50%", flexShrink: 0,
        background: h ? "#F59E0B" : "rgba(245,158,11,.35)",
        boxShadow: h ? "0 0 6px #F59E0B" : "none",
        transition: "all .18s ease",
        display: "inline-block",
      }} />
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════
   CONTACT
══════════════════════════════════════════ */
function Contact() {
  const gold = "#F59E0B";
  const goldL = "#FCD34D";
  const goldGlow = "rgba(245,158,11,.10)";
  const goldBdr = "rgba(245,158,11,.20)";

  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          reply_to: form.email,
          subject: form.subject,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      setFeedback("Your message has been sent successfully.");
      setForm({ name:"", email:"", subject:"", message:"" });
    } catch (error) {
      console.error("EmailJS failed to send the contact form:", error);
      setStatus("error");
      setFeedback("Something went wrong while sending your message. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width:"100%", padding:"11px 14px", borderRadius:10,
    background:"rgba(255,255,255,.04)", border:`1px solid ${T.bdr}`,
    color:T.text, fontSize:".9rem", outline:"none",
    transition:"border-color .2s, box-shadow .2s",
    fontFamily:"inherit",
  };
  const labelStyle: React.CSSProperties = {
    display:"block", fontSize:".75rem", fontWeight:600,
    color:T.textDim, marginBottom:6, letterSpacing:".04em",
  };

  return (
    <section id="contact" style={{ padding:"120px 0", background:T.bg, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:900, height:600, background:"radial-gradient(ellipse, rgba(245,158,11,.04) 0%, transparent 60%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, right:0, width:480, height:480, background:"radial-gradient(circle, rgba(139,92,246,.04) 0%, transparent 65%)", pointerEvents:"none" }}/>

      <div className="max-w-6xl mx-auto px-8" style={{ position:"relative" }}>

        {/* Centered gold title */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <h2 className="grad-text-gold" style={{
            fontWeight:800, fontSize:"clamp(2rem,4vw,2.8rem)",
            letterSpacing:"-.04em", lineHeight:1.1,
            filter:`drop-shadow(0 0 18px rgba(245,158,11,.3))`,
          }}>Contact Me</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: Form card ── */}
          <div style={{
            ...G("n"),
            border:`1px solid ${goldBdr}`,
            padding:"2.25rem",
            boxShadow:"0 8px 40px rgba(0,0,0,.3)",
          }}>
            <h3 style={{ fontWeight:700, fontSize:"1.1rem", color:gold, marginBottom:6, letterSpacing:"-.02em" }}>
              Send Direct Message
            </h3>
            <p style={{ fontSize:".84rem", color:T.textMuted, lineHeight:1.7, marginBottom:24 }}>
              Have a project in mind or want to collaborate? Drop me a line!
            </p>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>FULL NAME</label>
                <input
                  type="text" required placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name:e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor=gold; e.target.style.boxShadow=`0 0 0 3px rgba(245,158,11,.1)`; }}
                  onBlur={e => { e.target.style.borderColor=T.bdr; e.target.style.boxShadow="none"; }}
                />
              </div>
              {/* Email */}
              <div>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input
                  type="email" required placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email:e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor=gold; e.target.style.boxShadow=`0 0 0 3px rgba(245,158,11,.1)`; }}
                  onBlur={e => { e.target.style.borderColor=T.bdr; e.target.style.boxShadow="none"; }}
                />
              </div>
              {/* Subject */}
              <div>
                <label style={labelStyle}>SUBJECT</label>
                <input
                  type="text" required placeholder="Project / Collaboration / Other"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject:e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor=gold; e.target.style.boxShadow=`0 0 0 3px rgba(245,158,11,.1)`; }}
                  onBlur={e => { e.target.style.borderColor=T.bdr; e.target.style.boxShadow="none"; }}
                />
              </div>
              {/* Message */}
              <div>
                <label style={labelStyle}>YOUR MESSAGE</label>
                <textarea
                  required rows={5} placeholder="Tell me about your project or idea..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message:e.target.value }))}
                  style={{ ...inputStyle, resize:"vertical", minHeight:120 }}
                  onFocus={e => { e.target.style.borderColor=gold; e.target.style.boxShadow=`0 0 0 3px rgba(245,158,11,.1)`; }}
                  onBlur={e => { e.target.style.borderColor=T.bdr; e.target.style.boxShadow="none"; }}
                />
              </div>
              {/* Submit */}
              <button type="submit" style={{
                padding:"12px 0", borderRadius:12, border:"none",
                cursor: status === "sending" ? "wait" : "pointer",
                background: status === "success" ? "rgba(34,197,94,.18)" : `linear-gradient(90deg, ${gold}, ${goldL})`,
                color: status === "success" ? "#22C55E" : "#0A0F1A",
                fontWeight:700, fontSize:".95rem",
                boxShadow: status === "success" ? "0 0 20px rgba(34,197,94,.25)" : `0 0 24px rgba(245,158,11,.3)`,
                transition:"all .25s",
              }} disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : status === "success" ? "✓ Message Sent!" : "✉️ Send Message"}
              </button>
              {feedback && (
                <p style={{
                  margin:0, fontSize:".82rem", lineHeight:1.5, textAlign:"center",
                  color: status === "error" ? "#FCA5A5" : "#86EFAC",
                }} role="status" aria-live="polite">
                  {feedback}
                </p>
              )}
            </form>
          </div>

          {/* ── Right: Info cards + socials ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Info cards */}
            {[
              {
                icon:<svg width="18" height="18" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5l6.5 4.5L14 5" stroke="currentColor" strokeWidth="1.2"/></svg>,
                label:"Email", value:"rmelhagary@gmail.com", href:"mailto:rmelhagary@gmail.com",
              },
              {
                icon:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 2h3.5l1.5 4-2 1.5a10 10 0 0 0 4.5 4.5L12 10l4 1.5V15a2 2 0 0 1-2 2C6 17 1 12 1 4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
                label:"Phone", value:"+20 10 1374 2751", href:"tel:+20201013742751",
              },
              {
                icon:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1a6 6 0 0 1 6 6c0 4-6 10-6 10S3 11 3 7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.4"/><circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
                label:"Location", value:"Damietta, Egypt", href:null,
              },
            ].map(({ icon, label, value, href }) => (
              <div key={label} style={{
                ...G("n"),
                border:`1px solid ${goldBdr}`,
                padding:"1.25rem 1.5rem",
                display:"flex", alignItems:"center", gap:16,
                boxShadow:"0 4px 20px rgba(0,0,0,.2)",
                transition:"border-color .25s, transform .25s, box-shadow .25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(245,158,11,.42)"; (e.currentTarget as HTMLElement).style.transform="translateX(4px)"; (e.currentTarget as HTMLElement).style.boxShadow=`0 8px 32px rgba(245,158,11,.1)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=goldBdr; (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.boxShadow="0 4px 20px rgba(0,0,0,.2)"; }}
              >
                <div style={{
                  width:44, height:44, borderRadius:12, flexShrink:0,
                  background:goldGlow, border:`1px solid ${goldBdr}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:gold,
                }}>{icon}</div>
                <div>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:".6rem", color:T.textFaint, letterSpacing:".08em", marginBottom:3 }}>{label.toUpperCase()}</div>
                  {href ? (
                    <a href={href} style={{ fontSize:".9rem", color:T.textSub, fontWeight:500, textDecoration:"none" }}
                      onMouseEnter={e => e.currentTarget.style.color=goldL}
                      onMouseLeave={e => e.currentTarget.style.color=T.textSub}>
                      {value}
                    </a>
                  ) : (
                    <span style={{ fontSize:".9rem", color:T.textSub, fontWeight:500 }}>{value}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Social icon buttons */}
            <div style={{ display:"flex", gap:12, marginTop:8 }}>
              {[
                { label:"LinkedIn", href:"https://linkedin.com/in/rahma-elhagary", icon:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7v6M5 4.5v.5M8 13V9.5C8 8.1 9 7 10.5 7S13 8.1 13 9.5V13M8 7v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
                { label:"GitHub", href:"https://github.com/RahmaElhagary", icon:<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34C4.73 15.4 4.26 13.8 4.26 13.8A2.2 2.2 0 0 0 3.34 12.5c-.75-.51.06-.5.06-.5a1.74 1.74 0 0 1 1.27.85 1.77 1.77 0 0 0 2.42.69 1.77 1.77 0 0 1 .53-1.11C5.3 12.19 3.5 11.52 3.5 8.5a3.1 3.1 0 0 1 .82-2.14 2.87 2.87 0 0 1 .08-2.11s.67-.22 2.2.82a7.57 7.57 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82a2.87 2.87 0 0 1 .08 2.11A3.1 3.1 0 0 1 13.5 8.5c0 3.03-1.8 3.69-3.53 3.88a1.98 1.98 0 0 1 .56 1.54v2.28c0 .21.14.46.55.38A8 8 0 0 0 9 1z" stroke="currentColor" strokeWidth=".5" fill="currentColor"/></svg> },
              ].map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  title={label}
                  style={{
                    width:48, height:48, borderRadius:"50%",
                    background:goldGlow, border:`1px solid ${goldBdr}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:gold, transition:"all .22s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background=`rgba(245,158,11,.2)`; (e.currentTarget as HTMLElement).style.borderColor="rgba(245,158,11,.5)"; (e.currentTarget as HTMLElement).style.transform="translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow=`0 8px 24px rgba(245,158,11,.2)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background=goldGlow; (e.currentTarget as HTMLElement).style.borderColor=goldBdr; (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.boxShadow="none"; }}
                >
                  {icon}
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginTop:40, paddingTop:24, borderTop:`1px solid rgba(255,255,255,.07)` }}>
          {/* Left: copyright */}
          <span style={{ fontSize:".82rem", color:"rgba(148,163,184,.65)", fontWeight:400 }}>
            © {new Date().getFullYear()}{" "}
            <span style={{ color:"#F59E0B", fontWeight:600 }}>Rahma Elhagary</span>
            . All rights reserved.
          </span>

          {/* Right: social icon buttons */}
          <div style={{ display:"flex", gap:10 }}>
            {[
              {
                href: "https://linkedin.com/in/rahma-elhagary",
                label: "LinkedIn",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M5 7v6M5 4.5v.5M8 13V9.5C8 8.1 9 7 10.5 7S13 8.1 13 9.5V13M8 7v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                href: "https://github.com/RahmaElhagary",
                label: "GitHub",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34C4.73 15.4 4.26 13.8 4.26 13.8A2.2 2.2 0 0 0 3.34 12.5c-.75-.51.06-.5.06-.5a1.74 1.74 0 0 1 1.27.85 1.77 1.77 0 0 0 2.42.69 1.77 1.77 0 0 1 .53-1.11C5.3 12.19 3.5 11.52 3.5 8.5a3.1 3.1 0 0 1 .82-2.14 2.87 2.87 0 0 1 .08-2.11s.67-.22 2.2.82a7.57 7.57 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82a2.87 2.87 0 0 1 .08 2.11A3.1 3.1 0 0 1 13.5 8.5c0 3.03-1.8 3.69-3.53 3.88a1.98 1.98 0 0 1 .56 1.54v2.28c0 .21.14.46.55.38A8 8 0 0 0 9 1z" stroke="currentColor" strokeWidth=".5" fill="currentColor"/>
                  </svg>
                ),
              },
              {
                href: "mailto:rmelhagary@gmail.com",
                label: "Email",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="4" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M1 6l8 5.5L17 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target={label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                title={label}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(148,163,184,.6)",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.08)",
                  transition: "all .2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "#F59E0B";
                  el.style.background = "rgba(245,158,11,.1)";
                  el.style.borderColor = "rgba(245,158,11,.35)";
                  el.style.boxShadow = "0 0 14px rgba(245,158,11,.2)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "rgba(148,163,184,.6)";
                  el.style.background = "rgba(255,255,255,.04)";
                  el.style.borderColor = "rgba(255,255,255,.08)";
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   EDUCATION
══════════════════════════════════════════ */
function Education() {
  const gold = "#F59E0B";
  const goldL = "#FCD34D";
  const goldGlow = "rgba(245,158,11,.13)";
  const goldBdr = "rgba(245,158,11,.22)";
  const goldBdrH = "rgba(245,158,11,.45)";

  return (
    <section id="education" style={{ padding:"120px 0", background:T.bg, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:420, background:"radial-gradient(ellipse, rgba(245,158,11,.03) 0%, transparent 65%)", pointerEvents:"none" }}/>

      <div className="max-w-3xl mx-auto px-8" style={{ position:"relative" }}>

        {/* Centered title */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <h2 className="grad-text-gold" style={{ fontWeight:800, fontSize:"clamp(2rem,4vw,2.8rem)", letterSpacing:"-.04em", lineHeight:1.1 }}>
            Education
          </h2>
        </div>

        {/* Single education card */}
        <EduCard gold={gold} goldL={goldL} goldGlow={goldGlow} goldBdr={goldBdr} goldBdrH={goldBdrH} />

      </div>
    </section>
  );
}

function EduCard({ gold, goldL, goldGlow, goldBdr, goldBdrH }: { gold:string; goldL:string; goldGlow:string; goldBdr:string; goldBdrH:string }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...G("n"),
        border: `1px solid ${h ? goldBdrH : goldBdr}`,
        boxShadow: h
          ? `0 20px 60px rgba(245,158,11,.12), 0 0 0 1px ${goldBdr}`
          : "0 6px 32px rgba(0,0,0,.3)",
        transform: h ? "translateY(-3px)" : "none",
        transition: "border-color .28s, box-shadow .28s, transform .28s",
        padding: "clamp(1.75rem,4vw,2.5rem)",
        display: "flex", gap: "1.75rem", alignItems: "flex-start",
      }}
    >
      {/* Graduation cap icon */}
      <div style={{
        width: 60, height: 60, borderRadius: 16, flexShrink: 0,
        background: goldGlow,
        border: `1px solid ${h ? goldBdrH : goldBdr}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: h ? `0 0 24px rgba(245,158,11,.2)` : "none",
        transition: "box-shadow .28s, border-color .28s",
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 4L26 10l-12 6L2 10 14 4z" stroke={gold} strokeWidth="1.6" strokeLinejoin="round" fill={goldGlow}/>
          <path d="M6 13v7c0 2.2 3.6 4 8 4s8-1.8 8-4v-7" stroke={gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 10v6" stroke={gold} strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="26" cy="17" r="1.2" fill={gold}/>
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 12px", borderRadius: 999, marginBottom: 14,
          background: goldGlow, border: `1px solid ${goldBdr}`,
        }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:".6rem", color: gold, letterSpacing:".1em", fontWeight: 600 }}>UNDERGRADUATE DEGREE</span>
        </div>

        {/* Institution */}
        <div style={{ fontWeight: 800, fontSize: "1.18rem", color: T.text, letterSpacing: "-.03em", lineHeight: 1.2, marginBottom: 4 }}>
          Damietta University
        </div>

        {/* Degree */}
        <div style={{ fontSize: ".95rem", color: T.textSub, fontWeight: 500, lineHeight: 1.45, marginBottom: 20 }}>
          Bachelor&apos;s Degree in Computer Science and Artificial Intelligence
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { icon: "📈", text: `GPA: 3.7 / 4.0 — Ranked 1st in the class`, color: goldL },
            { icon: "📅", text: "09/2023 — 2027 (Expected)", color: T.textSub },
            { icon: "📍", text: "Damietta, Egypt", color: T.textSub },
          ].map(({ icon, text, color }) => (
            <div key={text} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "7px 14px", borderRadius: 10,
              background: "rgba(255,255,255,.04)", border: `1px solid ${T.bdr}`,
            }}>
              <span style={{ fontSize: ".85rem" }}>{icon}</span>
              <span style={{ fontSize: ".8rem", color, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   EXPERIENCE
══════════════════════════════════════════ */
const EXPERIENCE = [
  {
    accent: "vi" as const,
    badge: "INTERNSHIP",
    badgeBg: "rgba(139,92,246,.10)",
    icon: <IcBuilding color="#8B5CF6" />,
    role: "AI & Machine Learning Trainee",
    company: "DEPI",
    location: "Hybrid",
    date: "07/2026 – Present",
    bullets: [
      "Engineered and deployed Python ML/DL models (NLP, Vision, Prompt Engineering) on Azure cloud infrastructure.",
      "Implemented MLOps best practices via MLflow and Hugging Face.",
    ],
  },
  {
    accent: "em" as const,
    badge: "MENTORSHIP",
    badgeBg: "rgba(16,185,129,.10)",
    icon: <IcUsers color="#10B981" />,
    role: "Mentor, ACPC Damietta Club",
    company: "ACPC Damietta Club",
    location: "Damietta, Egypt",
    date: "2025 – Present",
    bullets: [
      "Led and mentored a group of 20+ students in advanced Data Structures and Algorithms, providing structured guidance on algorithmic logic and competitive programming.",
    ],
  },
];

function IcBriefcase({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="7" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M7 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 12h18" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}
function IcBuilding({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="16" height="18" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <path d="M7 8h2M13 8h2M7 12h2M13 12h2M9 21v-4h4v4" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IcUsers({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="8" cy="8" r="3.5" stroke={color} strokeWidth="1.5"/>
      <path d="M1 19c0-3.87 3.13-7 7-7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="7" r="2.5" stroke={color} strokeWidth="1.3"/>
      <path d="M21 19c0-3.31-2.69-6-6-6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function Experience() {
  return (
    <section id="experience" style={{ padding:"120px 0", background:T.bg2, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"30%", right:"-5%", width:600, height:600, background:"radial-gradient(circle, rgba(16,185,129,.04) 0%, transparent 62%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"10%", left:"-5%", width:500, height:500, background:"radial-gradient(circle, rgba(139,92,246,.035) 0%, transparent 62%)", pointerEvents:"none" }}/>

      <div className="max-w-3xl mx-auto px-8" style={{ position:"relative" }}>

        {/* Centered title */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <GoldSectionTitle>Experience</GoldSectionTitle>
        </div>

        {/* Timeline stack */}
        <div style={{ position:"relative", display:"flex", flexDirection:"column", gap:0 }}>
          {/* Vertical connector line */}
          <div style={{
            position:"absolute", left:29, top:60, bottom:60, width:1,
            background:`linear-gradient(to bottom, rgba(16,185,129,.35), rgba(139,92,246,.25), rgba(16,185,129,.2))`,
            zIndex:0,
          }}/>

          {EXPERIENCE.map((e, idx) => {
            const ac = e.accent === "em" ? T.em : T.vi;
            const gl = e.accent === "em" ? T.emGlow : T.viGlow;
            const brd = e.accent === "em" ? T.bdrEm : T.bdrVi;
            const brdH = e.accent === "em" ? T.bdrEmH : T.bdrViH;
            return (
              <ExpCard key={e.role} e={e} ac={ac} gl={gl} brd={brd} brdH={brdH} last={idx === EXPERIENCE.length - 1} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExpCard({ e, ac, gl, brd, brdH, last }: {
  e: typeof EXPERIENCE[0]; ac: string; gl: string; brd: string; brdH: string; last: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <div style={{ display:"flex", gap:0, alignItems:"stretch", marginBottom: last ? 0 : 20, position:"relative", zIndex:1 }}>
      {/* Timeline column */}
      <div style={{ width:60, flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:26 }}>
        <div style={{
          width:14, height:14, borderRadius:"50%", flexShrink:0,
          background: ac, boxShadow:`0 0 16px ${ac}, 0 0 4px ${ac}`,
          border:`2px solid ${T.bg2}`,
        }}/>
      </div>

      {/* Card */}
      <div style={{ flex:1 }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        <div style={{
          ...G(e.accent),
          padding:"1.75rem 2rem",
          borderColor: h ? brdH : brd,
          boxShadow: h ? `0 18px 56px -8px ${gl.replace("rgba(","rgba(").replace(",.14",",.22")}` : "0 4px 20px rgba(0,0,0,.3)",
          transform: h ? "translateX(4px)" : "none",
          transition:"border-color .25s, box-shadow .25s, transform .25s",
        }}>
          {/* Top row */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              {/* Icon box */}
              <div style={{
                width:44, height:44, borderRadius:12, flexShrink:0,
                background: e.badgeBg, border:`1px solid ${brd}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow: h ? `0 0 18px ${gl}` : "none",
                transition:"box-shadow .25s",
              }}>{e.icon}</div>
              <div>
                {/* Badge */}
                <span style={{
                  fontFamily:"var(--font-mono)", fontSize:".58rem", color:ac,
                  letterSpacing:".1em", fontWeight:700,
                  padding:"2px 10px", borderRadius:5,
                  background:e.badgeBg, border:`1px solid ${brd}`,
                  display:"inline-block", marginBottom:6,
                }}>{e.badge}</span>
                <h3 style={{ fontWeight:700, fontSize:"1.02rem", color:T.text, letterSpacing:"-.02em", lineHeight:1.2, margin:0 }}>{e.role}</h3>
                <div style={{ fontSize:".82rem", color:T.textDim, marginTop:4, display:"flex", gap:8, flexWrap:"wrap" }}>
                  <span style={{ color:T.textSub, fontWeight:500 }}>{e.company}</span>
                  <span style={{ color:T.textFaint }}>·</span>
                  <span>{e.location}</span>
                </div>
              </div>
            </div>
            {/* Date chip */}
            <div style={{
              fontFamily:"var(--font-mono)", fontSize:".63rem", color:T.textDim,
              padding:"5px 13px", borderRadius:8, background:T.glassDark,
              border:`1px solid ${T.bdr}`, whiteSpace:"nowrap", flexShrink:0,
            }}>{e.date}</div>
          </div>

          {/* Divider */}
          <div style={{ borderTop:`1px solid ${T.bdr}`, marginBottom:14 }}/>

          {/* Bullets */}
          <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:9 }}>
            {e.bullets.map((b, i) => (
              <li key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:ac, flexShrink:0, marginTop:8, boxShadow:`0 0 7px ${ac}`, display:"inline-block" }}/>
                <span style={{ fontSize:".875rem", color:T.textMuted, lineHeight:1.82 }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════ */

function SectionLabel({ children, accent="em", centered }: { children:React.ReactNode; accent?:"em"|"vi"; centered?:boolean }) {
  const ac = accent==="em" ? T.em : T.vi;
  const gl = accent==="em" ? T.emGlow : T.viGlow;
  const brd = accent==="em" ? T.bdrEm : T.bdrVi;
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, background:gl, border:`1px solid ${brd}`, marginBottom:14, ...(centered?{margin:"0 auto 14px",display:"flex"}:{}) }}>
      <span style={{ width:5,height:5,borderRadius:"50%",background:ac,display:"inline-block" }}/>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:".62rem", color:ac, letterSpacing:".1em", fontWeight:600 }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children }: { children:React.ReactNode }) {
  return <h2 style={{ fontWeight:800, fontSize:"clamp(2rem,4.5vw,3rem)", letterSpacing:"-.04em", lineHeight:1.1, color:T.text, marginTop:4 }}>{children}</h2>;
}

function HoverCard({ children, accent="n", style: s }: { children:React.ReactNode; accent?:"em"|"vi"|"n"; style?:React.CSSProperties }) {
  const [h,setH]=useState(false);
  const bH = accent==="em" ? T.bdrEmH : accent==="vi" ? T.bdrViH : "rgba(245,158,11,.3)";
  const gl = accent==="em" ? "rgba(16,185,129,.12)" : accent==="vi" ? "rgba(139,92,246,.12)" : "rgba(245,158,11,.06)";
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      ...G(accent==="n"?"n":accent),
      ...s,
      transform: h?"translateY(-3px)":"none",
      borderColor: h ? bH : accent==="em" ? T.bdrEm : accent==="vi" ? T.bdrVi : T.bdr,
      boxShadow: h?`0 16px 48px -8px ${gl}`:
                   `0 4px 20px rgba(0,0,0,.3)`,
    }}>{children}</div>
  );
}

function PrimaryBtn({ href, children }: { href:string; children:React.ReactNode }) {
  const [h,setH]=useState(false);
  return (
    <a href={href} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      display:"inline-flex", alignItems:"center", gap:6,
      padding:".9rem 2.2rem", borderRadius:12,
      fontWeight:700, fontSize:".9rem",
      background: h
        ? "linear-gradient(90deg, #D97706, #F59E0B)"
        : "linear-gradient(90deg, #F59E0B, #FCD34D)",
      color:"#0A0F1A",
      boxShadow: h
        ? "0 0 36px rgba(245,158,11,.55)"
        : "0 0 20px rgba(245,158,11,.28)",
      transition:"all .22s",
      transform: h?"translateY(-2px)":"none",
    }}>{children}</a>
  );
}

function SecondaryBtn({ href, children }: { href:string; children:React.ReactNode }) {
  const [h,setH]=useState(false);
  return (
    <a href={href} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      display:"inline-flex", alignItems:"center", gap:6,
      padding:".9rem 2.2rem", borderRadius:12,
      fontWeight:600, fontSize:".9rem",
      background: h ? T.emGlowH : "transparent",
      color: h ? T.em : T.textSub,
      border:`1px solid ${h?T.bdrEmH:T.bdrMid}`,
      transition:"all .22s",
      transform: h?"translateY(-1px)":"none",
    }}>{children}</a>
  );
}

function MonoChip({ label, accent, small }: { label:string; accent:"em"|"vi"; small?:boolean }) {
  const ac = accent==="em" ? T.em : T.vi;
  const gl = accent==="em" ? T.emGlow : T.viGlow;
  const brd = accent==="em" ? T.bdrEm : T.bdrVi;
  return (
    <span style={{
      fontFamily:"var(--font-mono)", fontSize: small?".58rem":".63rem", fontWeight:500,
      padding: small?"3px 8px":"4px 12px", borderRadius:6,
      background:gl, color:ac, border:`1px solid ${brd}`,
    }}>{label}</span>
  );
}

function MiniBlock({ label, color, text }: { label:string; color:string; text:string }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:".58rem", color, letterSpacing:".1em", marginBottom:5, display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ width:4,height:4,borderRadius:"50%",background:color,display:"inline-block" }}/>{label}
      </div>
      <p style={{ fontSize:".8rem", color:T.textMuted, lineHeight:1.75 }}>{text}</p>
    </div>
  );
}

function TinyBtn({ href, children, accent }: { href:string; children:React.ReactNode; accent?:string }) {
  const [h,setH]=useState(false);
  return (
    <a href={href} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      fontFamily:"var(--font-mono)", fontSize:".6rem", fontWeight:500,
      padding:"4px 10px", borderRadius:6,
      border:`1px solid ${T.bdr}`, color: h?(accent||T.em):T.textDim,
      background: h ? T.emGlow : "transparent", transition:"all .15s",
    }}>{children}</a>
  );
}

/* ── Profile illustration ── */
function HeroAvatar() {
  return (
    <svg width="180" height="200" viewBox="0 0 180 200" fill="none">
      <circle cx="90" cy="75" r="46" fill="rgba(16,185,129,.1)" stroke="rgba(16,185,129,.2)" strokeWidth="1"/>
      <circle cx="90" cy="68" r="26" fill="rgba(16,185,129,.15)" stroke="rgba(16,185,129,.25)" strokeWidth=".8"/>
      <ellipse cx="90" cy="160" rx="54" ry="32" fill="rgba(16,185,129,.07)"/>
      <circle cx="90" cy="62" r="20" fill="rgba(139,92,246,.2)" stroke="rgba(139,92,246,.3)" strokeWidth=".7"/>
      {[[24,28],[156,28],[14,110],[166,110],[60,178],[120,178]].map(([x,y],i) => (
        <g key={i}>
          <line x1="90" y1="75" x2={x} y2={y} stroke={i%2===0?"rgba(16,185,129,.18)":"rgba(139,92,246,.18)"} strokeWidth=".8"/>
          <circle cx={x} cy={y} r="3" fill={i%2===0?"rgba(16,185,129,.4)":"rgba(139,92,246,.4)"}/>
        </g>
      ))}
    </svg>
  );
}

/* ── Service icons ── */
function SvcIcon1() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.5 3.5M15 15l3.4 3.4M18.4 5.6L15 9M9 15l-3.4 3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function SvcIcon2() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L20 7v5l-8 5-8-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 22v-5M20 12l-8 5M4 12l8 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>; }
function SvcIcon3() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity=".5"/><path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M6.3 6.3l-1.4-1.4M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcCode() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 4L1 8l4 4M11 4l4 4-4 4M9 2l-2 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcBrain() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C5.8 2 4 3.8 4 6c0 1 .4 2 1 2.6C3.8 9.4 3 10.6 3 12h10c0-1.4-.8-2.6-2-3.4.6-.6 1-1.6 1-2.6 0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5v3M6.5 6.5l1.5 2 1.5-2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcDeploy() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.5 4.5H5.5L8 1zM3 7h10M5.5 12h5M3.5 7v5h9V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcMail() { return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5l6.5 4.5L14 5" stroke="currentColor" strokeWidth="1.2"/></svg>; }
function IcCopy() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="3.5" y="3.5" width="7" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M2 8V1.5A.5.5 0 0 1 2.5 1h5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>; }

/* ══════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════ */
export default function App() {
  return (
    <div style={{ background:T.bg, minHeight:"100vh", position:"relative" }}>
      <NeuralMesh />
      <div style={{ position:"relative", zIndex:1 }}>
        <Nav />
        <Hero />
        <About />
        <Education />
        <Skills />
        <Experience />
        <Services />
        <Projects />
        <Contact />
      </div>
    </div>
  );
}
