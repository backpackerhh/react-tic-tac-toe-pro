import React from "react";
import { mount } from "enzyme";

import Game from "../../components/Game";
import { PLAYER_O, PLAYER_X } from "../../components/constants";

// Helper function to get button by a text
const findButtonByText = (wrapper, text) => {
  return wrapper.findWhere(component => component.name() === "button" && component.text() === text);
};

it("should render board with correct number of squares", () => {
  const wrapper = mount(<Game />);
  const buttonX = findButtonByText(wrapper, "X");

  buttonX.simulate("click");

  expect(wrapper.find("Square").length).toBe(9);
});

it("should register and display result of human player's move", () => {
  const wrapper = mount(<Game />);
  const buttonX = findButtonByText(wrapper, "X");

  buttonX.simulate("click");

  const firstSquare = wrapper.find("Square").at(0);

  firstSquare.simulate("click");

  expect(firstSquare.text()).toBe("X");
});

it("should not make a move if the square is not empty", () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, null, PLAYER_O,
    null, null, null,
    null, null, null
  ];
  const wrapper = mount(<Game defaultGrid={grid} />);
  const buttonX = findButtonByText(wrapper, "X");

  buttonX.simulate("click");

  const nonEmptySquare = wrapper.find("Square").at(2); // Get non-empty square

  nonEmptySquare.simulate("click"); // Click it

  expect(nonEmptySquare.text()).toBe("O"); // Check that text content stays the same
});
