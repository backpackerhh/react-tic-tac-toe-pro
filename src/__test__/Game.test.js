import React from "react";
import { render, fireEvent, cleanup, waitForElement } from "@testing-library/react";

import Game from "../components/Game";
import { PLAYER_X, PLAYER_O } from "../components/constants";

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
