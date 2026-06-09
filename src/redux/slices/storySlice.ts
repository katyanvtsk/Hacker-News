import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type RequestStatusType,
  type ResponseNewsById,
  type Story,
} from "../../types/types";
import { apiNews } from "../../api/api";
import { createAppAsyncThunk } from "../createApp";

const initialState = {
  stories: [] as Story[],
  status: "idle" as RequestStatusType,
  error: null as string | null,
};

export const getStories = createAppAsyncThunk<Story[], undefined>(
  "stories/getList",
  async (_, { rejectWithValue }) => {
    try {
      const arrID = await apiNews.getIdNews(100);
      if (!arrID || arrID.length === 0) {
        return rejectWithValue("Не удалось получить ID новостей");
      }

      const stories = arrID.map(async (item) => apiNews.getNewsById(item));

      const result = await Promise.all(stories);
      const sortedStories = result
        .filter(
          (item): item is ResponseNewsById & { type: "story" } =>
            !!item && item.type === "story",
        )
        .sort((a, b) => b.time - a.time);
      return sortedStories;
    } catch (e) {
      const error = e as { message: string };
      return rejectWithValue(error.message);
    }
  },
);

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  selectors: {
    selectStories: (state) => state.stories,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getStories.fulfilled,
        (state, action: PayloadAction<Story[]>) => {
          state.status = "succeeded";
          state.stories = action.payload;
        },
      )
      .addCase(getStories.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload;
        }
      });
  },
});

export default storiesSlice.reducer;
export const { selectStories, selectStatus, selectError } =
  storiesSlice.selectors;
