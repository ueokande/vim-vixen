import baseStyled, { ThemedStyledInterface } from "styled-components";
import { ThemeProperties } from "./theme";

const styled = baseStyled as ThemedStyledInterface<ThemeProperties>;

export default styled;
