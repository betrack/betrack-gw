var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

var jsonfile = require('jsonfile');
const file = "temp.json";
module.exports = {
    file: file
};

board.on("ready", function() {
  var thermometer = new five.Thermometer({
    controller: "BMP180",
    freq: 250
  });

  thermometer.on("change", function() {
    console.log("Temperature change celsius: ", this.celsius);
    var json = {temp: this.celsius};
    jsonfile.writeFile(file,json,function(err){
      if(err)
        console.error(err);
    });
  });
});