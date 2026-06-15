import type { JSX } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  refreshComments,
  selectComments,
  selectCommentsError,
  selectCommentsStatus,
} from "../redux/slices/storyDetailSlice";

import CommentItem from "./CommentItem";

type CommentListProps = {
  storyId: number;
};

const CommentList = ({storyId}: CommentListProps): JSX.Element => {
  const comments = useAppSelector(selectComments);
  const commentStatus = useAppSelector(selectCommentsStatus);
  const commentsError = useAppSelector(selectCommentsError);
  const dispatch = useAppDispatch();
  const isRefreshingComments = commentStatus === "loading";
  

  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <header className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Комментарии</h2>
          <button
            type="button"
            disabled={isRefreshingComments}
            onClick={() => dispatch(refreshComments(storyId))}
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-orange-200/80 bg-white px-3.5 py-2 text-sm font-medium text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshingComments ? "Обновление..." : "Обновить"}
          </button>
        </div>
      </header>

      {commentsError && (
        <p className="border-b border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700 sm:px-6">
          Ошибка обновления комментариев: {commentsError}
        </p>
      )}

      {comments.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500 sm:px-6">
          Комментариев пока нет
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 px-4 py-4 sm:px-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentList;
