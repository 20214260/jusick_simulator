import { useNewsStore } from "../store/useNewsStore";

// News 타입 정의 (store에서 사용하는 것과 일치해야 함)
interface NewsItem {
  title: string;
  source: string;
  timeAgo: number;
  icon?: string;
}

export default function NewsBoard() {
  const news = useNewsStore((state) => state.news);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-green-600 mb-3">📰 Live News</h2>

      {news.map((item: NewsItem, index: number) => (
        <div
          key={index}
          className="border p-3 rounded-lg mb-3 shadow-sm bg-gray-50 hover:bg-white transition-all"
        >
          <div className="text-xs text-gray-400 mb-1">
            {item.source} · {item.timeAgo}s 전
          </div>
          <div className="font-semibold">{item.title}</div>
          {item.icon && (
            <div className="mt-2 text-right text-sm text-gray-500">
              📈 관련: {item.icon}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
