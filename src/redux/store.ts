import { configureStore } from "@reduxjs/toolkit";
import storiesReducer from "./slices/storySlice";
import storyDetailReducer from "./slices/storyDetailSlice";

const store = configureStore({
  reducer: {
    stories: storiesReducer,
    storyDetail: storyDetailReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
