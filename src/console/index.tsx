import React from "react";
import ReactDOM from "react-dom";
import ColorSchemeProvider from "./colorscheme/providers";
import { AppProvider } from "./app/provider";
import App from "./App";
import "./index.css";

const colorScheme = (new URLSearchParams(window.location.search)).get('colorScheme')
/* @ts-ignore */
window.document.documentElement.style.colorScheme = colorScheme ?? ''

window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("vimvixen-console");
  ReactDOM.render(
    <React.StrictMode>
      <AppProvider>
        <ColorSchemeProvider>
          <App />
        </ColorSchemeProvider>
      </AppProvider>
    </React.StrictMode>,
    wrapper
  );
});
