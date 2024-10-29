import { action, makeObservable, observable, runInAction } from "mobx";
import { getData } from "../../../utils/api";

export interface Items {
  name: string;
  owner: { login: string; avatar_url: string };
}

class createAppStore {
  items: Array<Items> = [];
  page: number = 1;
  hasMore: boolean = true;

  constructor() {
    makeObservable(this, {
      items: observable,
      page: observable,
      hasMore: observable,
      fetchData: action,
      updatePagination: action,
      removeItem: action,
    });
  }

  async fetchData(value?: string) {
    try {
      if (value) {
        this.page = 1;
        this.items = [];
      }
      const response = await getData(this.page, value || "");
      runInAction(() => {
        if (response.items) {
          this.hasMore = true;
          if (response.length === 0) {
            this.hasMore = false;
          }
          this.items = [...this.items, ...response.items];
        } else {
          alert(response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  updatePagination() {
    this.page += 1;
  }

  removeItem(login: string) {
    this.items = this.items.filter((item) => item.owner.login !== login);
  }
}

export default createAppStore;
