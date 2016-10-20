var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');

var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

var GWminutes = 0.5;
var TAGminutes = 0.1;

var temperature = 0.0;

client.on('connect', function() {
  console.log("MQTT connected");
  setInterval(function() {
    console.log('Gateway post every ' + GWminutes + ' minutes.');
    var time = new Date();
    time.setHours(time.getHours()-3);
    var state = time.toISOString()+",";
    state = state + temperature.toFixed(1);
  	state = state + ",-34.594113,-58.433810"; //Jufre 570, CABA
    client.publish("gw/ab:ab:ab:ab:ab:ab", state);
    console.log(state);
  }, GWminutes * 60 * 1000);

  var packet = 0;
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

board.on("ready", function() {
  var thermometer = new five.Thermometer({
    controller: "BMP180",
    freq: 250
  });

  thermometer.on("change", function() {
    console.log("Temperature change celsius: ", this.celsius);
    temperature = this.celsius;
  });
});

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
