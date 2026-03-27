import { useState, useEffect, useRef } from "react";

const DEFAULT_FB = "N/A — no specific feedback";
const getNPSType = (s) => s <= 6 ? "detractor" : s <= 8 ? "passive" : "promoter";
const getNPSLabel = (s) => s <= 6 ? "Detractor" : s <= 8 ? "Passive" : "Promoter";

const BLUE = "#0052FF";
const BLUE_LIGHT = "#E8F0FF";
const BLUE_DARK = "#0041CC";

const CSS = `
@keyframes checkDraw { to { stroke-dashoffset:0 } }
@keyframes fadeScale { 0% { opacity:0; transform:scale(0.8) } 100% { opacity:1; transform:scale(1) } }
@keyframes pulseRing { 0% { transform:scale(1); opacity:0.4 } 100% { transform:scale(1.6); opacity:0 } }
@keyframes floatIn { 0% { opacity:0; transform:translateY(20px) } 100% { opacity:1; transform:translateY(0) } }
@keyframes tickBounce { 0% { transform:scale(0) } 50% { transform:scale(1.2) } 70% { transform:scale(0.9) } 100% { transform:scale(1) } }
@keyframes fadeIn { 0% { opacity:0 } 100% { opacity:1 } }
@keyframes logoPulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.6; transform:scale(0.92) } }
@keyframes dotBounce { 0%,80%,100% { transform:scale(0) } 40% { transform:scale(1) } }
`;

const AnimatedVLogo = ({ size = 120 }) => {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div style={{ width: size, height: size, margin: "0 auto", position: "relative" }}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <rect width="120" height="120" rx="24" fill="#000" />
        <path d="M36 30L60 90L84 30" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 160, strokeDashoffset: drawn ? 0 : 160, transition: "stroke-dashoffset 1.2s cubic-bezier(0.65,0,0.35,1)" }} />
      </svg>
    </div>
  );
};

const LoadingOverlay = () => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(4px)", borderRadius: 12 }}>
    <div style={{ animation: "logoPulse 1.5s ease-in-out infinite" }}>
      <svg width={56} height={56} viewBox="0 0 120 120" fill="none">
        <rect width="120" height="120" rx="24" fill="#000" />
        <path d="M36 30L60 90L84 30" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <p style={{ fontSize: 14, fontWeight: 600, color: "#000", marginTop: 16 }}>Submitting your feedback</p>
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#000", animation: `dotBounce 1.4s infinite ease-in-out both`, animationDelay: `${i * 0.16}s` }} />
      ))}
    </div>
  </div>
);

const Slide = ({ children }) => {
  const [v, setV] = useState(false);
  useEffect(() => { setV(false); const t = setTimeout(() => setV(true), 20); return () => clearTimeout(t); }, []);
  return (<div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0) scale(1)" : "translateY(16px) scale(0.99)", transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)" }}>{children}</div>);
};

