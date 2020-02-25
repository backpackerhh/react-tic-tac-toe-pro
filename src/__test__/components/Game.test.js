import React from "react";
import { mount } from "enzyme";

import Game from "../../components/Game";

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
