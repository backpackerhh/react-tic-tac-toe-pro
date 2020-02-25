import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Modal from "react-modal";

import Board from "./Board";
import { ResultModal } from "./ResultModal";
import {
  DIMENSIONS,
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMENSIONS,
  GAME_STATES,
  DRAW,
  GAME_MODES
} from "./constants";
import { getRandomInt, switchPlayer } from "./utils";
import { minimax } from "./minimax";
import { border } from "./styles";

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
  ${border};

  &:hover {
    cursor: pointer;
  }
`;
Square.displayName = "Square";

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

const Strikethrough = styled.div`
  position: absolute;
  ${({ styles }) => styles}
  background-color: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

const board = new Board();

const Game = ({ defaultGrid = board.grid }) => {
  const [grid, setGrid] = useState(defaultGrid);
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [nextMove, setNextMove] = useState(null);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(GAME_MODES.medium);
  const [modalOpen, setModalOpen] = useState(false);

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
    // Important to pass a copy of the grid here
    const newBoard = new Board(grid.concat());
    const emptyIndices = newBoard.getEmptySquares(grid);
    let index;

    switch (mode) {
      case GAME_MODES.easy:
        index = getRandomInt(0, 8);

        while (!emptyIndices.includes(index)) {
          index = getRandomInt(0, 8);
        }

        break;
      case GAME_MODES.medium:
        // Medium level is basically ~half of the moves are minimax and the other ~half random
        const smartMove = !newBoard.isEmpty(grid) && Math.random() < 0.5;

        if (smartMove) {
          index = minimax(newBoard, players.computer)[1];
        } else {
          index = getRandomInt(0, 8);

          while (!emptyIndices.includes(index)) {
            index = getRandomInt(0, 8);
          }
        }

        break;
      case GAME_MODES.difficult:
      default:
        index = newBoard.isEmpty(grid)
          ? getRandomInt(0, 8)
          : minimax(newBoard, players.computer)[1];
    }

    if (!grid[index]) {
      move(index, players.computer);

      setNextMove(players.human);
    }
  }, [move, grid, players, mode]);

  const humanMove = index => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);

      setNextMove(players.computer);
    }
  };

  const changeMode = e => {
    setMode(e.target.value);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);

    setGrid(board.grid);

    setModalOpen(false); // Close the modal when new game starts
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

      // Slight delay for the modal so there is some time to see the last move
      setTimeout(() => setModalOpen(true), 300);
    };

    if (winner !== null && gameState !== GAME_STATES.over) {
      declareWinner(winner);
    }

    Modal.setAppElement("body");
  }, [gameState, grid, nextMove]);

  return gameState === GAME_STATES.notStarted ? (
    <Screen>
      <Inner>
        <ChooseText>Select difficulty</ChooseText>
        <select onChange={changeMode} value={mode}>
          {Object.keys(GAME_MODES).map(key => {
            const gameMode = GAME_MODES[key];
            return (
              <option key={gameMode} value={gameMode}>
                {key}
              </option>
            );
          })}
        </select>
      </Inner>
      <Inner>
        <ChooseText>Choose your player</ChooseText>
        <ButtonRow>
          <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
          <p>or</p>
          <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
        </ButtonRow>
      </Inner>
    </Screen>
  ) : (
    <Container dimensions={DIMENSIONS}>
      {grid.map((value, index) => {
        const isActive = value !== null;

        return (
          <Square key={index} onClick={() => humanMove(index)}>
            {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
          </Square>
        );
      })}

      <Strikethrough styles={gameState === GAME_STATES.over && board.getStrikethroughStyles()} />

      <ResultModal
        isOpen={modalOpen}
        winner={winner}
        close={() => setModalOpen(false)}
        startNewGame={startNewGame}
      />
    </Container>
  );
};

export default Game;
