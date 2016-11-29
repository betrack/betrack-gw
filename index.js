var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');
var jsonfile = require('jsonfile');

var bt = require('./bt.js');
var location = require('./location');
var temperature = require('./temp');

var GWminutes = 1;
var TAGminutes = 0.2;

setInterval(function() {
  console.log(temperature);
}, 1000);

client.on('connect', function() {
  console.log("MQTT connected");
  setInterval(function() {
    console.log('Gateway post every ' + GWminutes + ' minutes.');

    var time = new Date();
    time.setHours(time.getHours()-3);
    var state = time.toISOString()+","+temperature.temp.toFixed(1)+","+location.lat.toFixed(7)+","+location.lon.toFixed(7);
    client.publish("gw/"+bt.address, state);
    console.log(bt.address, state);
  }, GWminutes * 60 * 1000);

  var packet = 0;
  var temperature = 10.0;
  setInterval(function() {
    console.log('Tag post every ' + TAGminutes + ' minutes.');
    var time = new Date();
    time.setHours(time.getHours()-3);
    var state = time.toISOString()+",";
    state = state + temperature.toFixed(1);
    state = state + ",85," + (packet++); //85 Batt
    client.publish("tag/11:11:11:11:11:11/ab:ab:ab:ab:ab:ab", state);
    console.log(state);
  }, TAGminutes * 60 * 1000);
});
