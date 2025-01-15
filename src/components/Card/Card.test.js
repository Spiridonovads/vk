import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card } from "./Card";
import appStore from "../../configs/store/AppStore/AppStore";

jest.mock("../../configs/store/AppStore/AppStore");

describe("Card component", () => {
  const mockProps = {
    login: "testuser",
    avatar_url: "http://example.com/avatar.jpg",
    name: "Test User",
    id: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with provided props", () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    const avatar = screen.getByRole("img", { name: /avatar of testuser/i });
    expect(avatar).toHaveAttribute("src", mockProps.avatar_url);

    expect(screen.getByText(/You appreciated:/i)).toHaveTextContent("1");
  });

  test("calls removeItem on hide button click", () => {
    render(<Card {...mockProps} />);

    fireEvent.click(screen.getByRole("button", { name: /hide/i }));

    expect(appStore.removeItem).toHaveBeenCalledWith(mockProps.id);
  });

  test("toggles edit state on edit button click", () => {
    render(<Card {...mockProps} />);

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("updates score on select change", () => {
    render(<Card {...mockProps} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const select = screen.getByRole("combobox", { name: /rating/i });
    fireEvent.mouseDown(select);

    const option = screen.getByRole("option", { name: /3/i });
    fireEvent.click(option);

    expect(screen.getByText(/You appreciated:/i)).toHaveTextContent("You appreciated: 3");
  });
});
