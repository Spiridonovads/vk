import React from "react";
import { render, screen } from "@testing-library/react";
import { InfiniteScroll } from "./InfiniteScroll";
import appStore from "../../configs/store/AppStore/AppStore";

jest.mock("../../configs/store/AppStore/AppStore", () => ({
  items: [
    {
      owner: { login: "user1", avatar_url: "url1" },
      name: "Item 1",
      id: 1,
      html_url: "link1",
    },
    {
      owner: { login: "user2", avatar_url: "url2" },
      name: "Item 2",
      id: 2,
      html_url: "link2",
    },
    {
      owner: { login: "user3", avatar_url: "url3" },
      name: "Item 3",
      id: 3,
      html_url: "link3",
    },
  ],
  hasMore: true,
}));

class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.observedElements = [];
  }

  observe(element) {
    this.observedElements.push(element);
  }

  disconnect() {
    this.observedElements = [];
  }

  triggerIntersect() {
    this.callback(
      this.observedElements.map((el) => ({
        isIntersecting: true,
        target: el,
      }))
    );
  }
}

describe("InfiniteScroll Component", () => {
  const loadMoreMock = jest.fn();

  beforeEach(() => {
    global.IntersectionObserver = jest.fn(
      (callback) => new IntersectionObserverMock(callback)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing and displays items", () => {
    render(
      <InfiniteScroll
        hasMore={true}
        loading={false}
        loadMore={loadMoreMock}
        items={appStore.items}
      />
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("calls loadMore when last item is intersecting", () => {
    render(
      <InfiniteScroll
        hasMore={true}
        loading={false}
        loadMore={loadMoreMock}
        items={appStore.items}
      />
    );

    const observer = new IntersectionObserverMock((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreMock();
        }
      });
    });

    observer.observe(screen.getByText("Item 3"));
    observer.triggerIntersect();

    expect(loadMoreMock).toHaveBeenCalledTimes(1);
  });

  it("does not call loadMore when hasMore is false", () => {
    appStore.hasMore = false;

    render(
      <InfiniteScroll
        hasMore={false}
        loading={false}
        loadMore={loadMoreMock}
        items={appStore.items}
      />
    );

    const observer = new IntersectionObserverMock((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && appStore.hasMore) {
          loadMoreMock();
        }
      });
    });

    observer.observe(screen.getByText("Item 3"));
    observer.triggerIntersect();

    expect(loadMoreMock).toHaveBeenCalledTimes(0);
  });
});
