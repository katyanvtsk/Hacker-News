import axios from "axios";
import type { Comment, ResponseNews, ResponseNewsById, Story } from "../types/types";

const appUrl = import.meta.env.VITE_APP_URL;

const instance = axios.create({
  baseURL: appUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiNews = {
  getIdNews: async (litit = 100) => {
    try {
      const { data } = await instance.get<ResponseNews>("/newstories.json"); // [массив ID]
      return data.slice(0, litit);
    } catch (e) {
      console.log(e.message);
    }
  },

  getNewsById: async (id: number) => {
    try {
      const { data } = await instance.get<ResponseNewsById>(`/item/${id}.json`);
      return data; 
    } catch (e) {
      console.log(e instanceof Error ? e.message : String(e));
    }
  },

  getItemById: async (id: number) => {
    try {
      const { data } = await instance.get<Story | Comment>(`/item/${id}.json`);
      return data;
    } catch (e) {
      console.log(e.message);
    }
  },
};
