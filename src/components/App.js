import React from "react";
import styled from "styled-components";
import Game from "./Game";
import "papercss/dist/paper.min.css";

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const App = () => {
  return (
    <Main>
      <Game />
    </Main>
  );
};

export default App;
