try{
  var raspi = require('raspi-io');
  var five = require('johnny-five');
  var board = new five.Board({
    io: new raspi()
  });
}
catch(err){
  console.error(err);
}

var jsonfile = require('jsonfile');
const file = "temp.json";
module.exports = {
    file: file
};
try{
  board.on("ready", function() {
    try{
      var thermometer = new five.Thermometer({
        controller: "BMP180",
        freq: 250
      });
    }
    catch(err){
      console.error(err);
    }

    try{
      thermometer.on("change", function() {
        console.log("Temperature change celsius: ", this.celsius);
        var json = {temp: this.celsius};
        jsonfile.writeFile(file,json,function(err){
          if(err)
            console.error(err);
        });
      });
    }
    catch(err){
      console.error(err);
    }
  });
}
catch(err){
  console.error(err);
}    
