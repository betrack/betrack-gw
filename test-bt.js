var noble = require('noble');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn'){
    console.log('BT address is', noble.address);
    noble.startScanning();
  }
  else{
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) { 
  var address = peripheral.address;
  var rssi = peripheral.rssi;
  console.log('Found device: ', address, ' ', rssi);
  var localName = peripheral.advertisement.localName;
  if(localName){
    console.log('Found beacon: ', localName);
    explore(peripheral);
  }
});

function explore(peripheral) {
  peripheral.on('disconnect', function() {
    console.log('Disconnected: ', peripheral.advertisement.localName);
  });

  peripheral.connect(function(error) {
    if(error)
      console.log(error);
    else
      peripheral.updateRssi(function(error, rssi){
        if(error)
          console.log(error);
        else
          console.log('Changed rssi: ',rssi);
      });
  });
}
