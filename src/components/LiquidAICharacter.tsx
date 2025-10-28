import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function LiquidAICharacter({
  aiReact = false,
  phase,
}: {
  aiReact?: boolean;
  phase?: string;
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [aiComment, setAiComment] = useState<string | null>(null);
  const [isTalking, setIsTalking] = useState(false);

  // ✅ 긴장 상태 (선택 / 분석)
  const isTense = phase === "thinking" || phase === "evaluating";

  // ✅ 마우스 각도 반응
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      setMouse({ x, y });
      setTilt({ rotateX: y * 15, rotateY: -x * 15 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ 랜덤 멘트 (주기 느리게 유지)
  const ments = [
    "오늘도 계좌 녹는다...",
    "형들 이건 좀 쎄한데?",
    "이거 오르기 전에 탔어야지ㅋㅋ",
    "AI 분석 중... 잠깐만 기다려봐.",
    "흠... 데이터가 좀 애매한데?",
  ];

  useEffect(() => {
    const randomTalk = () => {
      const ment = ments[Math.floor(Math.random() * ments.length)];
      setAiComment(ment);
      setIsTalking(true);
      setTimeout(() => setAiComment(null), 3000);
      setTimeout(() => setIsTalking(false), 3000);
    };

    const interval = setInterval(randomTalk, Math.random() * 15000 + 10000); // 10~25초 간격
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative w-60 h-80 flex items-center justify-center"
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
      }}
      animate={{
        scale: isTense ? [1, 1.02, 0.98, 1.02] : [1, 1.04, 0.97, 1],
        rotateZ: isTense ? [0, 2, -2, 0] : 0, // 좌우로 미세하게 떨림
        y: isTense ? [0, -1, 1, -1, 0] : [0, -4, 0],
      }}
      transition={{
        duration: isTense ? 0.4 : 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >

      {phase === "evaluating" && (
       <motion.div
         className="absolute top-[-60px] bg-black/50 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium tracking-wide"
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         transition={{ duration: 0.6, ease: "easeOut" }}
       >
         너의 안목을 믿어...
      </motion.div>
    )}

      {/* 💬 랜덤 멘트 */}
      <AnimatePresence>
        {aiComment && (
          <motion.div
            key={aiComment}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute top-[-50px] bg-white/90 text-gray-800 px-3 py-1.5 rounded-full shadow-lg text-sm border border-gray-200 whitespace-nowrap"
          >
            {aiComment}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 몸통 */}
      <motion.div
        className={`absolute inset-0 rounded-[60%_60%_52%_52%/70%_70%_42%_46%]
          shadow-2xl transition-all duration-300
          ${
            isTense
              ? "bg-gradient-to-b from-indigo-400 to-purple-500 saturate-[1.4]"
              : "bg-gradient-to-b from-indigo-300 to-purple-400"
          }`}
      />

      {/* 팔 (좌우) */}
      <motion.div
        className="absolute left-[-25px] top-[40%] w-10 h-20 rounded-full bg-gradient-to-b from-indigo-300 to-purple-400 opacity-80"
        animate={{
          rotateZ: aiReact ? -50 : [-8, 6, -8],
          y: aiReact ? -20 : isTense ? [0, 2, -2, 0] : 0,
        }}
        transition={{
          duration: aiReact ? 0.5 : isTense ? 0.25 : 3,
          repeat: aiReact || isTense ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-[-25px] top-[40%] w-10 h-20 rounded-full bg-gradient-to-b from-indigo-300 to-purple-400 opacity-80"
        animate={{
          rotateZ: aiReact ? 50 : [8, -6, 8],
          y: aiReact ? -20 : isTense ? [0, -2, 2, 0] : 0,
        }}
        transition={{
          duration: aiReact ? 0.5 : isTense ? 0.25 : 3,
          repeat: aiReact || isTense ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* 얼굴 */}
      <div className="relative w-[70%] h-[65%] flex flex-col items-center justify-center z-10 -translate-y-10">
        {/* 눈 */}
        <div className="flex justify-between w-[60%] mb-2">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative bg-white rounded-full overflow-hidden"
              style={{
                width: "28px",
                height: "28px",
                transformOrigin: "center",
              }}
              animate={{
                scaleY: isTense ? 0.6 : 1, // 👁️ 게슴츠레 효과
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute bg-black rounded-full"
                style={{
                  width: "14px",
                  height: "14px",
                  transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* 입 */}
        <motion.div
          className="flex items-center justify-center"
          animate={
            aiReact || isTalking
              ? { scaleY: [1, 0.8, 1], borderRadius: ["50%", "50%", "20%"] }
              : { scaleY: 1, borderRadius: "20%" }
          }
          transition={{
            duration: 0.8,
            repeat: aiReact || isTalking ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="bg-black/60"
            style={{
              width: aiReact || isTalking ? "18px" : "36px",
              height: aiReact || isTalking ? "18px" : "4px",
              borderRadius: aiReact || isTalking ? "50%" : "4px",
            }}
            animate={{
              width: aiReact || isTalking ? ["18px", "22px", "18px"] : "36px",
              height: aiReact || isTalking ? ["18px", "16px", "18px"] : "4px",
            }}
            transition={{
              duration: 0.8,
              repeat: aiReact || isTalking ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* 하이라이트 */}
      <div className="absolute top-8 left-8 w-12 h-12 bg-white/25 rounded-full blur-xl" />
      <div className="absolute bottom-6 right-6 w-10 h-10 bg-purple-200/20 rounded-full blur-lg" />
    </motion.div>
  );
}
