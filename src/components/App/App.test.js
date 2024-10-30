import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { observer } from "mobx-react-lite";
import appStore from "../../configs/store/AppStore/AppStore";
import { App } from "./App";

jest.mock("../../configs/store/AppStore/AppStore", () => ({
  fetchData: jest.fn(),
  hasMore: true,
  loading: false,
  items: [],
  error: null,
}));

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the App component correctly", () => {
    render(<App />);

    const titleElement = screen.getByText(/GitHub repositories/i);
    expect(titleElement).toBeInTheDocument();

    const dropdown = screen.getByLabelText(/Filters/i);
    expect(dropdown).toBeInTheDocument();
  });

  test("dropdown changes filter state", async () => {
    render(<App />);

    const dropdownButton = screen.getByLabelText(/Filters/i);
    fireEvent.mouseDown(dropdownButton);

    const forksOption = await screen.findByRole("option", {
      name: "Number of forks",
    });
    fireEvent.click(forksOption);

    expect(appStore.fetchData).toHaveBeenCalledWith("forks");

    fireEvent.mouseDown(dropdownButton);

    const updatedOption = await screen.findByRole("option", {
      name: "Number of updated",
    });
    fireEvent.click(updatedOption);

    expect(appStore.fetchData).toHaveBeenCalledWith("updated");
  });

  test("shows error message when there is an error", async () => {
    appStore.error = "An error occurred";

    render(<App />);

    const errorMessage = screen.getByText(/An error occurred/i);
    expect(errorMessage).toBeInTheDocument();

    const reloadMessage = screen.getByText(/please reload the page/i);
    expect(reloadMessage).toBeInTheDocument();
  });

  test("calls fetchMoreData when loading more data", async () => {
    appStore.hasMore = true;
    render(<App />);

    const fetchMoreData = jest.spyOn(appStore, "fetchData");

    const scrollableElement = screen
      .getByText(/GitHub repositories/i)
      .closest("div");

    fireEvent.scroll(scrollableElement, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(fetchMoreData).toHaveBeenCalledTimes(1);
    });
  });
});
