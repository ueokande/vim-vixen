import React from "react";
import ColorScheme from "../../shared/ColorScheme";
import { ThemeProvider } from "styled-components";
import baseStyled, { ThemedStyledInterface } from "styled-components";

type ThemeProperties = {
  completionTitleBackground: string;
  completionTitleForeground: string;
  completionItemBackground: string;
  completionItemForeground: string;
  completionItemDescriptionForeground: string;
  completionSelectedBackground: string;
  completionSelectedForeground: string;
  commandBackground: string;
  commandForeground: string;
  consoleErrorBackground: string;
  consoleErrorForeground: string;
  consoleInfoBackground: string;
  consoleInfoForeground: string;
};

export const LightTheme: ThemeProperties = {
  completionTitleBackground: "lightgray",
  completionTitleForeground: "#000000",
  completionItemBackground: "#ffffff",
  completionItemForeground: "#000000",
  completionItemDescriptionForeground: "#008000",
  completionSelectedBackground: "#ffff00",
  completionSelectedForeground: "#000000",
  commandBackground: "#ffffff",
  commandForeground: "#000000",
  consoleErrorBackground: "#ff0000",
  consoleErrorForeground: "#ffffff",
  consoleInfoBackground: "#ffffff",
  consoleInfoForeground: "#018786",
};

export const DarkTheme: ThemeProperties = {
  completionTitleBackground: "#052027",
  completionTitleForeground: "white",
  completionItemBackground: "#2f474f",
  completionItemForeground: "white",
  completionItemDescriptionForeground: "#86fab0",
  completionSelectedBackground: "#eeff41",
  completionSelectedForeground: "#000000",
  commandBackground: "#052027",
  commandForeground: "white",
  consoleErrorBackground: "red",
  consoleErrorForeground: "white",
  consoleInfoBackground: "#052027",
  consoleInfoForeground: "#ffffff",
};

interface Props extends React.HTMLAttributes<HTMLElement> {
  colorscheme: ColorScheme;
}

const ColorSchemeProvider: React.FC<Props> = ({ colorscheme, children }) => {
  let theme = LightTheme;
  if (colorscheme === ColorScheme.System) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      theme = DarkTheme;
    }
  } else if (colorscheme === ColorScheme.Dark) {
    theme = DarkTheme;
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export const styled = baseStyled as ThemedStyledInterface<ThemeProperties>;

export default ColorSchemeProvider;
