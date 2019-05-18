const bleno = require('bleno');


const UB_RELAYER_NAME = 'UB Relayer'
const UB_SSID = '00756c74-7261-6c69-6768-74206265616d'

let BlenoPrimaryService = bleno.PrimaryService;

let characteristics = require('./characteristics');


function start(state) {
  console.log('UB relayer');
  bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
      bleno.startAdvertising(UB_RELAYER_NAME, [UB_SSID]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
      bleno.setServices([
        new BlenoPrimaryService({
          uuid: UB_SSID,
          characteristics: characteristics.map(Characteristic => new Characteristic(state))
        })
      ]);
    }
  });
}

module.exports = start;
