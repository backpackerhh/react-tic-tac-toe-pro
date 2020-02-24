import React, { useState } from "react";
import styled from "styled-components";

import { DIMENSIONS, PLAYER_X, PLAYER_O, SQUARE_DIMENSIONS } from "./constants";
import { getRandomInt } from "./utils";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ dimensions }) => `${dimensions * (SQUARE_DIMENSIONS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMENSIONS}px;
  height: ${SQUARE_DIMENSIONS}px;
  border: 1px solid black;

  &:hover {
    cursor: pointer;
  }
`;

const Marker = styled.p`
  font-size: 68px;
`;

const defaultBoard = new Array(DIMENSIONS ** 2).fill(null);

const Game = () => {
  const [grid, setGrid] = useState(defaultBoard);
  const [players, setPlayers] = useState({
    human: PLAYER_X,
    computer: PLAYER_O
  });

  const move = (index, player) => {
    setGrid(grid => {
      const gridCopy = grid.concat();
      gridCopy[index] = player;

      return gridCopy;
    });
  };

  const computerMove = () => {
    let index = getRandomInt(0, 8);

    while (grid[index]) {
      index = getRandomInt(0, 8);
    }

    move(index, players.computer);
  };

  const humanMove = index => {
    if (!grid[index]) {
      move(index, players.human);

      computerMove();
    }
  };

  return (
    <Container dimensions={DIMENSIONS}>
      {grid.map((value, index) => {
        const isActive = value !== null;

        return (
          <Square key={index} onClick={() => humanMove(index)}>
            {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
          </Square>
        );
      })}
    </Container>
  );
};

export default Game;
