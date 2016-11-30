var noble = require('noble');
console.log('State is',noble.state);
console.log('Address is',noble.address);

noble.on('addressChange', function(address) {
    console.log('Address change', address);
});

noble.on('stateChange', function(state) {
  console.log('State change',state);
  if (state === 'poweredOn'){
    noble.startScanning();
  }
  else{
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) { 
  var address = peripheral.address;
  var rssi = peripheral.rssi;
  var localName = peripheral.advertisement.localName;
  console.log('Found device', address, localName, rssi);
  if(localName){
    console.log('Found beacon', localName);
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

//setInterval(function(){
//  console.log('State is',noble.state);
//  console.log('Address is',noble.address);
//},1000);
