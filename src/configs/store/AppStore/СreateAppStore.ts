import { action, makeObservable, observable, runInAction } from "mobx";
import { getData } from "../../../utils/api";

export interface Item {
  name: string;
  owner: { login: string; avatar_url: string };
  id: number;
  html_url: string;
}

class СreateAppStore {
  items: Array<Item> = [];
  page: number = 1;
  hasMore: boolean = true;
  itemsCount: number = 0;
  error: string = "";
  loading: boolean = false;

  constructor() {
    makeObservable(this, {
      items: observable,
      page: observable,
      hasMore: observable,
      error: observable,
      fetchData: action,
      updatePagination: action,
      removeItem: action,
      clearEverything: action,
    });
  }

  async fetchData(value?: string) {
    this.loading = true;
    try {
      if (value) {
        this.clearEverything();
      }
      const response = await getData(this.page, value || "");
      runInAction(() => {
        if (response.items) {
          if (this.itemsCount >= response.total_count) {
            this.hasMore = false;
          }
          this.items = [...this.items, ...response.items];
          this.updatePagination();
        }
      });
    } catch (error: any) {
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
      this.loading = false;
    }
  }

  updatePagination() {
    this.page += 1;
    this.itemsCount += 20;
  }

  clearEverything() {
    this.page = 1;
    this.itemsCount = 0;
    this.items = [];
  }

  removeItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

export default СreateAppStore;
