import type { JSX } from "react/jsx-runtime";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  getStoryWithComments,
  resetStoryDetail,
  selectDetailError,
  selectDetailStatus,
  selectStory,
} from "../redux/slices/storyDetailSlice";
import { formatDate } from "../helpers/time";

import CommentList from "../components/CommentList";

const Story = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const story = useAppSelector(selectStory);
  const status = useAppSelector(selectDetailStatus);
  const error = useAppSelector(selectDetailError);

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
      <CommentList storyId={Number(id)}/>
    </article>
  );
};

export default Story;
