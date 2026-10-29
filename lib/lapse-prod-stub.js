function Lapse() {
  return null;
}

function getSharedEngine() {
  return {
    install() {},
    registerGSAP() {},
  };
}

module.exports = {
  Lapse,
  getSharedEngine,
};
