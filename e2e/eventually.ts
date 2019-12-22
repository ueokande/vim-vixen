const defaultInterval = 100;
const defaultTimeout = 2000;

type Handler = () => void

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
 
const eventually = async (
  fn: Handler,
  timeout = defaultTimeout,
  interval = defaultInterval,
): Promise<void> => {
  const start = Date.now();
  const loop = async() => {
    try {
      await fn();
    } catch (err) {
      if (Date.now() - start > timeout) {
        throw err;
      }
      await sleep(interval);
      await loop();
    }
  };
  await loop();
};

export default eventually;
