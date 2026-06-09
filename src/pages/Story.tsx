import type { JSX } from "react/jsx-runtime";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  getStoryWithComments,
  refreshComments,
  resetStoryDetail,
  selectComments,
  selectCommentsError,
  selectCommentsStatus,
  selectDetailError,
  selectDetailStatus,
  selectStory,
} from "../redux/slices/storyDetailSlice";
import { formatDate } from "../helpers/time";
import CommentItem from "../components/CommentItem";

const Story = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const story = useAppSelector(selectStory);
  const comments = useAppSelector(selectComments);
  const status = useAppSelector(selectDetailStatus);
  const error = useAppSelector(selectDetailError);
  const commentsStatus = useAppSelector(selectCommentsStatus);
  const commentsError = useAppSelector(selectCommentsError);

  useEffect(() => {
    const storyId = Number(id);
    if (!storyId) return;

    dispatch(getStoryWithComments(storyId));

    return () => {
      dispatch(resetStoryDetail());
    };
  }, [dispatch, id]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-sm text-gray-500">Загрузка новости...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-block text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          ← К списку новостей
        </Link>
        <div className="rounded-lg bg-red-50 px-4 py-6 text-center text-sm text-red-700 ring-1 ring-red-200">
          Ошибка: {error}
        </div>
      </div>
    );
  }

  if (!story) return <div />;

  const storyUrl =
    story.url ?? `https://news.ycombinator.com/item?id=${story.id}`;

  const isRefreshingComments = commentsStatus === "loading";

  return (
    <article className="space-y-6">
      <Link
        to="/"
        className="inline-block text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        ← К списку новостей
      </Link>

      <header className="overflow-hidden rounded-xl bg-white px-4 py-6 shadow-sm ring-1 ring-gray-200 sm:px-6">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          <a
            href={storyUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-600 hover:underline"
          >
            {story.title}
          </a>
        </h1>

        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
          <span>
            автор{" "}
            <a
              href={`https://news.ycombinator.com/user?id=${story.by}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-gray-700 hover:text-orange-600"
            >
              {story.by}
            </a>
          </span>
          <span aria-hidden="true">|</span>
          <time>{formatDate(story.time)}</time>
          <span aria-hidden="true">|</span>
          <span>
            {story.descendants}{" "}
            {story.descendants === 1 ? "комментарий" : "комментариев"}
          </span>
        </p>

        <p className="mt-4 text-sm">
          <a
            href={storyUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-orange-600 hover:text-orange-700 hover:underline"
          >
            Открыть новость
          </a>
        </p>
      </header>

      <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <header className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Комментарии</h2>
            <button
              type="button"
              disabled={isRefreshingComments}
              onClick={() => dispatch(refreshComments(Number(id)))}
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
              <li key={comment.id} className="py-4 first:pt-0 last:pb-0">
                <CommentItem comment={comment} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
};

export default Story;
