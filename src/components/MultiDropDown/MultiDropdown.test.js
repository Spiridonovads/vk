import React from "react";
import { render, screen } from "@testing-library/react";
import MultiDropdown from "./MultiDropdown";
import appStore from "../../configs/store/AppStore/AppStore";
import userEvent from "@testing-library/user-event";

jest.mock("../../configs/store/AppStore/AppStore", () => ({
  fetchData: jest.fn(),
}));

describe("MultiDropdown Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders MultiDropdown with the correct initial state", () => {
    render(<MultiDropdown />);
    expect(screen.getByLabelText(/filters/i)).toBeInTheDocument();
  });

  test("calls fetchData with the correct argument when the selection changes", async () => {
    render(<MultiDropdown />);
    await userEvent.click(screen.getByLabelText(/filters/i));

    await userEvent.click(screen.getByText(/number of stars/i));
    expect(appStore.fetchData).toHaveBeenCalledWith("stars");
    const select = screen.getByRole("combobox");
    expect(select).toHaveTextContent("Number of stars");
  });

  test("does not call fetchData when the same option is selected", async () => {
    render(<MultiDropdown />);

    await userEvent.click(screen.getByLabelText(/filters/i));
    await userEvent.click(screen.getByText(/number of stars/i));

    await userEvent.click(screen.getByLabelText(/filters/i));
    const allStarsElements = screen.getAllByText(/number of stars/i);
    await userEvent.click(allStarsElements[0]);

    expect(appStore.fetchData).toHaveBeenCalledTimes(1);
  });
});
