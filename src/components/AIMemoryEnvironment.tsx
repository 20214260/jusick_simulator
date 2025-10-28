import { motion, useMotionValue, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import type { ReactNode } from "react";

/**
 * 디지털-사이버 룩 환경 배경
 * 레이어 구성 (뒤 → 앞):
 * 1. 깊은 네온 그라디언트 네뷸라
 * 2. 반응형(커서-패럴랙스) 와이어프레임 그리드
 * 3. 회로(서킷) 라인 글로우
 * 4. 떠다니는 글로우 노드(입자)
 * 5. 중심 펄스 링 + 스캔라인 오버레이
 * 6. children (캐릭터) — 항상 맨 앞 (z-30)
 */
export default function AIMemoryEnvironment({
  children,
}: {
  children?: ReactNode;
}) {
  // 패럴랙스(마우스) — 컨테이너 상대 좌표로 -0.5~0.5
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const gridX = useTransform(mx, (v) => v * 20); // 그리드 미세 이동
  const gridY = useTransform(my, (v) => v * 20);
  const glowX = useTransform(mx, (v) => v * -10); // 글로우 약간 반대 이동
  const glowY = useTransform(my, (v) => v * -10);

  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(nx);
    my.set(ny);
  };

  // 글로우 노드(입자)
  const nodes = useMemo(
    () =>
      Array.from({ length: 22 }).map(() => ({
        top: Math.random() * 90,
        left: Math.random() * 90,
        size: 6 + Math.random() * 10,
        delay: Math.random() * 4,
        dur: 6 + Math.random() * 6,
        hue: 180 + Math.floor(Math.random() * 120), // 180~300 (청록~보라)
      })),
    []
  );

  // 회로(서킷) 라인 — 몇 개만, 은은하게
  const circuits = useMemo(
    () =>
      [
        { top: "18%", left: "5%", width: "70%", rot: 0 },
        { top: "62%", left: "15%", width: "60%", rot: 0 },
        { top: "30%", left: "15%", width: "55%", rot: 35 },
        { top: "70%", left: "25%", width: "55%", rot: -28 },
      ] as const,
    []
  );

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      className="
        relative w-full h-full overflow-hidden rounded-2xl
        shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]
        "
    >
      {/* 1) 네온 그라디언트 네뷸라 (깊이감) */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "radial-gradient(80% 60% at 15% 20%, rgba(55,90,255,0.38) 0%, rgba(55,90,255,0.0) 60%)," +
            "radial-gradient(70% 50% at 85% 30%, rgba(186,57,255,0.30) 0%, rgba(186,57,255,0.0) 60%)," +
            "radial-gradient(90% 70% at 50% 90%, rgba(0,255,224,0.22) 0%, rgba(0,255,224,0.0) 60%)," +
            "linear-gradient(135deg, #0f1434 0%, #151038 35%, #1e0c43 100%)",
          backgroundSize: "200% 200%, 200% 200%, 200% 200%, 100% 100%",
          filter: "saturate(110%)",
        }}
      />

      {/* 2) 커서 반응 그리드 */}
      <motion.div
        className="absolute inset-[-20%] opacity-40"
        style={{ x: gridX, y: gridY }}
      >
        <svg width="120%" height="120%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(120,180,255,0.18)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="120%" height="120%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* 3) 서킷 라인 글로우 */}
      {circuits.map((c, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] rounded-full"
          style={{
            top: c.top,
            left: c.left,
            width: c.width,
            rotate: c.rot,
            background:
              "linear-gradient(90deg, rgba(0,255,224,0) 0%, rgba(0,255,224,0.7) 40%, rgba(170,120,255,0.7) 60%, rgba(170,120,255,0) 100%)",
            boxShadow:
              "0 0 8px rgba(0,255,224,0.35), 0 0 14px rgba(170,120,255,0.25)",
          }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3.6 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* 4) 글로우 노드(입자) */}
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${n.top}%`,
            left: `${n.left}%`,
            width: n.size,
            height: n.size,
            backgroundColor: `hsla(${n.hue}, 100%, 65%, 0.85)`,
            boxShadow: `0 0 12px hsla(${n.hue}, 100%, 65%, 0.7),
                        0 0 26px hsla(${n.hue}, 100%, 65%, 0.35)`,
            filter: "saturate(120%)",
          }}
          animate={{
            y: [0, -8, 0],
            x: [0, 6, 0],
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: n.dur,
            delay: n.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 5) 중심 펄스 링 + 스캔라인 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 중심 펄스 링 */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "38%",
            height: "38%",
            boxShadow:
              "0 0 40px rgba(120,180,255,0.25), inset 0 0 30px rgba(120,180,255,0.20)",
            border: "2px solid rgba(120,180,255,0.35)",
            filter: "blur(0.2px)",
          }}
          animate={{ scale: [0.95, 1.03, 0.95], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 스캔라인(아주 미세) */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 3px, transparent 4px)",
          }}
        />
      </div>

      {/* 6) 캐릭터/자식 요소 — 항상 맨 앞 */}
      <motion.div
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ x: glowX, y: glowY }}
      >
        {children}
      </motion.div>
    </div>
  );
}
