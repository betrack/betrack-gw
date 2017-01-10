var noble = require('noble');

var address = "ab:ab:ab:ab:ab:ab";
exports.address = address;

var jsonfile = require('jsonfile');
const file = "/data/bt.json";
jsonfile.readFile(file, function(err, obj) {
  if(!err){
    address = obj.address;
    exports.address = address;
  }
});

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

/*var TAGminutes = 0.1;
var packet = 0;
setInterval(function() {
  console.log('Tag post every ' + TAGminutes + ' minutes.');
  var peripheral = [];
  peripheral.address = "11:11:11:11:11:11";
  peripheral.rssi = 0;
  peripheral.packet = (packet++);
  save(peripheral);
}, TAGminutes * 60 * 1000);*/

noble.on('discover', function(peripheral) { 
  var address = peripheral.address;
  var rssi = peripheral.rssi;
  //console.log('Found device: ', address, ' ', rssi);
  var localName = peripheral.advertisement.localName;
  if(localName){
    console.log(peripheral.advertisement);
    save(peripheral);
  }
});

var packets = 0;

function save(peripheral) {
  var time = new Date();
  var timestamp = time.toUTCString();
  time.setHours(time.getHours()-3);
  var json = {address:peripheral.address, time: time.toISOString(), temp:peripheral.rssi, batt: 85, packet:(packets++)};
  jsonfile.writeFile('/data/tag/'+ timestamp + '.json',json,function(err){
    if(err)
      console.error(err);
  });
}
