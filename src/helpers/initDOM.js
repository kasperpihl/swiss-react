import React from "react";
import SwissStyleHandler from "../components/SwissStyleHandler";
export default () => {
  const render = require("react-dom").render;
  console.log(render);

  const _domEl = document.createElement("style");
  _domEl.id = "swiss-styles";
  _domEl.type = "text/css";
  document.head.appendChild(_domEl);
  render(
    <SwissStyleHandler
      ref={c => {
        console.log("ref", c);
      }}
    />,
    document.getElementById("swiss-styles")
  );
};
