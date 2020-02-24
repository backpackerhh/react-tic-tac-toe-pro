import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

import Board from "./Board";
import { DIMENSIONS, PLAYER_X, PLAYER_O, SQUARE_DIMENSIONS, GAME_STATES, DRAW } from "./constants";
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

const board = new Board();

const Game = () => {
  const [grid, setGrid] = useState(board.grid);
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [nextMove, setNextMove] = useState(null);
  const [winner, setWinner] = useState(null);

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

        {winner}
      </Container>
    );
  };

  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });

    setGameState(GAME_STATES.inProgress);

    setNextMove(PLAYER_X); // Set the Player X to make the first move
  };

  const move = useCallback(
    (index, player) => {
      if (player && gameState === GAME_STATES.inProgress) {
        setGrid(grid => {
          const gridCopy = grid.concat();

          gridCopy[index] = player;

          return gridCopy;
        });
      }
    },
    [gameState]
  );

  const computerMove = useCallback(() => {
    let index = getRandomInt(0, 8);

    while (grid[index]) {
      index = getRandomInt(0, 8);
    }

    move(index, players.computer);

    setNextMove(players.human);
  }, [move, grid, players]);

  const humanMove = index => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);

      setNextMove(players.computer);
    }
  };

  useEffect(() => {
    let timeout;

    if (nextMove !== null && nextMove === players.computer && gameState !== GAME_STATES.over) {
      // Delay computer moves to make them more natural
      timeout = setTimeout(() => {
        computerMove();
      }, 500);
    }

    return () => timeout && clearTimeout(timeout);
  }, [nextMove, computerMove, players.computer, gameState]);

  useEffect(() => {
    const winner = board.getWinner(grid);

    const declareWinner = winner => {
      let winnerStr;

      switch (winner) {
        case PLAYER_X:
          winnerStr = "Player X wins!";
          break;
        case PLAYER_O:
          winnerStr = "Player O wins!";
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }

      setGameState(GAME_STATES.over);

      setWinner(winnerStr);
    };

    if (winner !== null && gameState !== GAME_STATES.over) {
      declareWinner(winner);
    }
  }, [gameState, grid, nextMove]);

  return gameState === GAME_STATES.notStarted ? notStartedGame() : alreadyStartedGame();
};

export default Game;
