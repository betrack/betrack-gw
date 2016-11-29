var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

var temp = 20.0;

var jsonfile = require('jsonfile');
const file = "temp.json";
jsonfile.readFile(tempFile, function(err, obj) {
  if(!err){
    temp = obj.temp;
  }
});
exports.temp = temp;

board.on("ready", function() {
  var thermometer = new five.Thermometer({
    controller: "BMP180",
    freq: 250
  });

  thermometer.on("change", function() {
    console.log("Temperature change celsius: ", this.celsius);
    temp = this.celsius;
    exports.temp = temp;
    var json = {temp: temp};
    jsonfile.writeFile(file,json,function(err){
      if(err)
        console.error(err);
    });
  });
});
