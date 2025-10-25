import NewsBoard from "./NewsBoard";
import MobileCommentPanel from "./MobileCommentPanel";

export default function LiveEventUI() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-full">
      <div className="flex-1">
        <NewsBoard />
      </div>
      <div className="w-full md:w-[380px]">
        <MobileCommentPanel />
      </div>
    </div>
  );
}
