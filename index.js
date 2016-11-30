var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');
var jsonfile = require('jsonfile');

var bt = require('./bt.js');
var location = require('./location');
var temperature = require('./temp');

var GWminutes = 0.1;
var TAGminutes = 1;

client.on('connect', function() {
  console.log("MQTT connected");

  var time = new Date();
  time.setHours(time.getHours()-3);
  var state = time.toISOString()+","+temperature.temp.toFixed(1)+","+location.lat.toFixed(7)+","+location.lon.toFixed(7);
  client.publish("gw/"+bt.address, state);
  console.log(bt.address, state);

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
