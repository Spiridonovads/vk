import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MultiDropdown from "./MultiDropDown";
import appStore from "../../configs/store/AppStore/AppStore";
import "@testing-library/jest-dom";

jest.mock("../../configs/store/AppStore/AppStore", () => ({
  fetchData: jest.fn(),
}));

describe("MultiDropdown Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default option selected", () => {
    render(<MultiDropdown />);

    expect(screen.getByText("Number of stars")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("stars");
  });

  it("calls fetchData with the correct argument on selection change", () => {
    render(<MultiDropdown />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "forks" } });

    expect(appStore.fetchData).toHaveBeenCalledWith("forks");
    expect(select).toHaveValue("forks");
  });

  it("displays the filters label", () => {
    render(<MultiDropdown />);

    expect(screen.getByText("Filters:")).toBeInTheDocument();
  });

  it("renders all options correctly", () => {
    render(<MultiDropdown />);

    expect(
      screen.getByRole("option", { name: "Number of stars" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Number of forks" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Number of updated" })
    ).toBeInTheDocument();
  });

  it("does not call fetchData if the same option is selected again", () => {
    render(<MultiDropdown />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "updated" } });
    expect(appStore.fetchData).toHaveBeenCalledWith("updated");

    fireEvent.change(select, { target: { value: "updated" } });
    expect(appStore.fetchData).toHaveBeenCalledTimes(1);
  });
});
