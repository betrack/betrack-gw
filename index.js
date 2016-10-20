var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');

var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

var minutes = 0.5;
var delay = minutes * 60 * 1000;

var temperature = 0.0;

client.on('connect', function() {
  console.log("MQTT connected");
  setInterval(function() {
    console.log('Post every ' + minutes + ' minutes.');
    var time = new Date();
    time.setHours(time.getHours()-3);
    var state = time.toISOString()+",";
    state = state + temperature.toFixed(1);
  	state = state + ",-34.594113,-58.433810"; //Jufre 570, CABA
    client.publish("gw/ab:ab:ab:ab:ab:ab", state)
    console.log(state);
  }, delay);
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
