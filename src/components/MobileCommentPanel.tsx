import { useCommentStore } from "../store/useCommentStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ✅ 닉네임 키워드 세트
const firstKeywords = [
  "기분나쁜",
  "절대 젠틀하지 않은",
  "하루먹고 하루사는",
  "땅부자를 꿈꾸는",
  "로또가 마냥 좋은",
  "한탕을 노리는",
  "눈에 불을 키고 달려드는",
];

const secondKeywords = [
  "개미핥기",
  "나무늘보",
  "리트리버",
  "고독한 늑대",
  "스컹크",
  "코뿔소",
  "코끼리",
];

// ✅ 랜덤 조합 생성 함수
function getRandomUserName() {
  const first = firstKeywords[Math.floor(Math.random() * firstKeywords.length)];
  const second = secondKeywords[Math.floor(Math.random() * secondKeywords.length)];
  return `${first} ${second}`;
}

// ✅ 랜덤 아바타 (랜덤 1~50)
function getRandomAvatar() {
  const id = Math.floor(Math.random() * 50) + 1;
  return `https://i.pravatar.cc/40?img=${id}`;
}

export default function MobileCommentPanel() {
  const { comments } = useCommentStore();

  // ✅ comment.id -> { name, avatar } 매핑 저장소
  const userMap = useRef<Map<string, { name: string; avatar: string }>>(new Map());

  // ✅ 특정 코멘트 ID의 사용자 정보 가져오기 (없으면 새로 생성)
  const getUserProfile = (id: string) => {
    if (!userMap.current.has(id)) {
      userMap.current.set(id, {
        name: getRandomUserName(),
        avatar: getRandomAvatar(),
      });
    }
    return userMap.current.get(id)!;
  };

  // ✅ 인원수 상태 및 랜덤 변동 로직
  const [memberCount, setMemberCount] = useState(
    Math.floor(Math.random() * 21) + 80 // 80~100 사이 초기값
  );

  useEffect(() => {
    let isRunning = true;

    const updateCount = () => {
      if (!isRunning) return;

      setMemberCount((prev) => {
        // -2~+2 사이의 랜덤 변화 (너무 급하지 않게)
        const change = Math.floor(Math.random() * 5) - 2;
        let newCount = prev + change;
        if (newCount < 80) newCount = 80;
        if (newCount > 100) newCount = 100;
        return newCount;
      });

      // 1~5초 랜덤 주기
      const nextDelay = 1000 + Math.random() * 4000;
      setTimeout(updateCount, nextDelay);
    };

    updateCount();

    return () => {
      isRunning = false;
    };
  }, []);

  return (
    <div className="bg-[#FAF9F7] w-[420px] h-[460px] rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-200">
      {/* 상단 헤더 */}
      <div className="bg-[#FEE500] text-gray-900 flex items-center justify-between px-4 py-2 rounded-t-3xl border-b border-yellow-200">
        {/* 왼쪽: 프로필 사진들 + 방 정보 */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img
              src="https://i.pravatar.cc/40?img=3"
              className="w-8 h-8 rounded-full border-2 border-[#FEE500]"
            />
            <img
              src="https://i.pravatar.cc/40?img=7"
              className="w-8 h-8 rounded-full border-2 border-[#FEE500]"
            />
            <img
              src="https://i.pravatar.cc/40?img=10"
              className="w-8 h-8 rounded-full border-2 border-[#FEE500]"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-[15px]">TH 주식 갤러리</span>
            <span className="text-[11px] text-gray-600">👥 {memberCount}</span>
          </div>
        </div>

        {/* 오른쪽: 아이콘 버튼 */}
        <div className="flex items-center gap-3 text-gray-800">
          <button className="hover:text-gray-600 bg-transparent border-none outline-none p-0 m-0">
            <i className="fa-solid fa-magnifying-glass text-[14px]"></i>
          </button>
          <button className="hover:text-gray-600 bg-transparent border-none outline-none p-0 m-0">
            <i className="fa-solid fa-phone text-[14px]"></i>
          </button>
          <button className="hover:text-gray-600 bg-transparent border-none outline-none p-0 m-0">
            <i className="fa-solid fa-video text-[14px]"></i>
          </button>
          <button className="hover:text-gray-600 bg-transparent border-none outline-none p-0 m-0">
            <i className="fa-solid fa-bars text-[14px]"></i>
          </button>
        </div>
      </div>

      {/* 코멘트 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <AnimatePresence>
          {comments.map((c) => {
            const isRight = c.side === "right";
            const { name, avatar } = getUserProfile(c.id);
            const time = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 ${
                  isRight ? "justify-end" : "justify-start"
                }`}
              >
                {/* 프로필 (왼쪽일 때만 표시) */}
                {!isRight && (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-9 h-9 rounded-full border shadow-sm"
                  />
                )}

                {/* 말풍선 영역 */}
                <div
                  className={`flex flex-col max-w-[70%] ${
                    isRight ? "items-end" : "items-start"
                  }`}
                >
                  {!isRight && (
                    <p className="text-xs text-gray-600 mb-0.5 ml-1">{name}</p>
                  )}

                  {/* 말풍선 */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm leading-snug shadow-md ${
                      isRight
                        ? "bg-[#AEE6A5] text-gray-900 rounded-br-none"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {c.text}
                  </div>

                  {/* 시간 */}
                  <span className="text-[10px] text-gray-400 mt-0.5 self-end mr-1">
                    {time}
                  </span>
                </div>

                {/* 오른쪽 프로필 (오른쪽일 때만 표시) */}
                {isRight && (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-9 h-9 rounded-full border shadow-sm"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
