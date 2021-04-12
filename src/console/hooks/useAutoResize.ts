import React from "react";
import ConsoleFrameClient from "../clients/ConsoleFrameClient";

const useAutoResize = () => {
  const [prevWidth, setPrevWidth] = React.useState(-1);
  const [prevHeight, setPrevHeight] = React.useState(-1);

  const consoleFrameClient = React.useMemo(() => {
    return new ConsoleFrameClient();
  }, []);

  React.useLayoutEffect(() => {
    const {
      scrollWidth: width,
      scrollHeight: height,
    } = document.getElementById("vimvixen-console")!;
    consoleFrameClient.resize(width, height);

    if (width === prevWidth && height === prevHeight) {
      return;
    }

    setPrevWidth(width);
    setPrevHeight(height);
  });
};

export default useAutoResize;
