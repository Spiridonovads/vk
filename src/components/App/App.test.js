import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App";
import appStore from "../../configs/store/AppStore/AppStore";

jest.mock("../../configs/store/AppStore/AppStore", () => {
  const store = {
    fetchData: jest.fn(),
    updatePagination: jest.fn(),
    items: [],
    hasMore: true,
  };
  return store;
});

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls fetchData on initial render", () => {
    render(<App />);
    expect(appStore.fetchData).toHaveBeenCalledTimes(1);
  });

  it("shows loader when fetching more data", async () => {
    render(<App />);

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(screen.getByText("...Loading")).toBeInTheDocument();
    });
  });

  it("fetches more data when scrolling", async () => {
    render(<App />);

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(appStore.updatePagination).toHaveBeenCalled();
      expect(appStore.fetchData).toHaveBeenCalledTimes(2);
    });
  });

  it("renders items from the store", () => {
    appStore.items = [
      { owner: { login: "user1", avatar_url: "avatar1.png" }, name: "Repo 1" },
      { owner: { login: "user2", avatar_url: "avatar2.png" }, name: "Repo 2" },
    ];

    render(<App />);

    expect(screen.getByText("Repo 1")).toBeInTheDocument();
    expect(screen.getByText("Repo 2")).toBeInTheDocument();
  });

  it("displays a dropdown component", () => {
    render(<App />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("does not fetch more data when hasMore is false", async () => {
    appStore.hasMore = false;

    render(<App />);

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(appStore.fetchData).toHaveBeenCalledTimes(1);
    });
  });
});
