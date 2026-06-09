import { apiNews } from "../api/api";
import type { Comment } from "../types/types";

export type CommentTreeItem = Comment & {
  children: CommentTreeItem[];
};

export async function fetchCommentTree(
  kidsIds?: number[],
): Promise<CommentTreeItem[]> {
  if (!kidsIds?.length) return [];

  const responses = await Promise.all(
    kidsIds.map((id) => apiNews.getItemById(id)),
  );

  const comments = responses.filter(
    (item): item is Comment =>
      !!item && item.type === "comment" && !item.deleted && !item.dead,
  );

  return Promise.all(
    comments.map(async (comment) => ({
      ...comment,
      children: await fetchCommentTree(comment.kids),
    })),
  );
}
