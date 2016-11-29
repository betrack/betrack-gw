var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

var jsonfile = require('jsonfile');
const file = "temp.json";

var temp = 20.0;
module.exports = {
    temp: temp
};

board.on("ready", function() {
  var thermometer = new five.Thermometer({
    controller: "BMP180",
    freq: 250
  });

  thermometer.on("change", function() {
    console.log("Temperature change celsius: ", this.celsius);
    temp = this.celsius;
    var json = {temp: temp};
    jsonfile.writeFile(file,json,function(err){
      if(err)
        console.error(err);
    });
  });
});