import React from "react";
import { render, fireEvent, cleanup, waitForElement } from "@testing-library/react";

import Game from "../../components/Game";
import { PLAYER_X, PLAYER_O } from "../../components/constants";

afterEach(cleanup);

it("should render board with correct number of squares", () => {
  const { getAllByTestId, getByText } = render(<Game />);

  fireEvent.click(getByText("X")); // Click 'X' to start game as player X

  expect(getAllByTestId(/square/).length).toEqual(9);
});

it("should register and display result of human player's move", async () => {
  const { getByTestId, getByText } = render(<Game />);

  fireEvent.click(getByText("X"));
  fireEvent.click(getByTestId("square_1")); // Click the first square

  expect(getByTestId("square_1")).toHaveTextContent("X"); // Validate that it has 'X' rendered

  await waitForElement(() => getByText("O")); // Wait for computer move

  expect(getByText("O")).toBeInTheDocument(); // Check that we have 'O' in the DOM
});

it("should not make a move if the square is not empty", () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, null, PLAYER_O,
    null, null, null,
    null, null, null
  ]
  const { getByTestId, getByText } = render(<Game defaultGrid={grid} />);

  fireEvent.click(getByText("X"));
  fireEvent.click(getByTestId("square_2")); // Click non-empty square

  expect(getByTestId("square_2")).toHaveTextContent("O"); // Should have initial value
});

it("should correctly show Player X as a winner", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, null,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, null, PLAYER_O
  ];
  const { getByTestId, getByText } = render(<Game defaultGrid={grid} />);

  fireEvent.click(getByText("X"));
  fireEvent.click(getByTestId("square_2")); // Make the winning move

  await waitForElement(() => getByText("Player X wins!")); // Wait for result modal to appear

  expect(getByText("Player X wins!")).toBeInTheDocument(); // Check that result is declared properly
});

it("should correctly display the draw result", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, PLAYER_O,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, PLAYER_X, PLAYER_O
  ];
  const { getByTestId, getByText } = render(<Game defaultGrid={grid} />);

  fireEvent.click(getByText("X"));
  fireEvent.click(getByTestId("square_5")); // Make the final move

  await waitForElement(() => getByText("It's a draw")); // Wait for result modal to appear

  expect(getByText("It's a draw")).toBeInTheDocument(); // Check that result is declared properly
});

it("should correctly show Player O as a winner", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null, PLAYER_O,
    PLAYER_X, PLAYER_O, PLAYER_X,
    null, PLAYER_X, null
  ];
  const { getByTestId, getByText } = render(<Game defaultGrid={grid} />);

  fireEvent.click(getByText("X"));
  fireEvent.click(getByTestId("square_6")); // Make the move

  await waitForElement(() => getByText("Player O wins!")); // Wait for result modal to appear

  expect(getByText("Player O wins!")).toBeInTheDocument(); // Check that result is declared properly
});

it("should start a new game after 'Start over' button is pressed", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null, PLAYER_O,
    PLAYER_X, PLAYER_O, null,
    null, PLAYER_X, PLAYER_X
  ];
  const { getByTestId, getByText } = render(<Game defaultGrid={grid} />);

  fireEvent.click(getByText("X"));
  fireEvent.click(getByTestId("square_6")); // Make the winning move

  await waitForElement(() => getByText("Start over"));

  fireEvent.click(getByText("Start over"));

  await waitForElement(() => getByText("Choose your player"));

  expect(getByText("Choose your player")).toBeInTheDocument();
});
