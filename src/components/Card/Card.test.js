import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card } from "./Card";
import appStore from "../../configs/store/AppStore/AppStore";
import "@testing-library/jest-dom";

jest.mock("../../configs/store/AppStore/AppStore", () => ({
  removeItem: jest.fn(),
}));

describe("Card Component", () => {
  const defaultProps = {
    login: "user1",
    avatar_url: "avatar1.jpg",
    name: "Test Repo",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders component with correct props", () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText("Test Repo")).toBeInTheDocument();
    expect(screen.getByAltText("Avatar of user1")).toHaveAttribute(
      "src",
      "avatar1.jpg"
    );
  });

  it("toggles edit mode when edit button is clicked", () => {
    render(<Card {...defaultProps} />);

    expect(screen.queryByText("select a rating:")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByText("select a rating:")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.queryByText("select a rating:")).not.toBeInTheDocument();
  });

  it("closes edit mode when clicking outside of it", () => {
    render(<Card {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByText("select a rating:")).toBeInTheDocument();

    fireEvent.mouseDown(document);
    expect(screen.queryByText("select a rating:")).not.toBeInTheDocument();
  });

  it("calls removeItem on hide button click", () => {
    render(<Card {...defaultProps} />);

    fireEvent.click(screen.getByText("hide"));
    expect(appStore.removeItem).toHaveBeenCalledWith("user1");
  });

  it("updates score state when a new score is selected", () => {
    render(<Card {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "4" } });

    expect(select).toHaveValue("4");
  });

  it("displays the correct score class based on score", () => {
    render(<Card {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "1" } });
    expect(screen.getByText("Score:")).toContainHTML(
      '<span class="bad">1</span>'
    );

    fireEvent.change(select, { target: { value: "3" } });
    expect(screen.getByText("Score:")).toContainHTML(
      '<span class="normal">3</span>'
    );

    fireEvent.change(select, { target: { value: "5" } });
    expect(screen.getByText("Score:")).toContainHTML(
      '<span class="good">5</span>'
    );
  });

  it("renders edit form initially hidden", () => {
    render(<Card {...defaultProps} />);

    expect(screen.queryByText("select a rating:")).not.toBeInTheDocument();
  });

  it("handles multiple edits correctly", () => {
    render(<Card {...defaultProps} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });

    expect(select).toHaveValue("2");

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(editButton);

    fireEvent.change(select, { target: { value: "5" } });
    expect(select).toHaveValue("5");
  });
});
