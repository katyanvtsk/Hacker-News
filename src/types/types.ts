export type ResponseNews = number[]; // ответ на запрос всех ID

type BaseItem = {
  id: number;
  by: string;
  time: number;
  type: "story" | "comment" | "job" | "poll" | "pollopt";
  deleted?: boolean;
  dead?: boolean;
};

// для новостей
export type Story = BaseItem & {
  type: "story";
  title: string;
  url?: string;
  text?: string;
  score: number;
  descendants: number;
  kids?: number[];
};

//для комментов
export type Comment = BaseItem & {
  type: "comment";
  text: string;
  parent: number;
  kids?: number[];
};

export type ResponseNewsById = {
  // ответ на запрос 1 новости по ID
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: "story" | "comment" | "job" | "poll" | "pollopt";
  url: string;
};

//индикаторы загрузки
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
