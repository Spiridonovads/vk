import { makeAutoObservable, runInAction } from "mobx";
import { getData } from "../../../utils/api";

export interface Item {
  name: string;
  owner: { login: string; avatar_url: string };
  id: number;
  html_url: string;
}

class СreateAppStore {
  items: Array<Item> = [];
  page: number = 0;
  hasMore: boolean = true;
  itemsCount: number = 0;
  error: string = "";
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  async fetchData(sort?: string) {
    this.setLoading(true);
    try {
      if (sort) {
        this.clearEverything();
      }
      this.updatePagination();
      const response = await getData(this.page, sort || "");

      runInAction(() => {
        if (response.items) {
          if (this.itemsCount >= response.total_count) {
            this.hasMore = false;
          }
          this.items = [...this.items, ...response.items];
        }
      });
    } catch (error: unknown) {
      runInAction(() => {
        if (error instanceof Error) {
          this.error = error.message;
        } else if (typeof error === "string") {
          this.error = error;
        } else {
          this.error = "An unknown error occurred";
        }
      });
    } finally {
      this.setLoading(false);
    }
  }

  updatePagination() {
    this.page += 1;
    this.itemsCount += 100;
  }

  clearEverything() {
    this.page = 0;
    this.itemsCount = 0;
    this.items = [];
  }

  removeItem(id: number) {
    this.items = [...this.items].filter((item) => item.id !== id);
  }
}

export default СreateAppStore;
