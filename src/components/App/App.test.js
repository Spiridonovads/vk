import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import appStore from "../../configs/store/AppStore/AppStore";
import { App } from "./App";
import toast from "react-hot-toast";

jest.mock("../../configs/store/AppStore/AppStore", () => ({
  fetchData: jest.fn(),
  hasMore: true,
  loading: false,
  items: [],
  error: null,
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: jest.fn(),
  Toaster: jest.fn(() => <div>Toast Container</div>),
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

    expect(toast).toHaveBeenCalledWith("Server connection error:(");
  });
});
