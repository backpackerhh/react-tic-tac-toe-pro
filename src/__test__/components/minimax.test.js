import { minimax } from "../../components/minimax";
import Board from "../../components/Board";
import { PLAYER_O, PLAYER_X } from "../../components/constants";

describe("minimax", () => {
  let board;

  it("should do nothing when game has already a winner", () => {
    // prettier-ignore
    board = new Board([
      PLAYER_O, PLAYER_O, PLAYER_X,
      null, PLAYER_X, null,
      PLAYER_X, PLAYER_X, PLAYER_O
    ]);

    expect(minimax(board, PLAYER_O)[1]).toBe(0);
  });

  it("should correctly identify the best move", () => {
    // prettier-ignore
    board = new Board([
      null, PLAYER_O, null,
      null, PLAYER_X, null,
      PLAYER_X, PLAYER_X, PLAYER_O
    ]);
    expect(minimax(board, PLAYER_O)[1]).toBe(2);

    // prettier-ignore
    board = new Board([
      PLAYER_X, null, null,
      null, PLAYER_O, PLAYER_X,
      PLAYER_O, PLAYER_X, PLAYER_O
    ]);
    expect(minimax(board, PLAYER_O)[1]).toBe(2);

    // prettier-ignore
    board = new Board([
      PLAYER_O, null, null,
      null, PLAYER_X, PLAYER_X,
      null, PLAYER_O, PLAYER_X
    ]);
    expect(minimax(board, PLAYER_X)[1]).toBe(6);
  });
});
