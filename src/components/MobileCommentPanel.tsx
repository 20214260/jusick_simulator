import { useNewsStore } from "../store/useNewsStore";

export default function MobileCommentPanel() {
  const comments = useNewsStore((state) => state.comments);

  return (
    <div className="rounded-[2rem] border-4 border-black p-4 bg-black text-white h-[680px] relative shadow-lg overflow-hidden">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-300 rounded-full" />
      <div className="mb-4 text-sm text-center text-gray-400">주식 커뮤니티 실시간 반응</div>

      <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 pb-10">
        {comments.map((c: string, i: number) => (
          <div key={i} className="bg-gray-800 rounded-lg px-4 py-2 text-sm">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