const Btn = ({ children, onClick, disabled, style: s }) => {
  const [hover, setHover] = useState(false);
  return <button style={{ padding: "14px 32px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", border: "none", transition: "all 0.2s", opacity: disabled ? 0.3 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", background: hover && !disabled ? BLUE_DARK : BLUE, color: "#fff", transform: hover && !disabled ? "translateY(-1px)" : "none", boxShadow: hover && !disabled ? "0 4px 16px rgba(0,82,255,0.3)" : "none", ...s }} onClick={disabled ? undefined : onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{children}</button>;
};

const NPSScale = ({ value, onSelect }) => {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value;
  return (
    <div>
      <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
        {[...Array(11)].map((_, i) => {
          const active = value === i, isHov = hovered === i, t = getNPSType(i);
          const bg = active ? BLUE : isHov ? (t === "promoter" ? "#E8F5E9" : t === "passive" ? "#FFF8E1" : "#FFEBEE") : "#fff";
          const border = active ? BLUE : isHov ? (t === "promoter" ? "#66BB6A" : t === "passive" ? "#FFB300" : "#EF5350") : "#E5E5E5";
          return (
            <button key={i} onClick={() => onSelect(i)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ flex: "1 1 0", minWidth: 0, height: 44, borderRadius: 9, border: `${active ? 2 : 1}px solid ${border}`, background: bg, color: active ? "#fff" : "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)", transform: active ? "scale(1.1)" : isHov ? "scale(1.05) translateY(-2px)" : "scale(1)", boxShadow: active ? "0 4px 16px rgba(0,82,255,0.3)" : isHov ? "0 2px 8px rgba(0,0,0,0.08)" : "none", fontFamily: "inherit", position: "relative", padding: 0 }}>
              {i}
              {active && <div style={{ position: "absolute", inset: -5, borderRadius: 13, border: "2px solid rgba(0,82,255,0.2)", animation: "pulseRing 1s ease-out" }} />}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
        <span style={{ fontSize: 10, color: "#CCC", fontWeight: 500 }}>Not at all</span>
        {display !== null && display !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 700, animation: "fadeScale 0.3s ease", color: getNPSType(display) === "promoter" ? "#2E7D32" : getNPSType(display) === "passive" ? "#F57F17" : "#C62828" }}>
            {display}/10 · {getNPSLabel(display)}
          </span>
        )}
        <span style={{ fontSize: 10, color: "#CCC", fontWeight: 500 }}>Absolutely</span>
      </div>
    </div>
  );
};

const FBField = ({ icon, label, fieldKey, feedbackRef }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 24, height: 24, borderRadius: 7, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#000" }}>{label}</span>
      <span style={{ fontSize: 10, color: "#CCC" }}>optional</span>
    </div>
    <textarea
      placeholder={`What should Voodoo ${fieldKey}?`}
      onChange={e => { feedbackRef.current[fieldKey] = e.target.value; }}
      onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = BLUE_LIGHT; }}
      onBlur={e => { e.target.style.borderColor = "#E5E5E5"; e.target.style.background = "#fff"; }}
      style={{ width: "100%", minHeight: 56, borderRadius: 10, border: "1px solid #E5E5E5", padding: "10px 14px", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", transition: "all 0.2s", color: "#000", background: "#fff" }}
    />
  </div>
);

const ProgressBar = ({ step, total }) => (
  <div style={{ height: 3, background: "#F0F0F0", borderRadius: 2, marginBottom: 0 }}>
    <div style={{ height: "100%", background: BLUE, width: `${(step / total) * 100}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius: 2 }} />
  </div>
);

export default function App() {
  const [phase, setPhase] = useState("welcome");
  const [rating, setRating] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const feedbackRef = useRef({ start: "", keep: "", drop: "" });

  const needsFeedback = rating !== null && rating <= 7;
  const totalSteps = needsFeedback ? 3 : 2;
  const currentStep = phase === "welcome" ? 0 : phase === "rating" ? 1 : phase === "feedback" ? 2 : totalSteps;

  const WEBHOOK_URL = "https://voodoohr.app.n8n.cloud/webhook/enps-response";

  // Read token from URL
  const token = new URLSearchParams(window.location.search).get("t") || "";

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        token,
        rating,
        quarter: "Q2-2026",
        start: feedbackRef.current.start || "",
        keep: feedbackRef.current.keep || "",
        drop: feedbackRef.current.drop || "",
        submittedAt: new Date().toISOString()
      };
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Submit error:", err);
    }
    setSubmitting(false);
    setPhase("thanks");
  };

  const handleRatingNext = () => {
    if (rating === null) return;
    if (rating <= 7) {
      setPhase("feedback");
    } else {
      handleSubmit();
    }
  };

  return (
    <div style={{ minHeight: "100%", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position: "relative" }}>
      <style>{CSS}</style>

      {phase === "welcome" && (
        <Slide key="welcome">
          <div style={{ textAlign: "center", padding: "40px 24px 32px" }}>
            <AnimatedVLogo size={90} />
            <div style={{ animation: "floatIn 0.6s 0.8s both" }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#000", margin: "24px 0 6px", lineHeight: 1.05, letterSpacing: -1 }}>eNPS - Employee Fulfillment</h1>
              <p style={{ fontSize: 13, color: "#999", margin: "0 0 4px", fontWeight: 500 }}>Q1 2026 · Company-wide Survey</p>
              <div style={{ width: 32, height: 2, background: BLUE, margin: "16px auto 20px" }} />
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 6px" }}>Share how you feel about working at Voodoo.</p>
              <p style={{ fontSize: 12, color: "#CCC", margin: "0 0 24px" }}>1 question · ~1 minute · 100% anonymous</p>
            </div>
            <div style={{ animation: "floatIn 0.6s 1s both" }}>
              <Btn onClick={() => setPhase("rating")} style={{ padding: "14px 48px", fontSize: 15, borderRadius: 12 }}>
                Start survey
              </Btn>
              <p style={{ fontSize: 12, color: "#999", marginTop: 14, animation: "floatIn 0.6s 1.1s both" }}>
                Anonymous · <span style={{ fontStyle: "italic" }}>Your response is completely anonymous</span>
              </p>
            </div>
          </div>
        </Slide>
      )}

      {phase === "thanks" && (
        <Slide key="thanks">
          <div style={{ textAlign: "center", padding: "60px 24px 32px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "tickBounce 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "checkDraw 0.5s 0.4s forwards" }} />
              </svg>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#000", margin: "0 0 8px", letterSpacing: -0.5 }}>Thank you!</h1>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: "0 0 28px" }}>Your anonymous feedback has been recorded.</p>
            <div style={{ background: BLUE_LIGHT, borderRadius: 12, padding: "16px 20px", border: `1px solid ${BLUE}22` }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#000", margin: "0 0 4px" }}>What happens next?</p>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>Results will be compiled and shared with the company. Your individual response cannot be traced back to you.</p>
            </div>
          </div>
        </Slide>
      )}

      {phase === "rating" && (
        <Slide key="rating">
          <div style={{ padding: "16px 24px 32px", position: "relative" }}>
            {submitting && <LoadingOverlay />}
            <ProgressBar step={currentStep} total={totalSteps} />
            <div style={{ textAlign: "center", margin: "32px 0 28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#000", margin: "0 0 6px", lineHeight: 1.2, letterSpacing: -0.3 }}>
                Do you feel fulfilled working at Voodoo?
              </h2>
              <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Rate from 0 (not at all) to 10 (absolutely)</p>
            </div>
            <NPSScale value={rating} onSelect={setRating} />
            {rating !== null && (
              <div style={{ marginTop: 28, animation: "fadeScale 0.3s ease" }}>
                <Btn onClick={handleRatingNext} disabled={submitting} style={{ width: "100%", padding: "14px 32px", borderRadius: 12, fontSize: 14 }}>
                  {rating <= 7 ? "Next — share feedback" : (submitting ? "Submitting..." : "Submit")}
                </Btn>
                {rating >= 8 && (
                  <p style={{ fontSize: 11, color: "#BBB", textAlign: "center", marginTop: 10 }}>Great to hear! Your positive score will be recorded anonymously.</p>
                )}
              </div>
            )}
          </div>
        </Slide>
      )}

      {phase === "feedback" && (
        <Slide key="feedback">
          <div style={{ padding: "16px 24px 32px", position: "relative" }}>
            {submitting && <LoadingOverlay />}
            <ProgressBar step={currentStep} total={totalSteps} />
            <div style={{ textAlign: "center", margin: "28px 0 24px" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#000", margin: "0 0 6px", lineHeight: 1.3 }}>Help us improve</h2>
              <p style={{ fontSize: 13, color: "#999", margin: "0 0 6px" }}>You rated <strong style={{ color: BLUE }}>{rating}/10</strong>. What could make your experience better?</p>
              <p style={{ fontSize: 11, color: "#CCC" }}>All fields are optional.</p>
            </div>
            <FBField icon="→" label="Start" fieldKey="start" feedbackRef={feedbackRef} />
            <FBField icon="↻" label="Keep" fieldKey="keep" feedbackRef={feedbackRef} />
            <FBField icon="×" label="Drop" fieldKey="drop" feedbackRef={feedbackRef} />
            <Btn onClick={handleSubmit} disabled={submitting} style={{ width: "100%", marginTop: 8, padding: "14px 32px", borderRadius: 12, fontSize: 14 }}>
              {submitting ? "Submitting..." : "Submit feedback"}
            </Btn>
            <p style={{ fontSize: 10, color: "#CCC", textAlign: "center", marginTop: 12, fontStyle: "italic" }}>Your feedback is completely anonymous.</p>
          </div>
        </Slide>
      )}
    </div>
  );
}
