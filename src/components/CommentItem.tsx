import type { JSX } from "react/jsx-runtime";
import type { CommentTreeItem } from "../helpers/comments.ts";
import { formatDate } from "../helpers/time";

export type CommentItemProps = {
  comment: CommentTreeItem;
  depth?: number;
};

const CommentItem = ({
  comment,
  depth = 0,
}: CommentItemProps): JSX.Element => {
  return (
    <li className={depth > 0 ? "mt-3" : "py-4 first:pt-0 last:pb-0"}>
      <article
        className="rounded-lg bg-gray-50 px-4 py-3 ring-1 ring-gray-200"
        style={{ marginLeft: depth > 0 ? `${Math.min(depth, 6) * 1.25}rem` : 0 }}
      >
        <header className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <a
            href={`https://news.ycombinator.com/user?id=${comment.by}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-gray-700 hover:text-orange-600"
          >
            {comment.by}
          </a>
          <span aria-hidden="true">|</span>
          <time>{formatDate(comment.time)}</time>
        </header>

        <div
          className="text-sm leading-relaxed text-gray-800 [&_a]:text-orange-600 [&_a]:hover:underline [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_p]:my-1"
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />
      </article>

      {comment.children.length > 0 && (
        <ul className="mt-3 space-y-0">
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default CommentItem;
