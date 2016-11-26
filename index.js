var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');
var jsonfile = require('jsonfile');

var bt = require('./bt.js');
var location = require('./location');
var temperature = require('./temp');

var tempFile = temperature.file;

var GWminutes = 1;
var TAGminutes = 0.2;

client.on('connect', function() {
  console.log("MQTT connected");
  setInterval(function() {
    console.log('Gateway post every ' + GWminutes + ' minutes.');

    var lat =-34.594113;
    var lon =-58.433810; //Jufre 570, CABA
    jsonfile.readFile(location.file, function(err, obj) {
      if(!err){
        lat = obj.lat;
        lon = obj.lon;
      }
    });

    var temp = 20.0;
    jsonfile.readFile(tempFile, function(err, obj) {
      if(!err){
        temp = obj.temp;
      }
    });

    var address = "ab:ab:ab:ab:ab:ab";
    jsonfile.readFile(bt.file, function(err, obj) {
      if(!err){
        temp = obj.address;
      }
    });

    var time = new Date();
    time.setHours(time.getHours()-3);
    var state = time.toISOString()+","+temp.toFixed(1)+","+lat.toFixed(7)+","+lon.toFixed(7);
    client.publish("gw/"+address, state);
    console.log(state);
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
