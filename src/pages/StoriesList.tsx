import type { JSX } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  getStories,
  selectError,
  selectStatus,
  selectStories,
} from "../redux/slices/storySlice";
import { useEffect } from "react";
import StoryItem from "../components/StoryItem";

const StoriesList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(getStories());
  }, [dispatch]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-sm text-gray-500">Загрузка новостей...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-6 text-center text-sm text-red-700 ring-1 ring-red-200">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <header className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Top Stories</h1>
            <p className="mt-1 text-sm text-gray-500">
              {stories.length} новостей с Hacker News
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(getStories())}
            className="shrink-0 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Обновить
          </button>
        </div>
      </header>

      <ul className="divide-y divide-gray-200">
        {stories.map((item, index) => (
          <li key={item.id}>
            <StoryItem story={item} rank={index + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StoriesList;
