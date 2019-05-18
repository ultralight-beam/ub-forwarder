const noble = require('@abandonware/noble');

const UB_UUID = '00756c74-7261-6c69-6768-74206265616d';
const FORWARD_UUID = '00000000-0000-0000-0000-000000000001';


function start(state) {
  console.log('UB central')
  noble.on('stateChange', state => {
    if (state === 'poweredOn') {
      console.log('Scanning...');
      noble.startScanning([UB_UUID]);
    } else {
      noble.stopScanning();
    }
  });

  noble.on('discover', peripheral => {
      // connect to the first peripheral that is scanned
      //noble.stopScanning();
      const name = peripheral.advertisement.localName;
      console.log(`Connecting to ${name} ${peripheral.id}...`);
      connectAndSetUp(peripheral);
  });

  function connectAndSetUp(peripheral) {
    peripheral.connect(error => {
      if (error) console.error({error});

      state.peripherals[id] = peripheral;

      console.log('Connected to :: ', peripheral.id);

      // specify the services and characteristics to discover
      const serviceUUIDs = [UB_UUID];
      const characteristicUUIDs = [FORWARD_UUID];

      peripheral.discoverSomeServicesAndCharacteristics(
        serviceUUIDs,
        characteristicUUIDs,
        function (error, services, characteristics) { // onDiscover
          console.log('Discovered services and characteristics');
          const forwardCharacteristic = characteristics.find(c => c.uuid === FORWARD_UUID);
          if (!forwardCharacteristic) return
          peripheral.forwardCharacteristic = forwardCharacteristic;

          // data callback receives notifications
          forwardCharacteristic.on('data', (data, isNotification) => {
            console.log(`Received :: ${data}`);
            forwardToCentral(state, data);
          });

          // subscribe to be notified whenever the peripheral update the characteristic
          forwardCharacteristic.subscribe(error => {
            if (error) {
              console.error('Error subscribing to forwardCharacteristic!');
            } else {
              console.log('Subscribed for forwardCharacteristic notifications!');
            }
          });
        }
      );
    });
    peripheral.on('disconnect', () => {
      console.log('Disconnected!')
      delete state.peripherals[peripheral.id]
    });
  }


}

module.exports = start;
