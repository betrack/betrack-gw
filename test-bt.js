var noble = require('noble');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn')
    noble.startScanning();
  else
    noble.stopScanning();
});

noble.on('discover', function(peripheral) { 
  var macAddress = peripheral.uuid;
  var rss = peripheral.rssi;
  var localName = peripheral.advertisement.localName; 
  console.log('found device: ', macAddress, ' ', localName, ' ', rss);
  console.log(peripheral);
});
