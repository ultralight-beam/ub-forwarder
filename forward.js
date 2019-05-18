

function forwardToPeripherals(state, data) {
  Object.values(state.peripherals).forEach(p => {
    if (!p.forwardCharacteristic) return
    p.forwardCharacteristic.write(data, false, function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
}

function forwardToCentral(state, data) {
  if (state.central && state.central._updateValueCallback) {
    state.central._updateValueCallback(data);
  }
}
