import Board from "../../components/Board";
import { PLAYER_O, PLAYER_X, DRAW } from "../../components/constants";

describe("getEmptySquares", () => {
  it("should get correct empty squares for the board", () => {
    const board = new Board();

    expect(board.getEmptySquares().length).toBe(9);
    expect(board.getEmptySquares()).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    // Check the number of empty squares is updated after Player X moves
    board.makeMove(0, PLAYER_X);

    expect(board.getEmptySquares().length).toBe(8);
    expect(board.getEmptySquares()).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    // Check the number of empty squares is updated after Player O moves
    board.makeMove(5, PLAYER_O);

    expect(board.getEmptySquares().length).toBe(7);
    expect(board.getEmptySquares()).toStrictEqual([1, 2, 3, 4, 6, 7, 8]);
  });
});

describe("isEmpty", () => {
  it("returns true when no move has been made", () => {
    // prettier-ignore
    const grid = [
      null, null, null,
      null, null, null,
      null, null, null
    ];
    const board = new Board(grid);

    expect(board.isEmpty()).toBe(true);
  });

  it("returns false when some move has been made", () => {
    // prettier-ignore
    const grid = [
      null, null, null,
      null, PLAYER_X, null,
      null, null, null
    ];
    const board = new Board(grid);

    expect(board.isEmpty()).toBe(false);
  });
});

describe("getWinner", () => {
  let board;

  it("should find a winner", () => {
    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_X, PLAYER_X,
      PLAYER_O, PLAYER_O, PLAYER_X,
      PLAYER_O, PLAYER_X, PLAYER_O
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);

    // prettier-ignore
    board = new Board([
      null, PLAYER_O, PLAYER_O,
      PLAYER_X, PLAYER_X, PLAYER_X,
      null, PLAYER_O, PLAYER_O
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);

    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_O, PLAYER_O,
      PLAYER_O, PLAYER_X, PLAYER_O,
      PLAYER_X, PLAYER_X, PLAYER_X
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);

    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_O, PLAYER_O,
      PLAYER_X, PLAYER_O, PLAYER_O,
      PLAYER_X, PLAYER_X, null
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);

    // prettier-ignore
    board = new Board([
      PLAYER_O, PLAYER_X, PLAYER_O,
      null, PLAYER_X, PLAYER_O,
      null, PLAYER_X, null
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);

    // prettier-ignore
    board = new Board([
      PLAYER_O, PLAYER_O, PLAYER_X,
      null, PLAYER_O, PLAYER_X,
      null, null, PLAYER_X
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);

    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_O, PLAYER_X,
      PLAYER_O, PLAYER_X, PLAYER_O,
      PLAYER_X, null, PLAYER_X
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);

    // prettier-ignore
    board = new Board([
      PLAYER_O, PLAYER_O, PLAYER_X,
      null, PLAYER_X, PLAYER_O,
      PLAYER_X, null, null
    ]);
    expect(board.getWinner()).toBe(PLAYER_X);
  });

  it("should correctly identify when the game draws", () => {
    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_X, PLAYER_O,
      PLAYER_O, PLAYER_O, PLAYER_X,
      PLAYER_X, PLAYER_O, PLAYER_X
    ]);
    expect(board.getWinner()).toBe(DRAW);

    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_O, PLAYER_O,
      PLAYER_O, PLAYER_X, PLAYER_X,
      PLAYER_X, PLAYER_O, PLAYER_O
    ]);
    expect(board.getWinner()).toBe(DRAW);
  });

  it("should not show draw when game is still in process", () => {
    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_O, PLAYER_X,
      PLAYER_O, PLAYER_X, PLAYER_X,
      PLAYER_X, null, PLAYER_O
    ]);
    expect(board.getWinner()).not.toBe(DRAW);
  });

  it("should correctly identify when the game is still in progress", () => {
    // prettier-ignore
    board = new Board([
      PLAYER_X, null, PLAYER_X,
      PLAYER_O, null, PLAYER_X,
      PLAYER_X, null, PLAYER_O
    ]);
    expect(board.getWinner()).toBe(null);

    // prettier-ignore
    board = new Board([
      PLAYER_X, PLAYER_O, PLAYER_X,
      PLAYER_O, PLAYER_X, PLAYER_X,
      null, PLAYER_X, PLAYER_O
    ]);
    expect(board.getWinner()).toBe(null);
  });
});

describe("makeMove", () => {
  let board;

  it("should put correct player into correct square", () => {
    board = new Board();

    board.makeMove(1, PLAYER_X);

    expect(board.grid[1]).toBe(PLAYER_X);

    board.makeMove(3, PLAYER_O);

    expect(board.grid[3]).toBe(PLAYER_O);
  });

  it("should not make a move is a square is not empty", () => {
    board = new Board();

    board.makeMove(1, PLAYER_X);

    expect(board.grid[1]).toBe(PLAYER_X);

    board.makeMove(1, PLAYER_O);

    expect(board.grid[1]).toBe(PLAYER_X);
  });
});

describe("clone", () => {
  let board;

  it("should make a copy of the board", () => {
    // prettier-ignore
    board = new Board([
      PLAYER_X, null, null,
      null, null, null,
      null, null, null
    ]);

    const copy = board.clone();

    expect(JSON.stringify(board)).toBe(JSON.stringify(copy));
  });

  it("the original board should not be affected by changes to copy", () => {
    // prettier-ignore
    board = new Board([
      PLAYER_X, null, null,
      null, null, null,
      null, null, null
    ]);

    const copy = board.clone();

    copy.makeMove(2, PLAYER_O);

    expect(board.grid).not.toStrictEqual(copy.grid);
    // prettier-ignore
    expect(board.grid).toStrictEqual([
      PLAYER_X, null, null,
      null, null, null,
      null, null, null
    ]);
  });
});
