import type { JSX } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import type { Story } from "../types/types";
import { formatDate } from "../helpers/time";

export type StoryItemProps = {
  story: Story;
  rank: number;
};

const StoryItem = ({ story, rank }: StoryItemProps): JSX.Element => {
  const navigate = useNavigate();
  return (
    <article className="flex gap-3 px-4 py-4 transition hover:bg-gray-50 sm:gap-4 sm:px-6">
      <span className="w-6 shrink-0 pt-0.5 text-sm font-medium text-gray-400">
        {rank}.
      </span>

      <div
        className="group min-w-0 flex-1 cursor-pointer rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-orange-50"
        onClick={() => navigate(`/story/${story.id}`)}
      >
        <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
          <h2 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
            {story.title}
          </h2>
        </div>

        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
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
        </p>
      </div>
    </article>
  );
};

export default StoryItem;
