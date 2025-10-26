import { useCommentStore } from "../store/useCommentStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

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

  return (
    <div className="bg-[#DDE1E6] w-[420px] h-[500px] rounded-2xl shadow-xl p-4 flex flex-col">
      <h2 className="text-center text-gray-700 font-bold mb-3">💬 TH 주식 갤러리</h2>

      {/* 코멘트 리스트 */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
                    className="w-8 h-8 rounded-full shadow-sm"
                  />
                )}

                {/* 말풍선 */}
                <div
                  className={`flex flex-col max-w-[70%] ${
                    isRight ? "items-end" : "items-start"
                  }`}
                >
                  {!isRight && (
                    <p className="text-xs text-gray-600 mb-0.5 ml-1">{name}</p>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-snug shadow-md ${
                      isRight
                        ? "bg-[#9FC5F8] text-gray-900 rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {c.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {time}
                  </span>
                </div>

                {/* 오른쪽 프로필 (오른쪽일 때만 표시) */}
                {isRight && (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-8 h-8 rounded-full shadow-sm"
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
