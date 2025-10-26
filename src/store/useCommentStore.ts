import { create } from "zustand";

interface CommentItem {
  id: string;
  text: string;
  side: "left" | "right";
}

interface CommentState {
  comments: CommentItem[];
  addComment: (text: string, side: "left" | "right") => void;
  clearComments: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],

  addComment: (text, side) =>
    set((state) => {
      // ✅ 완전 고유한 ID 생성 (충돌 방지)
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newComment: CommentItem = {
        id: uniqueId,
        text,
        side,
      };

      const newComments = [...state.comments, newComment];

      // ✅ 최근 7개까지만 유지
      if (newComments.length > 7) newComments.shift();

      return { comments: newComments };
    }),

  clearComments: () => set({ comments: [] }),
}));
