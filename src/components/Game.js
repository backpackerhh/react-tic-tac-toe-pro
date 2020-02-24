import React, { useState } from "react";
import styled from "styled-components";

import { DIMENSIONS, PLAYER_X, PLAYER_O, SQUARE_DIMENSIONS, GAME_STATES } from "./constants";
import { getRandomInt, switchPlayer } from "./utils";

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

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Screen = styled.div``;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const ChooseText = styled.p``;

const defaultBoard = new Array(DIMENSIONS ** 2).fill(null);

const Game = () => {
  const [grid, setGrid] = useState(defaultBoard);
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);

  const notStartedGame = () => {
    return (
      <Screen>
        <Inner>
          <ChooseText>Choose your player</ChooseText>
          <ButtonRow>
            <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
            <p>or</p>
            <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
          </ButtonRow>
        </Inner>
      </Screen>
    );
  };

  const alreadyStartedGame = () => {
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

  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });

    setGameState(GAME_STATES.inProgress);
  };

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

  return gameState === GAME_STATES.notStarted ? notStartedGame() : alreadyStartedGame();
};

export default Game;
