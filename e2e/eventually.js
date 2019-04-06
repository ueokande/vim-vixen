let defaultInterval = 100;
let defaultTimeout = 2000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
 
const eventually = async (fn, timeout = defaultTimeout, interval = defaultInterval) => {
  let start = Date.now();
  let loop = async() => {
    try {
      await fn();
    } catch (err) {
      if (Date.now() - start > timeout) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, interval))
      await loop();
    }
  };
  await loop();
};
module.exports = eventually;
