var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');
var jsonfile = require('jsonfile');
var chokidar = require('chokidar');
var del = require('node-delete');

var bt = require('./bt.js');
var location = require('./location');
var temperature = require('./temp');

var GWminutes = 1;
setInterval(function() {
  console.log('Gateway status every ' + GWminutes + ' minutes.');
  var time = new Date();
  var timestamp = time.toUTCString();
  time.setHours(time.getHours()-3);
  var json = {time: time.toISOString(), temp: temperature.temp, lat: location.lat, lon: location.lon};
  jsonfile.writeFile('/data/gw/'+ timestamp + '.json',json,function(err){
    if(err)
      console.error(err);
  });
}, GWminutes * 60 * 1000);

client.on('connect', function() {
  console.log("MQTT connected");

  chokidar.watch('/data/gw',{
    persistent: true,
    ignored: /[\/\\]\./,
    ignoreInitial: false,
    awaitWriteFinish: true
  }).on('add', function(event, path) {
    console.log(event);
    jsonfile.readFile(event, function(err, obj) {
      if(err)
        console.log(err);
      else{
        var state = obj.time+","+obj.temp.toFixed(1)+","+obj.lat.toFixed(7)+","+obj.lon.toFixed(7);
        client.publish("gw/"+bt.address, state);
        console.log(bt.address, state);
        del(event, function (err, files) {
          //console.log('Deleted file', files);
        });
      }
    });
  });

  chokidar.watch('/data/tag',{
    persistent: true,
    ignored: /[\/\\]\./,
    ignoreInitial: false,
    awaitWriteFinish: true
  }).on('add', function(event, path) {
    console.log(event);
    jsonfile.readFile(event, function(err, obj) {
      if(err)
        console.log(err);
      else{
        var state = obj.time+","+obj.temp.toFixed(1)+","+obj.batt.toFixed(1)+","+obj.packet;
        client.publish("tag/"+obj.address+"/"+bt.address, state);
        console.log(obj.address,bt.address, state);
        del(event, function (err, files) {
          //console.log('Deleted file', files);
        });
      }
    });
  });
});

client.on('error', function(error) {
  console.log(error);
});
