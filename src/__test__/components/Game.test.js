import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import Game from "../../components/Game";
import { PLAYER_O, PLAYER_X } from "../../components/constants";

// Helper function to get button by a text
const findButtonByText = (wrapper, text) => {
  return wrapper.findWhere(component => component.name() === "button" && component.text() === text);
};

jest.useFakeTimers();

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

it("should correctly show Player X as a winner", () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, null,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, null,     PLAYER_O
  ];
  const wrapper = mount(<Game defaultGrid={grid} />);
  const buttonX = findButtonByText(wrapper, "X");

  buttonX.simulate("click");

  wrapper
    .find("Square")
    .at(2)
    .simulate("click"); // Make the winning move

  act(() => {
    jest.runAllTimers(); // Wait for result modal to appear
  });

  wrapper.update();

  expect(wrapper.find("ModalContent").text()).toBe("Player X wins!"); // Check that result is declared properly
});

it("should correctly display the draw result", () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, PLAYER_O,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, PLAYER_X, PLAYER_O
  ];
  const wrapper = mount(<Game defaultGrid={grid} />);
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  wrapper
    .find("Square")
    .at(5)
    .simulate("click"); // Make the final move

  act(() => {
    jest.runAllTimers(); // Wait for result modal to appear
  });

  wrapper.update();

  expect(wrapper.find("ModalContent").text()).toBe("It's a draw"); // Check that result is declared properly
});

it("should correctly show Player O as a winner", () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null,     PLAYER_O,
    PLAYER_X, PLAYER_O, PLAYER_X,
    null,     PLAYER_X, null
  ];
  const wrapper = mount(<Game defaultGrid={grid} />);
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  wrapper
    .find("Square")
    .at(6)
    .simulate("click"); // Make the move

  act(() => {
    jest.runAllTimers(); // Wait for the computer move
    jest.runAllTimers(); // Run timers again for the result modal to appear
  });

  wrapper.update();

  expect(wrapper.find("ModalContent").text()).toBe("Player O wins!"); // Check that result is declared properly
});

it("should start a new game after 'Start over' button is pressed", () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null, PLAYER_O,
    PLAYER_X, PLAYER_O, null,
    null, PLAYER_X, PLAYER_X
  ];
  const wrapper = mount(<Game defaultGrid={grid} />);
  const buttonX = findButtonByText(wrapper, "X");

  buttonX.simulate("click");

  wrapper
    .find("Square")
    .at(6)
    .simulate("click"); // Make the winning move

  act(() => {
    jest.runAllTimers();
  });

  wrapper.update(); // Re-render component

  const restartButton = findButtonByText(wrapper, "Start over"); // Get restart button and click it

  restartButton.simulate("click");

  // Verify that new game screen is shown
  const choosePlayer = wrapper.findWhere(
    component => component.name() === "p" && component.text() === "Choose your player"
  );

  expect(choosePlayer.length).toBe(1);
});
