import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type RequestStatusType,
  type Story,
} from "../../types/types";
import { apiNews } from "../../api/api";
import { createAppAsyncThunk } from "../createApp";
import {
  fetchCommentTree,
  type CommentTreeItem,
} from "../../helpers/comments.ts";

const initialState = {
  story: null as Story | null,
  comments: [] as CommentTreeItem[],
  status: "idle" as RequestStatusType,
  error: null as string | null,
  commentsStatus: "idle" as RequestStatusType,
  commentsError: null as string | null,
};

export const getStoryWithComments = createAppAsyncThunk<
  { story: Story; comments: CommentTreeItem[] },
  number
>("storyDetail/get", async (id, { rejectWithValue }) => {
  try {
    const item = await apiNews.getItemById(id);

    if (!item || item.type !== "story") {
      return rejectWithValue("Новость не найдена");
    }

    const comments = await fetchCommentTree(item.kids);
    return { story: item, comments };
  } catch (e) {
    const error = e as { message: string };
    return rejectWithValue(error.message);
  }
});

export const refreshComments = createAppAsyncThunk<
  CommentTreeItem[],
  number
>("storyDetail/refreshComments", async (id, { rejectWithValue }) => {
  try {
    const item = await apiNews.getItemById(id);

    if (!item || item.type !== "story") {
      return rejectWithValue("Новость не найдена");
    }

    return fetchCommentTree(item.kids);
  } catch (e) {
    const error = e as { message: string };
    return rejectWithValue(error.message);
  }
});

const storyDetailSlice = createSlice({
  name: "storyDetail",
  initialState,
  selectors: {
    selectStory: (state) => state.story,
    selectComments: (state) => state.comments,
    selectDetailStatus: (state) => state.status,
    selectDetailError: (state) => state.error,
    selectCommentsStatus: (state) => state.commentsStatus,
    selectCommentsError: (state) => state.commentsError,
  },
  reducers: {
    resetStoryDetail: (state) => {
      state.story = null;
      state.comments = [];
      state.status = "idle";
      state.error = null;
      state.commentsStatus = "idle";
      state.commentsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStoryWithComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getStoryWithComments.fulfilled,
        (
          state,
          action: PayloadAction<{ story: Story; comments: CommentTreeItem[] }>,
        ) => {
          state.status = "succeeded";
          state.story = action.payload.story;
          state.comments = action.payload.comments;
        },
      )
      .addCase(getStoryWithComments.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload;
        }
      })
      .addCase(refreshComments.pending, (state) => {
        state.commentsStatus = "loading";
        state.commentsError = null;
      })
      .addCase(
        refreshComments.fulfilled,
        (state, action: PayloadAction<CommentTreeItem[]>) => {
          state.commentsStatus = "succeeded";
          state.comments = action.payload;
        },
      )
      .addCase(refreshComments.rejected, (state, action) => {
        state.commentsStatus = "failed";
        if (action.payload) {
          state.commentsError = action.payload;
        }
      });
  },
});

export default storyDetailSlice.reducer;
export const { resetStoryDetail } = storyDetailSlice.actions;
export const {
  selectStory,
  selectComments,
  selectDetailStatus,
  selectDetailError,
  selectCommentsStatus,
  selectCommentsError,
} = storyDetailSlice.selectors;
