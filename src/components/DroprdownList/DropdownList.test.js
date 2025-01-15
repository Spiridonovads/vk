import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownList } from "./DropdownList";

const mockOptions = ["option1", "option2", "option3"];
const mockOptionsContent = ["Option 1", "Option 2", "Option 3"];
const mockLabel = "Test Dropdown";
const mockId = "test-dropdown";
const mockValue = mockOptions[0];
const mockSetValue = jest.fn();

const renderDropdownList = (props = {}) => {
  return render(
    <DropdownList
      options={mockOptions}
      optionsContent={mockOptionsContent}
      id={mockId}
      label={mockLabel}
      value={mockValue}
      setValue={mockSetValue}
      ref={React.createRef()}
      {...props}
    />
  );
};

describe("DropdownList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dropdown component with the correct label", () => {
    renderDropdownList();

    expect(screen.getAllByText(mockLabel).length).toBeGreaterThan(0);
  });

  it("displays the correct options in the dropdown", () => {
    renderDropdownList();

    fireEvent.mouseDown(screen.getByRole("combobox"));

    const dropdownOptions = screen.getAllByRole("option");
    mockOptionsContent.forEach((content, index) => {
      expect(dropdownOptions[index]).toHaveTextContent(content);
    });
  });

  it("calls setValue with the selected value when an option is clicked", () => {
    renderDropdownList();

    fireEvent.mouseDown(screen.getByRole("combobox"));

    const secondOption = screen.getByText(mockOptionsContent[1]);
    fireEvent.click(secondOption);

    console.log(mockSetValue.mock.calls);

    const callArgs = mockSetValue.mock.calls[0][0];
    expect(callArgs.target.value).toBe(mockOptions[1]);
  });

  it("displays the selected value in the dropdown", () => {
    renderDropdownList({ value: mockOptions[1] });

    expect(screen.getByRole("combobox")).toHaveTextContent(
      mockOptionsContent[1]
    );
  });
});
