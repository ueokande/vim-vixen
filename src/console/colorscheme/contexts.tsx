import React from "react";
import ColorScheme from "../../shared/ColorScheme";

export const ColorSchemeContext = React.createContext<ColorScheme>(
  ColorScheme.System
);

export const ColorSchemeUpdateContext = React.createContext<
  (colorscheme: ColorScheme) => void
>(() => {});
