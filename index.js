// Connected devices
const state = {
  peripherals: {},
  central: null,
}

const peripheral = require('./peripheral');
const central = require('./central');

peripheral(state);
central(state);
