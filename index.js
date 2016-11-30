var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');
var jsonfile = require('jsonfile');
var fsmonitor = require('fsmonitor');
var del = require('node-delete');

var bt = require('./bt.js');
var location = require('./location');
var temperature = require('./temp');

var GWminutes = 0.1;
var TAGminutes = 1;

client.on('connect', function() {
  console.log("MQTT connected");

  fsmonitor.watch('gw', null, function(change) {
    change.addedFiles.forEach(function(file){
      jsonfile.readFile('gw/'+ file, function(err, obj) {
        if(err)
          console.log(err);
        else{
          var state = obj.time+","+obj.temp.toFixed(1)+","+obj.lat.toFixed(7)+","+obj.lon.toFixed(7);
          client.publish("gw/"+bt.address, state);
          console.log(bt.address, state);
          del('gw/' + file, function (err, paths) {
            console.log('Deleted file', paths);
          });
        }
      });
    });
  });

  fsmonitor.watch('tag', null, function(change) {
    change.addedFiles.forEach(function(file){
      jsonfile.readFile('tag/'+ file, function(err, obj) {
        if(err)
          console.log(err);
        else{
          var state = obj.time+","+obj.temp.toFixed(1)+","+obj.batt.toFixed(1)+","+obj.packet;
          client.publish("tag/"+obj.address+"/"+bt.address, state);
          console.log(obj.address,bt.address, state);
          del('tag/' + file, function (err, paths) {
            console.log('Deleted file', paths);
          });
        }
      });
    });
  });

  var packet = 0;
  setInterval(function() {
    console.log('Tag post every ' + TAGminutes + ' minutes.');
    var time = new Date();
    time.setHours(time.getHours()-3);
    var state = time.toISOString()+",";
    state = state + '10.0';
    state = state + ",85," + (packet++); //85 Batt
    client.publish("tag/11:11:11:11:11:11/"+bt.address, state);
    console.log(bt.address,state);
  }, TAGminutes * 60 * 1000);
});

client.on('error', function(error) {
  console.log(error);
});

setInterval(function() {
  console.log('Gateway status every ' + GWminutes + ' minutes.');
  var time = new Date();
  var timestamp = time.toUTCString();
  time.setHours(time.getHours()-3);
  var json = {time: time.toISOString(), temp: temperature.temp, lat: location.lat, lon: location.lon};
  jsonfile.writeFile('gw/'+ timestamp + '.json',json,function(err){
    if(err)
      console.error(err);
  });
}, GWminutes * 60 * 1000);
