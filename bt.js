var noble = require('noble');

var address = "ab:ab:ab:ab:ab:ab";

var jsonfile = require('jsonfile');
const file = "data/bt.json";
jsonfile.readFile(file, function(err, obj) {
  if(!err){
    address = obj.address;
    exports.address = address;
  }
});

exports.address = address;

//setTimeout(function() {
//  console.log(noble.state);
//  noble.startScanning([],true); 
//}, 2000);

noble.on('stateChange', function(state) {
  console.log('BT address is', noble.address);
  address = noble.address;
  exports.address = address;
  var json = {address: address};
  jsonfile.writeFile(file,json,function(err){
    if(err)
      console.error(err);
  });
  if(state === 'poweredOn'){
    noble.startScanning([],true);
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

/*  peripheral.connect(function(error) {
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
*/
}
