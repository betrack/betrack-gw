var noble = require('noble');
console.log('State is',noble.state);
console.log('Address is',noble.address);

noble.on('addressChange', function(address) {
    console.log('Address change', address);
});

noble.on('stateChange', function(state) {
  console.log('State change',state);
  if (state === 'poweredOn'){
    noble.startScanning([],true);
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
  console.log(peripheral.advertisement);
  if(localName){
    console.log('Found beacon', localName);
    explore(peripheral);
  }
});

function explore(peripheral) {
  console.log(peripheral.advertisement.serviceData);
  console.log(peripheral.advertisement.serviceData[0].data);
  console.log(peripheral.advertisement.serviceData[0].data[1]);
  console.log(peripheral.advertisement.serviceData[0].data[3]);
  var buffer = peripheral.advertisement.serviceData[0].data;
  var batt = buffer.readUIntBE(1, 1);
  var temp = buffer.readIntBE(3, 1);
  console.log(batt);
  console.log(temp);
}

//setInterval(function(){
//  console.log('State is',noble.state);
//  console.log('Address is',noble.address);
//},1000);
