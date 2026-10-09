import React from "react";
import ReactDOM from "react-dom/client";
import { Index } from "./routes/index";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Index />
    </React.StrictMode>
  );
}
