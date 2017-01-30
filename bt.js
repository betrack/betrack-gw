var noble = require('noble');

var address = process.env.BETRACK_ADDRESS;
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
  peripheral.advertisement = [];
  peripheral.advertisement.serviceData = [];
  peripheral.advertisement.serviceData[0] = [];
  peripheral.advertisement.serviceData[0].data = [];
  peripheral.advertisement.serviceData[0].data = Buffer.from([0,0,0,0,0,0,0,0,0,0,0]);
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
  if(localName === 'Bt'){
    console.log('Found Bt device:', address, ' Rssi:', rssi);
    if(peripheral.advertisement.serviceData.length)
      save(peripheral);
  }
});

var devices = {};

function save(peripheral) {
  var buffer = peripheral.advertisement.serviceData[0].data;
  var batt = buffer.readUIntBE(1, 1);
  var temp = buffer.readIntBE(3, 2);
  var packet = buffer.readIntBE(6, 4);
  console.log('Batt:', batt, ' Temp:', temp, ' Packet:', packet);

  var time = new Date();
  devices[address] = devices[address] || [];
  if(time > devices[address]){
    var timestamp = peripheral.address + '_' + time.toISOString();
    var time4post = new Date(+time);
    time4post.setHours(time4post.getHours()-3);
    var json = {address:peripheral.address, time: time4post.toISOString(), temp:temp, batt: batt, packet:packet};
    jsonfile.writeFile('/data/tag/'+ timestamp.replace(/[^a-z0-9]/gi, '_') + '.json',json,function(err){
      if(err)
        console.error(err);
    });

    time.setMinutes(time.getMinutes()+10);
    devices[address] = time;
  }
}
