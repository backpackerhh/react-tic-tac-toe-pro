import React from "react";
import ReactDOM from "react-dom";

import { ResultModal } from "../../components/ResultModal";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(<ResultModal />, div);

  ReactDOM.unmountComponentAtNode(div);
});
